"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, X } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { AssignPoints, User, CategoryRow, Jersey, JerseyRow } from "@/types";
import * as LucideIcons from "lucide-react";
import { toast } from "sonner";

interface PointsAssignmentProps {
  targetUser: User;
  currentUser: User | null;
  onClose: () => void;
  onAssignPoints: (assignPoints: AssignPoints) => Promise<void>;
  allowedJerseys: Jersey[]; // only show categories for these jerseys
}

const PointsAssignment = ({
  targetUser,
  currentUser,
  onClose,
  onAssignPoints,
  allowedJerseys,
}: PointsAssignmentProps) => {
  const supabase = createClient();
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jerseys, setJerseys] = useState<JerseyRow[]>([]);

  function getLucideIcon(name: string): LucideIcon {
    const icon = LucideIcons[name as keyof typeof LucideIcons];
    if (icon) return icon as LucideIcon;

    console.warn(`⚠️ Icon "${name}" is not a valid Lucide React component.`);
    return LucideIcons.Star; // fallback
  }

  useEffect(() => {
    const loadCategoriesAndJerseys = async () => {
      const [
        { data: categoriesData, error: catError },
        { data: jerseysData, error: jerseyError },
      ] = await Promise.all([
        supabase
          .from("categories")
          .select("*")
          .in("jersey_id", allowedJerseys)
          .order("points", { ascending: false }),
        supabase
          .from("jerseys")
          .select(
            "id, name, color, created_at, description, icon, is_overall, bg_color, border_color"
          )
          .in("id", allowedJerseys),
      ]);

      if (catError || jerseyError) {
        toast.error("Could not load point categories or jerseys.");
        return;
      }

      setCategories(categoriesData || []);

      setJerseys(
        jerseysData?.map((jersey) => ({
          ...jersey,
          id: jersey.id as Jersey, // ensure type is Jersey
        })) || []
      );
    };

    loadCategoriesAndJerseys();
  }, []);

  const handleSubmit = async (
    jersey_id: Jersey,
    category: string,
    value: number,
    categoryName?: string
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
        jersey_id,
        category,
        value,
        note: `${category.toUpperCase()} blev tildelt af ${
          currentUser.displayname
        }`,
        categoryName,
      });

      onClose();
    } catch (error: any) {
      toast.error("Failed to assign points: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const categoriesByJersey = categories
    .filter((category) => category.jersey_id !== null)
    .reduce((acc, category) => {
      const jerseyId = category.jersey_id as Jersey;
      if (!acc[jerseyId]) {
        acc[jerseyId] = [];
      }
      acc[jerseyId].push(category);
      return acc;
    }, {} as Record<Jersey, CategoryRow[]>);

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

        <CardContent className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {targetUser.firstname?.[0]?.toUpperCase() ?? ""}
              </span>
            </div>
            <h3 className="text-white font-semibold text-lg">
              {targetUser.firstname} {targetUser.lastname}
            </h3>
            <p className="text-white/60 text-sm">
              Vælg en kategori og tildel point
            </p>
          </div>

          <div className="space-y-6">
            {Object.entries(categoriesByJersey).map(
              ([jerseyId, jerseyCategories]) => (
                <div key={jerseyId}>
                  <h4 className="text-white text-sm font-semibold mb-2 capitalize">
                    {
                      /* Display jersey name or ID */
                      jerseys.find((j) => j.id === jerseyId)?.name || jerseyId
                    }{" "}
                    {/* You can also use a mapping to get better labels */}
                    {/* Or use a mapping if you want better labels */}
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {jerseyCategories.map((cat) => {
                      const Icon = getLucideIcon(cat.icon ?? "Beer");
                      return (
                        <Button
                          key={cat.id}
                          onClick={() =>
                            handleSubmit(
                              cat.jersey_id as Jersey,
                              cat.slug,
                              cat.points,
                              cat.name
                            )
                          }
                          disabled={isSubmitting}
                          className="h-auto p-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white justify-between"
                          variant="ghost"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 rounded-full bg-gradient-to-r ${cat.color} flex items-center justify-center`}
                            >
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{cat.name}</div>
                              <div className="text-sm text-white/60">
                                Tryk for at tildele
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={`bg-gradient-to-r ${cat.color} text-white border-0`}
                          >
                            +{cat.points}
                          </Badge>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>

          <div className="text-center">
            <p className="text-white/40 text-xs">
              Point vil blive tildelt med det samme
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsAssignment;
