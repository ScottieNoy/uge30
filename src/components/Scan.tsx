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
    const match = qrData.match(/^([a-zA-Z0-9-]+)$/);

    if (!match) {
      toast("Invalid QR Code");
      setShowScanner(false);
      return;
    }

    const displayName = match[1];

    const { data: foundUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("displayname", displayName)
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

    const { error } = await supabase.from("points").insert({
      user_id: targetUser.id,
      category: assignPoints.category,
      subcategory: assignPoints.subcategory,
      value: assignPoints.value,
      note: assignPoints.note || null,
      submitted_by: currentUser.id,
    });

    if (error) {
      toast("Error assigning points: " + error.message);
    } else {
      toast("Points assigned successfully!");
    }

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
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">QR Scanner</h1>
            <p className="text-blue-100">Give points to other participants</p>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>

        <div className="space-y-6">
          {/* Scan QR */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <QrCode className="h-6 w-6" />
                <span>Scan QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Scan another participant's QR code to assign them points.
              </p>
              <Button
                onClick={() => setShowScanner(true)}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3"
              >
                <QrCode className="h-5 w-5 mr-2" />
                Start Scanning
              </Button>
            </CardContent>
          </Card>

          {/* My QR */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <Users className="h-6 w-6" />
                <span>My QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <p className="text-white/80 mb-4">
                Show this QR code to let others give you points.
              </p>
              <div className="flex flex-col items-center w-fit justify-center bg-white p-6 rounded-lg text-center">
                <QRCodeCanvas value={`${currentUser?.displayname}`} size={180} />
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
        />
      )}
    </div>
  );
};

export default Scan;
