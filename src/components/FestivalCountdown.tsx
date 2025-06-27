import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const FestivalCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Festival end date - adjust this to your actual festival end date
    const festivalEndDate = new Date("2024-08-04T23:59:59"); // Example: August 4th, 2024

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = festivalEndDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20">
      <CardContent className="p-3">
        <div className="flex items-center justify-center space-x-2 text-white">
          <Clock className="h-4 w-4 text-cyan-300" />
          <div className="flex items-center space-x-1 text-sm font-mono">
            <div className="text-center">
              <div className="font-bold">
                {timeLeft.days.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-cyan-200">days</div>
            </div>
            <span className="text-cyan-300">:</span>
            <div className="text-center">
              <div className="font-bold">
                {timeLeft.hours.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-cyan-200">hrs</div>
            </div>
            <span className="text-cyan-300">:</span>
            <div className="text-center">
              <div className="font-bold">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-cyan-200">min</div>
            </div>
            <span className="text-cyan-300">:</span>
            <div className="text-center">
              <div className="font-bold">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </div>
              <div className="text-xs text-cyan-200">sec</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FestivalCountdown;
