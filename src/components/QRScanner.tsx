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
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-white">Scan QR Code</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {error ? (
            <div className="text-white text-center space-y-4">
              <p className="text-red-400">{error}</p>

              {loadingUsers ? (
                <p className="text-white/50 text-sm">Loading users…</p>
              ) : (
                <>
                  <Label className="text-white/80">Select user instead:</Label>
                  <Select
                    onValueChange={(value) => {
                      onScan(value); // Simulate scanning this user ID
                    }}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Choose a user…" />
                    </SelectTrigger>
                    <SelectContent>
                      <ScrollArea className="h-60">
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.displayname}>
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
                />
              </div>

              <div className="text-center">
                <p className="text-white/80 text-sm mb-4">
                  Point your camera at a QR code
                </p>
                {loadingUsers ? (
                  <p className="text-white/50 text-sm">Loading users…</p>
                ) : (
                  <>
                    <Label className="text-white/80">
                      Select user instead:
                    </Label>
                    <Select
                      onValueChange={(value) => {
                        onScan(value); // Simulate scanning this user ID
                      }}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Choose a user…" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="h-60">
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.displayname}>
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
  );
}
