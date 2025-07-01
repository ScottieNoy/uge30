"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Trophy, Beer, Zap, Star } from "lucide-react";
import { AssignPoints, JERSEY_CATEGORIES, JerseyCategory, User } from "@/types";
import { toast } from "sonner";
import { sendNotificationToUser } from "@/lib/sendNotification";

interface PointsAssignmentProps {
  targetUser: User;
  currentUser: User | null; // Use UserType for Supabase user object
  onClose: () => void;
  onAssignPoints: (assignPoints: AssignPoints) => Promise<void>;
}

const pointCategories = [
  {
    id: "competition",
    name: "Competition",
    icon: Trophy,
    points: 50,
    color: "from-yellow-400 to-orange-500",
    category: JERSEY_CATEGORIES[0],
  },
  {
    id: "drink",
    name: "Drink",
    icon: Beer,
    points: 10,
    color: "from-blue-400 to-cyan-400",
    category: JERSEY_CATEGORIES[1],
  },
  {
    id: "challenge",
    name: "Challenge",
    icon: Zap,
    points: 25,
    color: "from-purple-500 to-pink-500",
    category: JERSEY_CATEGORIES[2],
  },
  {
    id: "bonus",
    name: "Bonus",
    icon: Star,
    points: 15,
    color: "from-green-400 to-emerald-500",
    category: JERSEY_CATEGORIES[3],
  },
];

const PointsAssignment = ({
  targetUser,
  currentUser,
  onClose,
  onAssignPoints,
}: PointsAssignmentProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAssignPoints = async (
    category: JerseyCategory,
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
        subcategory: "beer",
        value: points,
        note: `Points assigned by ${currentUser.id}`,
      });

      await sendNotificationToUser({
        userId: targetUser.id,
        title: "💥 Point Received!",
        body: `${
          currentUser.firstname
        } just gave you ${points} points for ${category.toLowerCase()}.`,
        url: "/my", // or link to scoreboard/profile/etc
      });
      toast("Points assigned successfully!");
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
              Select category to assign points
            </p>
          </div>

          {/* Point Categories */}
          <div className="grid grid-cols-1 gap-3">
            {pointCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  onClick={() =>
                    handleAssignPoints(category.category, category.points)
                  }
                  disabled={isSubmitting}
                  className="h-auto p-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white justify-between"
                  variant="ghost"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}
                    >
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-white/60">Tap to assign</div>
                    </div>
                  </div>
                  <Badge
                    className={`bg-gradient-to-r ${category.color} text-white border-0`}
                  >
                    +{category.points}
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
