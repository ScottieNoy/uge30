"use client";
import AdminPointsAssignment from "@/components/AdminPointsAssignment";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  created_at: string | null;
  emoji: string | null;
  firstname: string;
  id: string;
  is_admin: boolean | null;
  lastname: string;
  updated_at: string | null;
};

export default function AddPointsPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [onAssignPoints, setOnAssignPoints] = useState<null>(null);
  const [onClose, setOnClose] = useState(() => () => router.push("/"));

  // Fetch users and check admin status
  // This effect runs once when the component mounts
  // It checks if the user is an admin and fetches the list of users
  // If the user is not an admin, it redirects to the home page
  // If the user is an admin, it fetches the users from the database and sets the state
  // Finally, it sets the loading state to false

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData.session?.user;
      if (!sessionUser) return router.push("/");

      const { data: userData, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", sessionUser.id)
        .single();

      if (error || !userData?.is_admin) return router.push("/");
      const { data: usersData } = await supabase.from("users").select("*");
      if (usersData) setUsers(usersData);

      setCurrentUser(sessionUser as unknown as User);
      setAuthorized(true);
      setLoading(false);
    };

    checkAdminAndFetch();
  }, [router]);

  // Function to assign points to a user
  const handleAssignPoints = async (
    userId: string,
    category: string,
    points: number,
    reason?: string
  ) => {
    if (!currentUser) return;

    console.log("Assigning points:", { userId, category, points, reason });

    // Simulate API call to assign points
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    alert(
      `Assigned ${points} points to user ${userId} in category ${category}`
    );
  };

  // If loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authorized, show an error message
  if (!authorized) {
    return <div>You are not authorized to view this page.</div>;
  }

  // Render the AdminPointsAssignment component with the necessary props
  // Pass the current user, onAssignPoints function, onClose function, and users list
  // The AdminPointsAssignment component will handle the UI for assigning points to users
  // It will allow the admin to select a user, category, and points amount, and
  // submit the assignment, which will call the onAssignPoints function
  // The onClose function will redirect back to the home page when the assignment is closed

  return (
    <>
      <AdminPointsAssignment
        users={users}
        currentUser={currentUser}
        onClose={onClose}
        onAssignPoints={handleAssignPoints}
      />
    </>
  );
}
