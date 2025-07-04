"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { QRCodeCanvas } from "qrcode.react";
import { User } from "@/types";
import EnableNotifications from "@/components/EnableNotificationsButton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, User as UserIcon, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AvatarUpload from "@/components/AvatarUpload";
import ProfileStats from "@/components/ProfileStats";
import { toast } from "sonner";

export default function MyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [editForm, setEditForm] = useState(user);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        toast("Error fetching user data: " + error.message);
      } else {
        if (!data.user) {
          toast("You are not logged in. Please log in to view your profile.");
          return;
        }
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (userError) {
          toast("Error fetching user profile: " + userError.message);
          return;
        }
        if (!userData) {
          toast("User not found. Please create a profile first.");
          return;
        }
        const mappedUser: User = {
          id: userData.id,
          firstname: userData.firstname ?? "",
          lastname: userData.lastname ?? "",
          displayname: userData.displayname ?? "",
          avatar_url: userData.avatar_url ?? "",
          emoji: userData.emoji ?? "",
          is_admin: userData.is_admin ?? false,
          role: userData.role ?? "",
          created_at: userData.created_at ?? "",
          updated_at: userData.updated_at ?? "",
        };
        setUser(mappedUser);
        setEditForm(mappedUser);
      }
      setIsEditing(false);
    };

    fetchUser();
    return () => {
      setUser(null);
      setEditForm(null);
    };
  }, [supabase, toast]);

  const handleSave = async () => {
    if (!editForm || !user) return;

    const { data, error } = await supabase
      .from("users")
      .update(editForm)
      .eq("id", user?.id)
      .select()
      .single();

    if (error) {
      toast("Error updating profile: " + error.message);
    } else {
      const mappedUser: User = {
        id: data.id,
        firstname: data.firstname ?? "",
        lastname: data.lastname ?? "",
        displayname: data.displayname ?? "",
        avatar_url: data.avatar_url ?? "",
        emoji: data.emoji ?? "",
        is_admin: data.is_admin ?? false,
        role: data.role ?? "",
        created_at: data.created_at ?? "",
        updated_at: data.updated_at ?? "",
      };
      setUser(mappedUser);
      setIsEditing(false);
      toast("Profile updated successfully!");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(user);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(user);
  };

  const handleAvatarUpload = async (publicUrl: string) => {
    if (!user || !editForm) return;

    const updated = { ...editForm, avatar_url: publicUrl };

    setUser({ ...user, avatar_url: publicUrl });
    setEditForm(updated);

    const { data, error } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      toast("Error saving avatar_url: " + error.message);
    } else {
      const mappedUser: User = {
        id: data.id,
        firstname: data.firstname ?? "",
        lastname: data.lastname ?? "",
        displayname: data.displayname ?? "",
        avatar_url: data.avatar_url ?? "",
        emoji: data.emoji ?? "",
        is_admin: data.is_admin ?? false,
        role: data.role ?? "",
        created_at: data.created_at ?? "",
        updated_at: data.updated_at ?? "",
      };
      setUser(mappedUser);
      setEditForm(mappedUser);
      toast("Avatar updated successfully!");
    }
  };

  if (!user || !editForm) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="pt-20 px-4 pb-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-blue-100">Manage your account and view stats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={user.avatar_url || ""}
                      className="object-cover"
                      alt={`${user.firstname} ${user.lastname}`}
                    />
                    <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-2xl">
                      {user.firstname}
                      {user.lastname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-white">
                      {user.firstname} {user.lastname}
                    </h3>
                    <p className="text-blue-200">{user.displayname}</p>
                    <AvatarUpload onUpload={handleAvatarUpload} />
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="text-white">
                      First Name
                    </Label>
                    <Input
                      id="firstname"
                      value={isEditing ? editForm.firstname : user.firstname}
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstname: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="text-white">
                      Last Name
                    </Label>
                    <Input
                      id="lastname"
                      value={isEditing ? editForm.lastname : user.lastname}
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastname: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Section */}
            <ProfileStats
              totalPoints={100}
              rank={1}
              joinedDate={"2023-01-01T00:00:00Z"}
            />
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{100}</div>
                  <div className="text-white/60 text-sm">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">#{1}</div>
                  <div className="text-white/60 text-sm">Current Rank</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">
                    {new Date("2023-01-01T00:00:00Z").toLocaleDateString()}
                  </div>
                  <div className="text-white/60 text-sm">Member Since</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Competition Win</span>
                    <span className="text-green-400 font-semibold">
                      +50 pts
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Drink Challenge</span>
                    <span className="text-blue-400 font-semibold">+25 pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Bonus Points</span>
                    <span className="text-purple-400 font-semibold">
                      +10 pts
                    </span>
                  </div>
                </div>

                <div className="w-full bg-cyan-500 hover:bg-cyan-600 text-white">
                  <EnableNotifications />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
