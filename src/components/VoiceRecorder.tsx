"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, X, UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface VoiceRecorderProps {
  onAudioRecorded: (audio: Blob) => void;
}

const VoiceRecorder = ({ onAudioRecorded }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number | null>(null);

  const supportsMediaRecorder =
    typeof window !== "undefined" && "MediaRecorder" in window;

  // Get supported MIME type - iOS compatible formats first
  const getSupportedMimeType = (): string => {
    const types = [
      "audio/mp4",
      "audio/mpeg",
      "audio/wav",
      "audio/webm;codecs=opus",
      "audio/webm",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return "audio/webm"; // fallback
  };

  // Start recording timer
  const startTimer = () => {
    recordingStartTimeRef.current = Date.now();
    setRecordingDuration(0);
    timerRef.current = setInterval(() => {
      if (recordingStartTimeRef.current) {
        const elapsed = (Date.now() - recordingStartTimeRef.current) / 1000;
        setRecordingDuration(elapsed);
      }
    }, 100);
  };

  // Stop recording timer
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      // Check if we're on HTTPS or localhost
      if (location.protocol !== "https:" && location.hostname !== "localhost") {
        toast("Please use HTTPS or localhost to record audio.");
        return;
      }

      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast("Your browser does not support audio recording.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      audioChunksRef.current = [];

      // Request data every 100ms for better short recording support
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType,
        });

        // Calculate actual recording duration
        const actualDuration = recordingStartTimeRef.current
          ? (Date.now() - recordingStartTimeRef.current) / 1000
          : 0;

        console.log("Recording duration:", actualDuration, "seconds");

        // Check if recording is too short (using actual duration)
        if (actualDuration < 0.5) {
          toast("Recording too short. Please speak longer.");
          return;
        }

        // Check if audio blob has content
        if (audioBlob.size === 0) {
          toast("Recording is empty. Please try again.");
          return;
        }

        onAudioRecorded(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      // Start with timeslice for better short recording support
      mediaRecorder.start(100);
      setIsRecording(true);
      startTimer();

      toast("Recording started. Speak now...");
    } catch (err) {
      console.error("Microphone access denied:", err);
      toast("Microphone access denied. Please allow microphone permissions.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
    }
  };

  // Handle iOS native file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast("File too large. Maximum size is 10MB.");
        return;
      }

      onAudioRecorded(file);
      e.target.value = ""; // reset for future uploads

      toast("Audio file uploaded successfully.");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  return (
    <div className="flex items-center gap-2">
      {supportsMediaRecorder ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={isRecording ? stopRecording : startRecording}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0"
            title={isRecording ? "Stop Recording" : "Start Voice Recording"}
          >
            {isRecording ? (
              <X className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>
          {isRecording && (
            <span className="text-sm text-muted-foreground">
              {recordingDuration.toFixed(1)}s
            </span>
          )}
        </div>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            capture
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full"
            title="Upload Voice Message"
          >
            <UploadCloud className="w-4 h-4" />
          </Button>
        </>
      )}
    </div>
  );
};

export default VoiceRecorder;
