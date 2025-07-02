"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Beer } from "lucide-react";
import { AssignPoints, JERSEY_CATEGORIES, JerseyCategory, User, JERSEY_SUBCATEGORIES, Subcategory, JERSEY_SUBCATEGORY_POINTS } from "@/types";
import { toast } from "sonner";
import { sendNotificationToUser } from "@/lib/sendNotification";

interface PointsAssignmentProps {
  targetUser: User;
  currentUser: User | null;
  onClose: () => void;
  onAssignPoints: (assignPoints: AssignPoints) => Promise<void>;
}

const PointsAssignment = ({
  targetUser,
  currentUser,
  onClose,
  onAssignPoints,
}: PointsAssignmentProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only show the subcategories that apply to "gyldne_blaerer"
  const gyldneBlaererSubcategories: Subcategory[] = JERSEY_SUBCATEGORIES["gyldne_blaerer"];

  // Handle assigning points, now with dynamic points for each subcategory
  const handleAssignPoints = async (
    category: JerseyCategory,
    subcategory: Subcategory, // Now it's based on the subcategory dynamically selected
    points: number
  ) => {
    if (!currentUser) {
      toast("You must be logged in to assign points.");
      return;
    }

    if (targetUser.id === currentUser.id) {
      toast("You cannot assign points to yourself.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAssignPoints({
        category: category,
        subcategory: subcategory,
        value: points,
        note: `Points assigned by ${currentUser.id}`,
      });

      await sendNotificationToUser({
        userId: targetUser.id,
        title: "💥 Point Received!",
        body: `${currentUser.firstname} just gave you ${points} points for ${category.toLowerCase()}.`,
        url: "/my", // link to profile or scoreboard
      });
      onClose();
    } catch (error) {
      toast("Error assigning points: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Assign Points</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Target User Display */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {targetUser.firstname.charAt(0).toUpperCase()}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg">
              {targetUser.firstname} {targetUser.lastname}
            </h3>
            <p className="text-white/60 text-sm">
              Select subcategory to assign points
            </p>
          </div>

          {/* Point Categories for Gyldne Blåre */}
          <div className="grid grid-cols-1 gap-3">
            {gyldneBlaererSubcategories.map((subcategory) => {
              const points = JERSEY_SUBCATEGORY_POINTS["gyldne_blaerer"][subcategory] || 0; // Fetch points value for subcategory
              return (
                <Button
                  key={subcategory}
                  onClick={() =>
                    handleAssignPoints("gyldne_blaerer", subcategory, points) // Pass dynamic points value
                  }
                  disabled={isSubmitting}
                  className="h-auto p-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white justify-between"
                  variant="ghost"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 flex items-center justify-center`}
                    >
                      <Beer className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{subcategory}</div>
                      <div className="text-sm text-white/60">Tap to assign</div>
                    </div>
                  </div>
                  <Badge
                    className={`bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0`}
                  >
                    +{points}
                  </Badge>
                </Button>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-white/40 text-xs">
              Points will be added immediately
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsAssignment;
