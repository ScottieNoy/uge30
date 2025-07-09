"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Trophy, Beer, Zap, Star } from "lucide-react";
import { AssignPoints, Jersey, User, Category } from "@/types";
import { toast } from "sonner";

interface PointsAssignmentProps {
  targetUser: User;
  currentUser: User | null;
  onClose: () => void;
  onAssignPoints: (assignPoints: AssignPoints) => Promise<void>;
}

const allowedPointActions = [
  {
    id: "competition",
    label: "Competition",
    icon: Trophy,
    points: 50,
    category: "competition" as Category,
    jersey_id: "45158f97-3418-401c-b02f-8cd91d7ef7d3" as Jersey,
    color: "from-yellow-400 to-orange-500",
  },
  {
    id: "drink",
    label: "Drink",
    icon: Beer,
    points: 10,
    category: "øl" as Category,
    jersey_id: "45158f97-3418-401c-b02f-8cd91d7ef7d3" as Jersey,
    color: "from-blue-400 to-cyan-400",
  },
  {
    id: "challenge",
    label: "Challenge",
    icon: Zap,
    points: 25,
    category: "bonus" as Category,
    jersey_id: "45158f97-3418-401c-b02f-8cd91d7ef7d3" as Jersey,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "bonus",
    label: "Bonus",
    icon: Star,
    points: 15,
    category: "bonus" as Category,
    jersey_id: "45158f97-3418-401c-b02f-8cd91d7ef7d3" as Jersey,
    color: "from-green-400 to-emerald-500",
  },
];

const PointsAssignment = ({
  targetUser,
  currentUser,
  onClose,
  onAssignPoints,
}: PointsAssignmentProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    jersey_id: Jersey,
    category: Category,
    value: number
  ) => {
    if (!currentUser) {
      toast.error("You must be logged in to assign points.");
      return;
    }

    if (targetUser.id === currentUser.id) {
      toast.error("You cannot assign points to yourself.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onAssignPoints({
        category,
        value,
        note: `Assigned via QR by ${currentUser.displayname}`,
        jersey_id, // empty string if not available, or provide a valid string
      });

      // toast.success("Points assigned successfully!");
      onClose();
    } catch (error: any) {
      // toast.error("Error assigning points: " + error.message);
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
          {/* User Info */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {targetUser.firstname[0]?.toUpperCase()}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg">
              {targetUser.firstname} {targetUser.lastname}
            </h3>
            <p className="text-white/60 text-sm">
              Choose a category to assign points
            </p>
          </div>

          {/* Category Buttons */}
          <div className="grid grid-cols-1 gap-3">
            {allowedPointActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  onClick={() =>
                    handleSubmit(
                      action.jersey_id,
                      action.category,
                      action.points
                    )
                  }
                  disabled={isSubmitting}
                  className="h-auto p-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white justify-between"
                  variant="ghost"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{action.label}</div>
                      <div className="text-sm text-white/60">Tap to assign</div>
                    </div>
                  </div>
                  <Badge
                    className={`bg-gradient-to-r ${action.color} text-white border-0`}
                  >
                    +{action.points}
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
