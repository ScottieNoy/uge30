"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Plus, Trash, Save, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminCategoryManager = () => {
  const supabase = createClient();
  const [jerseys, setJerseys] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedJerseyId, setSelectedJerseyId] = useState<string>("");

  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    points: 0,
    jersey_id: "",
    icon: "",
    color: "",
  });

  const fetchData = async () => {
    const { data: jerseysData } = await supabase
      .from("jerseys")
      .select("id, name");
    setJerseys(jerseysData || []);

    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*");
    setCategories(categoriesData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredCategories = categories.filter(
    (cat) => cat.jersey_id === selectedJerseyId
  );

  const handleAddCategory = async () => {
    const { name, slug, points, jersey_id, icon, color } = newCategory;
    if (!name || !slug || !jersey_id) {
      toast.error("Missing fields");
      return;
    }

    const { error } = await supabase
      .from("categories")
      .insert([{ name, slug, points, jersey_id, icon, color }]);
    if (error) {
      toast.error("Failed to add category");
    } else {
      toast.success("Category added");
      setNewCategory({
        name: "",
        slug: "",
        points: 0,
        jersey_id: selectedJerseyId,
        icon: "",
        color: "",
      });
      fetchData();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Deleted");
      fetchData();
    }
  };

  const handleUpdate = async (id: string, field: string, value: any) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    setCategories(updated);
  };

  const handleSave = async (category: any) => {
    const { error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", category.id);
    if (error) {
      toast.error("Update failed");
    } else {
      toast.success("Category updated");
      fetchData();
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4 pb-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Shield className="h-6 w-6 text-green-400" />
              <span>Admin Category Manager</span>
            </CardTitle>
            <p className="text-white/60">
              Select a jersey to view and manage its categories
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Jersey Filter */}
            <div className="space-y-2">
              <Label htmlFor="jersey-select" className="text-white">
                Select Jersey
              </Label>
              <Select
                value={selectedJerseyId}
                onValueChange={(val) => {
                  setSelectedJerseyId(val);
                  setNewCategory((prev) => ({ ...prev, jersey_id: val }));
                }}
              >
                <SelectTrigger className="bg-white/10 text-white border-white/20">
                  <SelectValue placeholder="Choose jersey..." />
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

            {/* Category List */}
            {selectedJerseyId && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2"
                  >
                    <Input
                      value={cat.name}
                      onChange={(e) =>
                        handleUpdate(cat.id, "name", e.target.value)
                      }
                      className="bg-white/10 text-white border-white/20"
                      placeholder="Name"
                    />
                    <Input
                      value={cat.slug}
                      onChange={(e) =>
                        handleUpdate(cat.id, "slug", e.target.value)
                      }
                      className="bg-white/10 text-white border-white/20"
                      placeholder="Slug"
                    />
                    <Input
                      type="number"
                      value={cat.points}
                      onChange={(e) =>
                        handleUpdate(cat.id, "points", parseInt(e.target.value))
                      }
                      className="bg-white/10 text-white border-white/20"
                      placeholder="Points"
                    />
                    <Input
                      value={cat.icon}
                      onChange={(e) =>
                        handleUpdate(cat.id, "icon", e.target.value)
                      }
                      className="bg-white/10 text-white border-white/20"
                      placeholder="Icon (e.g., Beer, Baby, Moon)"
                    />
                    <Select
                      value={cat.jersey_id}
                      onValueChange={(val) =>
                        handleUpdate(cat.id, "jersey_id", val)
                      }
                    >
                      <SelectTrigger className="bg-white/10 text-white border-white/20">
                        <SelectValue placeholder="Select Jersey" />
                      </SelectTrigger>
                      <SelectContent>
                        {jerseys.map((jersey) => (
                          <SelectItem key={jersey.id} value={jersey.id}>
                            {jersey.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-between mt-2">
                      <Button
                        onClick={() => handleSave(cat)}
                        variant="outline"
                        className="text-white border-white/30"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={() => handleDelete(cat.id)}
                        variant="destructive"
                      >
                        <Trash className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New category form */}
            {selectedJerseyId && (
              <div className="pt-10 border-t border-white/20 space-y-4">
                <h3 className="text-white text-lg font-semibold">
                  Add New Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Name"
                    className="bg-white/10 text-white border-white/20"
                  />
                  <Input
                    value={newCategory.slug}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    placeholder="Slug"
                    className="bg-white/10 text-white border-white/20"
                  />
                  <Input
                    type="number"
                    value={newCategory.points}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        points: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Points"
                    className="bg-white/10 text-white border-white/20"
                  />
                  <Input
                    value={newCategory.icon}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...prev,
                        icon: e.target.value,
                      }))
                    }
                    placeholder="Icon (e.g., Beer)"
                    className="bg-white/10 text-white border-white/20"
                  />
                </div>
                <Button
                  onClick={handleAddCategory}
                  className="bg-green-600 text-white w-full mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Category
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCategoryManager;
