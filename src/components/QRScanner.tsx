"use client";
import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface QRScannerProps {
  onScan: (qrData: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [error, setError] = useState<string>("");

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
            <div className="text-center text-red-400">
              <p>{error}</p>
              <Button
                onClick={() => {
                  const code = prompt("Enter QR code manually:");
                  if (code) onScan(code);
                }}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                Enter Code Manually
              </Button>
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
                <Button
                  onClick={() => {
                    const code = prompt("Enter QR code manually:");
                    if (code) onScan(code);
                  }}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Enter Code Manually
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
