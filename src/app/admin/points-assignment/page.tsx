"use client";
import React, { useState, useEffect } from "react";
import AdminPointsAssignment from "@/components/admin/points-assignment/AdminPointsAssignment";
import { User, JerseyCategory, Subcategory } from "@/types";
import { toast } from "sonner";
import { createClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

// Initialize Supabase client (adjust with your project credentials)
const supabase = createClient();

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("users").select("*");
        if (error) throw error;
        setUsers(data || []);
      } catch (error) {
        toast.error("Error fetching users: " + (error as Error).message);
      }
    };

    fetchUsers();
  }, []);

  // Handler for assigning points
  const handleAssignPoints = async (
    userId: string,
    category: JerseyCategory,  // Correctly typed as JerseyCategory
    subcategory: Subcategory,
    points: number,
    reason?: string
  ) => {
    try {
      const { error } = await supabase
        .from("points")
        .insert([{ user_id: userId, category, subcategory, value: points, note: reason }]);

      if (error) throw error;

      toast.success("Points successfully assigned!");
    } catch (error) {
      toast.error("Error assigning points: " + (error as Error).message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Admin Points Assignment</h1>

      <div className="mb-6 text-center">
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Assign Points
        </Button>
      </div>

      {/* Admin Points Assignment Modal */}
      {isModalOpen && (
        <AdminPointsAssignment
          users={users}
          currentUser={null} // Assuming the current user is not needed here, otherwise, pass the current user object
          onClose={() => setIsModalOpen(false)}
          onAssignPoints={handleAssignPoints}
        />
      )}
    </div>
  );
};

export default AdminPage;
