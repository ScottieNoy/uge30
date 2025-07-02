"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import AvatarUpload from "@/components/AvatarUpload";
import { createClient } from "@/lib/supabaseClient";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function WelcomeModal() {
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // Default to 0 for the first step
  const [avatarUrl, setAvatarUrl] = useState(""); // Avatar URL to track if uploaded
  const [displayname, setDisplayname] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [installPwaPrompt, setInstallPwaPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false); // Track iOS device
  const [isAppInstalled, setIsAppInstalled] = useState(false); // Track if the app is installed

  // Validation for username
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Check if the device is iOS
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      setIsIos(true); // Set iOS flag
    }
  }, []);

  // Check if the app is in standalone mode (already installed as a PWA)
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsAppInstalled(true); // Mark the app as installed if it's running in standalone mode
      setStep(1); // Skip the PWA install step and go straight to the profile setup
    }
  }, []);

  // Check user metadata on load
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (user && !user.user_metadata?.profile_complete) {
        setOpen(true); // Show modal if profile is incomplete
        setUserId(user.id);
      }
    };
    check();
  }, []);

  // Debounced display name check
  useEffect(() => {
    if (displayname.trim().length < 2) {
      setIsNameValid(false);
      setNameError("Navnet skal være mindst 2 tegn");
      return;
    }

    setIsCheckingName(true);
    const timeout = setTimeout(async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id")
        .eq("displayname", displayname.trim())
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
    }, 600);

    return () => clearTimeout(timeout);
  }, [displayname, supabase]);

  // Handle form completion
  const handleComplete = async () => {
    if (!userId) return;

    setLoading(true); // Start loading state

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        avatar: avatarUrl || null,
        displayname,
        profile_complete: true,
      },
    });

    const { error: dbError } = await supabase
      .from("users")
      .update({
        avatar: avatarUrl || null,
        displayname,
      })
      .eq("id", userId);

    if (authError || dbError) {
      toast.error("Fejl ved opdatering af profil");
    } else {
      toast.success("Velkommen til UGE30 🎉");
      setOpen(false); // Close modal after completion
      setStep(1); // Move to the next step (Profile Setup)
    }

    setLoading(false); // End loading state
  };

  // Check for PWA installation support
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Prevent the browser's default install prompt
      console.log("PWA install prompt captured"); // Log to confirm the event is fired
      setInstallPwaPrompt(e); // Store the event for later use
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  // Modal steps
  const steps = [
    {
      title: isIos ? "Installér UGE30 på din homescreen 📱" : "Installér UGE30 på din homescreen (via Install Button) 📱",
      content: (
        <div className="text-center space-y-4">
          <p className="text-white text-lg">
            Nu kan du installere UGE30 på din homescreen for en bedre oplevelse!
          </p>
          {installPwaPrompt ? (
            <Button
              onClick={() => {
                installPwaPrompt.prompt(); // Show the install prompt
                installPwaPrompt.userChoice.then((choiceResult: any) => {
                  if (choiceResult.outcome === "accepted") {
                    toast.success("UGE30 installeret på homescreen!");
                    setStep(1); // Proceed to the next step after installation
                  }
                });
              }}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Installer UGE30
            </Button>
          ) : (
            <p className="text-white">
              På iOS: Åben Safari, tryk på delingsikonet og vælg 'Tilføj til hjemmeskærm'
            </p>
          )}
        </div>
      ),
    },
    {
      title: "Velkommen til UGE30 🎉",
      content: (
        <p className="text-white text-lg">
          Du er nu en del af det største drukbattle i Danmark. Klar på at vinde
          trøjen?
        </p>
      ),
    },
    {
      title: "Upload dit avatar",
      content: (
        <div className="flex flex-col items-center space-y-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="h-24 w-24 rounded-full border-4 border-white mb-6"
            />
          )}
          <AvatarUpload onUpload={setAvatarUrl} key={userId!} />
        </div>
      ),
    },
    {
      title: "Vælg et navn som vi kan kende dig ved",
      content: (
        <div className="space-y-2">
          <Label className="text-white">Navn</Label>
          <Input
            value={displayname}
            onChange={(e) => setDisplayname(e.target.value)}
            placeholder="F.eks. Stiv-Martin"
            textColor="white"
            className="input-lg"
          />
          {isCheckingName && (
            <p className="text-xs text-blue-400">Tjekker navn...</p>
          )}
          {nameError && !isCheckingName && (
            <p className="text-xs text-red-500">{nameError}</p>
          )}
          {isNameValid && !isCheckingName && (
            <p className="text-xs text-green-500">Navnet er ledigt ✔</p>
          )}
        </div>
      ),
    },
    {
      title: "Regler og tips 🧠",
      content: (
        <ul className="list-disc list-inside text-white space-y-2">
          <li>Log dine øl og points i appen</li>
          <li>Følg med i ranglisten</li>
          <li>Respektér crewet og dine medspillere 🍻</li>
        </ul>
      ),
    },
  ];

  const isLastStep = step === steps.length - 1;
  const isNextDisabled =
    (step === 3 && (!avatarUrl || isCheckingName || !isNameValid)); 

  // Make sure step is within bounds
  const currentStep = steps[step] || {
    title: "Error",
    content: <div>Error loading step...</div>,
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md w-full my-2 p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
        <DialogTitle className="text-lg text-white flex items-center gap-2">
          {currentStep.title}
        </DialogTitle>

        <div>{currentStep.content}</div>

        <div className="flex justify-between gap-4 mt-6">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="text-white hover:bg-white/10"
            >
              Tilbage
            </Button>
          )}
          {!isLastStep ? (
            <Button
              onClick={() => {
                // Ensure that the avatar is uploaded before moving to the next step
                if (step === 2 && avatarUrl) {
                  setStep(step + 1); // Only move to the next step if the avatar is uploaded
                } else if (step !== 2) {
                  setStep(step + 1); // Move to the next step if it's not the avatar step
                } else {
                  toast.error("Upload dit avatar for at fortsætte");
                }
              }}
              disabled={isNextDisabled}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              {loading ? "Laster..." : "Næste"}
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {loading ? "Kommer i gang..." : "Kom i gang 🚀"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
