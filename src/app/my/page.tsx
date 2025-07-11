"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { QRCodeCanvas } from "qrcode.react";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Save, User as UserIcon, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AvatarUpload from "@/components/AvatarUpload";
import ProfileStats from "@/components/ProfileStats";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useJerseyHolders } from "@/hooks/useJerseyHolders";

import { toast } from "sonner";

export default function MyPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [editForm, setEditForm] = useState(user);
  const supabase = createClient();
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameValid, setIsNameValid] = useState(true);
  const [nameError, setNameError] = useState<string | null>(null);

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
        setUser(userData);
        setEditForm(userData);
      }
      setIsEditing(false);
    };

    fetchUser();
    return () => {
      setUser(null);
      setEditForm(null);
    };
  }, [supabase, toast]);

  useEffect(() => {
    if (!editForm?.displayname || editForm.displayname.trim().length < 2) {
      setIsNameValid(false);
      setNameError("Navnet skal være mindst 2 tegn");
      return;
    }

    const timeout = setTimeout(async () => {
      setIsCheckingName(true);
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("displayname", editForm.displayname.trim())
        .neq("id", user?.id ?? "") // exclude current user
        .maybeSingle();

      if (error) {
        setNameError("Fejl ved tjek af navn");
        setIsNameValid(false);
      } else if (data) {
        setNameError("Dette navn er allerede taget");
        setIsNameValid(false);
      } else {
        setNameError(null);
        setIsNameValid(true);
      }

      setIsCheckingName(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [editForm?.displayname]);

  const { jerseyBoards, jerseyData, activityFeed } = useLeaderboard();
  const { data: jerseyHolders } = useJerseyHolders();

  const maillotJaune = jerseyData.find((j) => j.name === "Maillot Jaune");

  const userStats = maillotJaune?.participants.find(
    (p) => p.user.id === user?.id
  );

  const totalPoints = userStats?.total ?? 0;
  const rank = userStats?.rank ?? "N/A";

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
      setUser(data);
      setIsEditing(false);
      toast("Profile updated successfully!");
    }
  };

  const myJerseys = jerseyHolders.filter((j) => j.user_id === user?.id);

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

    const updated = { ...editForm, avatar: publicUrl };

    setUser({ ...user, avatar_url: publicUrl });
    setEditForm(updated);

    const { data, error } = await supabase
      .from("users")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      toast("Error saving avatar: " + error.message);
    } else {
      setUser(data);
      setEditForm(data);
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
            Tilbage
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Min profile</h1>
            <p className="text-blue-100">
              Administrer din profil og se dine point
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center space-x-2">
                  <UserIcon className="h-5 w-5" />
                  <span>Profil Info</span>
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Rediger
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                      disabled={!isNameValid || isCheckingName}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Gem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Annuller
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
                      {user.lastname ? user.lastname[0] : ""}
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
                      Fornavn
                    </Label>
                    <Input
                      id="firstname"
                      value={
                        isEditing
                          ? editForm.firstname ?? ""
                          : user.firstname ?? ""
                      }
                      onChange={(e) =>
                        setEditForm({ ...editForm, firstname: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="text-white">
                      Efternavn
                    </Label>
                    <Input
                      id="lastname"
                      value={
                        isEditing
                          ? editForm.lastname ?? ""
                          : user.lastname ?? ""
                      }
                      onChange={(e) =>
                        setEditForm({ ...editForm, lastname: e.target.value })
                      }
                      disabled={!isEditing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="displayname" className="text-white">
                      Brugernavn
                    </Label>
                    <Input
                      id="displayname"
                      value={editForm.displayname ?? ""}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          displayname: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="bg-white/10 border-white/20 text-white disabled:opacity-50"
                    />
                    {isEditing && isCheckingName && (
                      <p className="text-xs text-blue-300">Tjekker navn...</p>
                    )}
                    {isEditing && nameError && !isCheckingName && (
                      <p className="text-xs text-red-400">{nameError}</p>
                    )}
                    {isEditing && isNameValid && !isCheckingName && (
                      <p className="text-xs text-green-400">
                        ✔ Navnet er ledigt
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Section */}
            <ProfileStats
              totalPoints={totalPoints}
              rank={rank}
              joinedDate={user.created_at || ""}
              jerseyData={jerseyData}
              userId={user.id}
              activityFeed={activityFeed}
            />
          </div>

          {/* Quick Stats Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Den gule trøje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">
                    {totalPoints}
                  </div>
                  <div className="text-white/60 text-sm">Samlet Point</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-400">
                    #{rank}
                  </div>
                  <div className="text-white/60 text-sm">Placering</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-400">
                    {new Date(user.created_at || "").toLocaleDateString(
                      "da-DK",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </div>
                  <div className="text-white/60 text-sm">Tilmeldt siden</div>
                </div>
              </CardContent>
            </Card>
            {myJerseys.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Dine trøjer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {myJerseys.map((j) => (
                    <div
                      key={j.jersey_id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-white/80">{j.jersey_name}</span>
                      <span
                        className="font-semibold text-white"
                        style={{ color: j.color }}
                      >
                        {j.total_points} pts
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
