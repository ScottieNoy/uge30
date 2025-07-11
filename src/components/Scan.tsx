"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Users, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import QRScanner from "./QRScanner";
import PointsAssignment from "./PointsAssignment";
import { createClient } from "@/lib/supabaseClient";
import { AssignPoints, User } from "@/types";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "sonner";
import { getCurrentStage } from "@/lib/getCurrentStage";
import { sendNotification } from "@/lib/sendNotification";

const Scan = () => {
  const router = useRouter();
  const supabase = createClient();

  const [showScanner, setShowScanner] = useState(false);
  const [showPointsAssignment, setShowPointsAssignment] = useState(false);
  const [targetUser, setTargetUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        toast("You must be logged in to access this page.");
        router.push("/");
        return;
      }

      const { data: userData, error: userDataError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!userData || userDataError) {
        toast("User not found. Please create a profile first.");
        router.push("/");
        return;
      }

      setCurrentUser(userData);
    };

    fetchCurrentUser();
  }, []);

  // Handle QR result
  const handleQRScan = async (qrData: string) => {
    console.log("QR Code scanned:", qrData);

    if (!qrData) {
      toast("No QR Code data found.");
      setShowScanner(false);
      return;
    }

    const userId = qrData.trim();

    const { data: foundUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!foundUser || error) {
      toast("User not found. Please ensure the QR code is valid.");
      setShowScanner(false);
      return;
    }

    setTargetUser(foundUser);
    setShowScanner(false);
    setShowPointsAssignment(true);
  };

  const handleAssignPoints = async (assignPoints: AssignPoints) => {
    if (!currentUser || !targetUser) return;
    const pointId = crypto.randomUUID();
    const stageId = await getCurrentStage();

    if (!stageId) {
      toast.error("Kunne ikke finde en igangværende etape. Prøv igen senere.");
      return;
    }

    // 1. Assign main point to the target user
    const { error: transactionError } = await supabase.rpc(
      "perform_point_and_jersey_insert",
      {
        p_point_id: pointId,
        p_user_id: targetUser.id,
        p_submitted_by: currentUser.id,
        p_value: assignPoints.value,
        p_note: assignPoints.note || "",
        p_stage_id: stageId || "",
        p_jersey_id: assignPoints.jersey_id,
        p_category: assignPoints.category,
      }
    );

    if (transactionError) {
      toast.error("Fejl under point tildeling: " + transactionError.message);
      return;
    }

    // 2. Bonus logic: if Gyldne Blærer, give Flydende Hånd point to giver
    const GYLDNE_BLAERER_ID = "45158f97-3418-401c-b02f-8cd91d7ef7d3";
    const FLYDENDE_HAAND_ID = "c82651a0-7737-4010-9baa-e884259a2b9c";

    if (assignPoints.jersey_id === GYLDNE_BLAERER_ID) {
      const bonusPointId = crypto.randomUUID();

      const { error: bonusError } = await supabase.rpc(
        "perform_point_and_jersey_insert",
        {
          p_point_id: bonusPointId,
          p_user_id: currentUser.id, // giver receives bonus
          p_submitted_by: currentUser.id,
          p_value: 10,
          p_note: `gav en flydende hånd til ${targetUser.displayname}`,
          p_stage_id: stageId,
          p_jersey_id: FLYDENDE_HAAND_ID,
          p_category: "flydende hånd",
        }
      );

      if (bonusError) {
        console.error("Bonus point error:", bonusError);
        toast.error("Kunne ikke tildele bonuspoint til Den Flydende Hånd.");
      }
    }

    // 3. Notify receiver
    toast.success("Pointene er blevet tildelt!");
    await sendNotification({
      userId: targetUser.id,
      broadcast: false,
      title: "💥 Point Received!",
      body: `${currentUser.displayname} gav dig ${assignPoints.value} point for ${assignPoints.category}.`,
      url: "/my",
    });

    setShowPointsAssignment(false);
  };

  return (
    <div className="pt-20 px-4 pb-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Tilbage
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">QR Scanner</h1>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>

        <div className="space-y-6">
          {/* Scan QR */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <QrCode className="h-6 w-6" />
                <span>Scan QR-kode</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Scan en QR-kode for at give point til en anden rytter.
              </p>
              <Button
                onClick={() => setShowScanner(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3"
              >
                <QrCode className="h-5 w-5 mr-2" />
                Start Scanner
              </Button>
            </CardContent>
          </Card>

          {/* My QR */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <Users className="h-6 w-6" />
                <span>Min QR-kode</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="text-white/80 mb-4">
                Vis din QR-kode til andre ryttere for at modtage point.
              </p>
              <div className="flex flex-col items-center w-fit justify-center bg-white p-6 rounded-lg text-center">
                <QRCodeCanvas value={`${currentUser?.id}`} size={180} />
                <p className="text-gray-800 font-medium mt-3">
                  {currentUser?.displayname || "Loading..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showPointsAssignment && targetUser && (
        <PointsAssignment
          targetUser={targetUser}
          currentUser={currentUser}
          onClose={() => setShowPointsAssignment(false)}
          onAssignPoints={handleAssignPoints}
          allowedJerseys={[
            "45158f97-3418-401c-b02f-8cd91d7ef7d3",
            "ad5a8eed-74d5-48ea-8f13-7e9b968419f2",
          ]}
        />
      )}
    </div>
  );
};

export default Scan;
