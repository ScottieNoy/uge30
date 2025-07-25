"use client";

import React, { useEffect, useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { User } from "@/types";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { base64Sound } from "@/lib/dupsBase64";

interface QRScannerProps {
  onScan: (qrData: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("displayname", { ascending: true });

      if (!error && data) setUsers(data);
      setLoadingUsers(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Close Button in top-right corner */}
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="absolute -top-4 -right-4 text-white bg-black/60 border-white/30 hover:bg-white/20 rounded-full p-2 z-10"
        >
          <X className="h-5 w-5" />
        </Button>

        <Card className="w-full bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Scan QR-kode</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {error ? (
              <div className="text-white text-center space-y-4">
                <p className="text-red-400">{error}</p>

                {loadingUsers ? (
                  <p className="text-white/50 text-sm">Loading users…</p>
                ) : (
                  <>
                    <Label className="text-white/80">
                      Vælg en rytter i stedet:
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        onScan(value);
                      }}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Vælg en rytter…" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-60">
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.displayname ||
                                `${user.firstname} ${user.lastname}`}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
                  <Scanner
                    onScan={(codes) => {
                      if (codes[0]?.rawValue) onScan(codes[0].rawValue);
                    }}
                    onError={(e) => setError((e as Error).message)}
                    constraints={{ facingMode: "environment" }}
                    components={{ finder: true, torch: true, zoom: true }}
                    scanDelay={500}
                    sound={base64Sound}
                  />
                </div>

                <div className="text-center">
                  <p className="text-white/80 text-sm mb-4">
                    Peg dit kamera mod QR-koden
                  </p>
                  {loadingUsers ? (
                    <p className="text-white/50 text-sm">Loading users…</p>
                  ) : (
                    <>
                      <Label className="text-white/80">
                        Vælg en rytter i stedet:
                      </Label>
                      <Select
                        onValueChange={(value) => {
                          onScan(value); // Simulate scanning this user ID
                        }}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Vælg en rytter…" />
                        </SelectTrigger>
                        <SelectContent>
                          <ScrollArea className="h-60">
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.displayname ||
                                  `${user.firstname} ${user.lastname}`}
                              </SelectItem>
                            ))}
                          </ScrollArea>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
