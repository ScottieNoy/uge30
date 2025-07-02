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
  const [step, setStep] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [displayname, setDisplayname] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [installPwaPrompt, setInstallPwaPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  // Validation for username
  const [isCheckingName, setIsCheckingName] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Check if the device is iOS
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("iphone") || userAgent.includes("ipad")) {
      setIsIos(true);
    }
  }, []);

  // Check if the app is in standalone mode (already installed as a PWA)
  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsAppInstalled(true);
      setStep(1);
    }
  }, []);

  // Check user metadata on load
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (user && !user.user_metadata?.profile_complete) {
        setOpen(true);
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

    setLoading(true);

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
      setOpen(false);
      setStep(1);
    }

    setLoading(false);
  };

  // Check for PWA installation support
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPwaPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const steps = [
    {
      title: isIos
        ? "Installér UGE30 på din homescreen 📱"
        : "Installér UGE30 på din homescreen (via Install Button) 📱",
      content: (
        <div className="text-center space-y-6">
          <p className="text-white/90 text-lg leading-relaxed">
            Nu kan du installere UGE30 på din homescreen for en bedre oplevelse!
          </p>
          {installPwaPrompt ? (
            <Button
              onClick={() => {
                installPwaPrompt.prompt();
                installPwaPrompt.userChoice.then((choiceResult: any) => {
                  if (choiceResult.outcome === "accepted") {
                    toast.success("UGE30 installeret på homescreen!");
                    setStep(1);
                  }
                });
              }}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Installer UGE30
            </Button>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <p className="text-white/80 text-sm leading-relaxed">
                På iOS: Åben Safari, tryk på delingsikonet og vælg 'Tilføj til
                hjemmeskærm'
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Velkommen til UGE30 🎉",
      content: (
        <div className="space-y-6">
          <p className="text-white/90 text-lg leading-relaxed">
            Du er nu en del af UGE30! Den bedste uge i året, hvor vi mødes i
            sommerhuset for at være sammen, drikke øl og have det sjovt.
          </p>
          <p className="text-white/80 text-base">
            Følg denne guide for at komme i gang med at bruge appen.
          </p>
        </div>
      ),
    },
    {
      title: "Upload dit avatar",
      content: (
        <div className="flex flex-col items-center space-y-6">
          {avatarUrl && (
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="h-28 w-28 rounded-full border-4 border-white/30 shadow-xl transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          )}
          <AvatarUpload onUpload={setAvatarUrl} />
        </div>
      ),
    },
    {
      title: "Vælg et kort, unikt navn",
      content: (
        <div className="space-y-4">
          <p className="text-white/80 text-sm">
            Dette navn vil blive vist i appen
          </p>
          <div className="space-y-3">
            <Label className="text-white/90 font-medium">Navn</Label>
            <Input
              value={displayname}
              onChange={(e) => setDisplayname(e.target.value)}
              placeholder="F.eks. Stiv-Martin"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-white/20 transition-all duration-200"
            />
            {isCheckingName && (
              <p className="text-xs text-blue-400 flex items-center gap-2">
                <span className="animate-spin">⏳</span> Tjekker navn...
              </p>
            )}
            {nameError && !isCheckingName && (
              <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                {nameError}
              </p>
            )}
            {isNameValid && !isCheckingName && (
              <p className="text-xs text-green-400 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20">
                ✔ Navnet er ledigt
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Hvordan bruger du appen?",
      content: (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <ul className="space-y-4 text-white/90 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 text-lg">•</span>
              <span className="leading-relaxed">
                Scan andres QR-koder for at tracke deres drikkevarer, ikke din
                egen.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 text-lg">•</span>
              <span className="leading-relaxed">
                Deltag i konkurrencer og optjen point for både Sprinter og
                Prikket Trøje.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 text-lg">•</span>
              <span className="leading-relaxed">
                På hovedsiden kan du se stillingen og kommende events.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 text-lg">•</span>
              <span className="leading-relaxed">
                Brug UGE30 Social til at chatte, dele information, kommentere og
                like andres indlæg.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 mt-1 text-lg">•</span>
              <span className="leading-relaxed">
                Se hele ugeoversigten med alle etaper og events under "Etaper".
              </span>
            </li>
          </ul>
        </div>
      ),
    },
  ];

  const isLastStep = step === steps.length - 1;
  const isNextDisabled =
    step === 3 && (!avatarUrl || isCheckingName || !isNameValid);

  const currentStep = steps[step] || {
    title: "Error",
    content: <div>Error loading step...</div>,
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md w-full my-2 p-8 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl">
        <DialogTitle className="text-xl font-bold text-white mb-6 text-center">
          {currentStep.title}
        </DialogTitle>

        <div className="min-h-[250px] flex flex-col justify-center">
          {currentStep.content}
        </div>

        <div className="flex justify-between gap-4 mt-8 pt-6 border-t border-white/10">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-200"
            >
              Tilbage
            </Button>
          )}
          {!isLastStep ? (
            <Button
              onClick={() => {
                if (step === 2 && avatarUrl) {
                  setStep(step + 1);
                } else if (step !== 2) {
                  setStep(step + 1);
                } else {
                  toast.error("Upload dit avatar for at fortsætte");
                }
              }}
              disabled={isNextDisabled}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200 ml-auto"
            >
              {loading ? "Laster..." : "Næste"}
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={loading}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 shadow-lg transform hover:scale-105 transition-all duration-200 ml-auto"
            >
              {loading ? "Kommer i gang..." : "Kom i gang 🚀"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
