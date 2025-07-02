import Social from "@/components/Social";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social",
  description: "Social page",
};

export default function Page() {
  return (
    <>
      <Social />
    </>
  );
}
