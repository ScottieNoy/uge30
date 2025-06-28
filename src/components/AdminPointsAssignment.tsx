"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Shield, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { User } from "@/types";

interface AdminPointsAssignmentProps {
  users: User[];
  currentUser: User | null;
  onClose: () => void;
  onAssignPoints: (
    userId: string,
    category: string,
    points: number,
    reason?: string
  ) => Promise<void>;
}

const AdminPointsAssignment = ({
  users,
  currentUser,
  onClose,
  onAssignPoints,
}: AdminPointsAssignmentProps) => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [pointsAmount, setPointsAmount] = useState<number>(0);
  const [category, setCategory] = useState<string>("admin");
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const categories = [
    { id: "admin", name: "Admin Adjustment" },
    { id: "competition", name: "Competition" },
    { id: "drink", name: "Drink" },
    { id: "challenge", name: "Challenge" },
    { id: "bonus", name: "Bonus" },
    { id: "penalty", name: "Penalty" },
  ];

  const handleAssignPoints = async () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user",
        variant: "destructive",
      });
      return;
    }

    if (pointsAmount === 0) {
      toast({
        title: "Error",
        description: "Please enter a point amount",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onAssignPoints(selectedUser, category, pointsAmount, reason);

      const selectedUserName =
        users.find((u) => u.id === selectedUser)?.firstname || "User";
      const action = pointsAmount > 0 ? "added" : "deducted";

      toast({
        title: "Points Assigned!",
        description: `${Math.abs(pointsAmount)} points ${action} ${
          pointsAmount > 0 ? "to" : "from"
        } ${selectedUserName}`,
      });

      // Reset form
      setSelectedUser("");
      setPointsAmount(0);
      setReason("");
      setCategory("admin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const adjustPoints = (delta: number) => {
    setPointsAmount((prev) => Math.max(-1000, Math.min(1000, prev + delta)));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Admin Points Assignment</span>
          </CardTitle>
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
          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="user-select" className="text-white">
              Select User
            </Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.firstname} {user.lastname}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category-select" className="text-white">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Points Amount */}
          <div className="space-y-2">
            <Label htmlFor="points-amount" className="text-white">
              Points Amount
            </Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustPoints(-1)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="points-amount"
                type="number"
                value={pointsAmount}
                onChange={(e) => setPointsAmount(parseInt(e.target.value) || 0)}
                className="bg-white/10 border-white/20 text-white text-center"
                min="-1000"
                max="1000"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustPoints(1)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-white/60 text-xs">
              Use negative values to deduct points
            </p>
          </div>

          {/* Quick Point Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[-50, -10, 10, 50].map((value) => (
              <Button
                key={value}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPointsAmount(value)}
                className="border-white/30 text-white hover:bg-white/10"
              >
                {value > 0 ? "+" : ""}
                {value}
              </Button>
            ))}
          </div>

          {/* Reason (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white">
              Reason (Optional)
            </Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for adjustment..."
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleAssignPoints}
            disabled={isSubmitting || !selectedUser || pointsAmount === 0}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold"
          >
            {isSubmitting ? "Assigning..." : "Assign Points"}
          </Button>

          <div className="text-center">
            <p className="text-white/40 text-xs">
              Admin privileges - Use responsibly
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPointsAssignment;
