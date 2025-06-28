"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Users, ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import QRScanner from "./QRScanner";
import PointsAssignment from "./PointsAssignment";

const mockCurrentUser = {
  id: "user1",
  name: "Alex Smith",
};

const mockUsers = [
  { id: "user2", name: "Sarah Johnson" },
  { id: "user3", name: "Mike Chen" },
  { id: "user4", name: "Emma Davis" },
];

const Scan = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [showPointsAssignment, setShowPointsAssignment] = useState(false);
  const [targetUser, setTargetUser] = useState<any>(null);

  const handleQRScan = (qrData: string) => {
    console.log("QR Code scanned:", qrData);

    // Parse QR code to find user
    // For now, simulate finding a user
    const foundUser = mockUsers.find((user) => qrData.includes(user.id));

    if (foundUser) {
      setTargetUser(foundUser);
      setShowScanner(false);
      setShowPointsAssignment(true);
    } else {
      toast({
        title: "User Not Found",
        description: "The scanned QR code doesn't match any user.",
        variant: "destructive",
      });
      setShowScanner(false);
    }
  };

  const handleAssignPoints = async (
    userId: string,
    category: string,
    points: number
  ) => {
    // This would connect to Supabase to actually assign points
    console.log("Assigning points:", { userId, category, points });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would call your Supabase function to add points
    // await supabase.from('points').insert({ user_id: userId, category, points, assigned_by: currentUser.id });
  };

  const generateMyQRCode = () => {
    // Generate QR code data for current user
    return `user:${mockCurrentUser.id}`;
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
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Main Actions */}
        <div className="space-y-6">
          {/* Scan QR Code */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <QrCode className="h-6 w-6" />
                <span>Scan QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Scan another participant's QR code to give them points for
                competitions, drinks, or challenges.
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

          {/* My QR Code */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-3">
                <Users className="h-6 w-6" />
                <span>My QR Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">
                Show this QR code to other participants so they can give you
                points.
              </p>
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-600" />
                    <p className="text-sm text-gray-600">QR Code Here</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {generateMyQRCode()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-800 font-medium">
                  {mockCurrentUser.name}
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
          currentUser={mockCurrentUser}
          onClose={() => setShowPointsAssignment(false)}
          onAssignPoints={handleAssignPoints}
        />
      )}
    </div>
  );
};

export default Scan;
