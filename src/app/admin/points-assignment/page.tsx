"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Shield, Trophy } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AssignPointsForm() {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);
  const [jerseys, setJerseys] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userId, setUserId] = useState("");
  const [jerseyId, setJerseyId] = useState("");
  const [value, setValue] = useState(1);
  const [note, setNote] = useState("");
  const pointId = crypto.randomUUID(); // Optional, or let the DB auto-generate

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase
        .from("users")
        .select("id, displayname");
      const { data: jerseysData } = await supabase
        .from("jerseys")
        .select("id, name");
      setUsers(usersData || []);
      setJerseys(jerseysData || []);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { data: sessionData } = await supabase.auth.getSession();
    const adminId = sessionData.session?.user?.id;

    if (!adminId || !userId || !jerseyId || !value) {
      toast.error("Missing required fields");
      setIsSubmitting(false);
      return;
    }

    // Insert point directly since RPC function doesn't exist
    const { error: pointError } = await supabase.from("points").insert({
      id: pointId,
      user_id: userId,
      submitted_by: adminId,
      value: value,
      note: note,
      stage_id: "c06e6ee6-57b7-44b3-9d4a-5c90be333be2",
      category: "admin",
    });

    if (pointError) {
      toast.error("Failed to insert point");
      setIsSubmitting(false);
      return;
    }

    // Link point to jersey
    const { error: jerseyError } = await supabase.from("point_jerseys").insert({
      point_id: pointId,
      jersey_id: jerseyId,
    });

    const transactionError = jerseyError;

    if (transactionError) {
      toast.error("Failed to insert point and jersey");
    } else {
      toast.success("Point + jersey linked ✅");
      // Reset form
      setUserId("");
      setJerseyId("");
      setValue(1);
      setNote("");
    }

    setIsSubmitting(false);
  };

  const adjustPoints = (delta: number) => {
    setValue((prev) => Math.max(-1000, Math.min(1000, prev + delta)));
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-400" />
              <span>Admin Points Assignment</span>
            </CardTitle>
            <p className="text-white/60">
              Assign points to users and link them to jerseys
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Selection */}
              <div className="space-y-2">
                <Label htmlFor="user-select" className="text-white">
                  Select User
                </Label>
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Choose a user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.displayname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Jersey Selection */}
              <div className="space-y-2">
                <Label htmlFor="jersey-select" className="text-white">
                  Select Jersey
                </Label>
                <Select value={jerseyId} onValueChange={setJerseyId}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Choose a jersey..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jerseys.map((jersey) => (
                      <SelectItem key={jersey.id} value={jersey.id}>
                        {jersey.name}
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
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value) || 0)}
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
                {[-50, -10, 10, 50].map((pointValue) => (
                  <Button
                    key={pointValue}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setValue(pointValue)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    {pointValue > 0 ? "+" : ""}
                    {pointValue}
                  </Button>
                ))}
              </div>

              {/* Note (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="note" className="text-white">
                  Note (Optional)
                </Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter reason for point assignment..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || !userId || !jerseyId || !value}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
              >
                <Trophy className="h-4 w-4 mr-2" />
                {isSubmitting ? "Assigning..." : "Assign Points"}
              </Button>

              <div className="text-center">
                <p className="text-white/40 text-xs">
                  Admin privileges - Use responsibly
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
