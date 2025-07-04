import { Suspense } from "react";
import Social from "@/components/Social";

export default function SocialPage() {
  return (
    <Suspense
      fallback={<div className="text-white p-8">Loading social hub...</div>}
    >
      <Social />
    </Suspense>
  );
}
