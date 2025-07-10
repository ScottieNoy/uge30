"use client";

import { useState, ComponentType, FC, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User as UserIcon } from "lucide-react";
import { JerseyHolder } from "@/hooks/useJerseyHolders";

interface FlipCardProps {
  jersey: JerseyHolder;
  jersey_id: string;
  index: number;
  bg_color: string;
  border_color: string;
  color: string;
  IconComponent?: ComponentType<{ className?: string }>;
  displayname: string;
  total_points: number;
}

const FlipCard: FC<FlipCardProps> = ({
  jersey,
  jersey_id,
  index,
  bg_color,
  border_color,
  color,
  IconComponent,
  displayname,
  total_points,
}) => {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (flipped) {
      timeout = setTimeout(() => {
        setFlipped(false);
      }, 30000); // 30 seconds
    }

    return () => clearTimeout(timeout);
  }, [flipped]);

  return (
    <div
      className="relative w-full h-[230px] perspective cursor-pointer"
      onClick={() => setFlipped((prev) => !prev)}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-500"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden">
          <Card
            className={`${bg_color} ${border_color} border-2 backdrop-blur-md hover:scale-105 transition-all duration-300 hover:shadow-xl animate-fade-in w-full h-full`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-4 text-center h-full">
              <div
                className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}
              >
                {IconComponent ? (
                  <IconComponent className="h-6 w-6" />
                ) : (
                  <UserIcon className="h-6 w-6" />
                )}
              </div>

              <h3 className="text-sm font-bold mb-2 leading-tight">
                {jersey.jersey_name}
              </h3>

              <div className="mb-2">
                <Badge
                  className={`bg-gradient-to-r ${color} border-0 px-2 py-1 text-xs`}
                >
                  #{index + 1}
                </Badge>
              </div>

              <div className="mb-1">
                {displayname ? (
                  <div className="flex items-center justify-center space-x-2">
                    {jersey.avatar_url ? (
                      <img
                        src={jersey.avatar_url}
                        alt="User Avatar"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className="text-sm font-semibold truncate">
                      {displayname}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-black">
                    ingen har claimet trøjen endnu
                  </p>
                )}
              </div>

              {displayname && (
                <>
                  <p className="text-lg font-bold bg-clip-text bg-gradient-to-r from-white to-gray-300">
                    {total_points}
                  </p>
                  <p className="text-xs">points</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 rotate-y-180 backface-hidden">
          <Card
            className={`${bg_color} ${border_color} border-2 backdrop-blur-md w-full h-full`}
          >
            <CardContent className="p-4 text-center h-full flex flex-col justify-center">
              <h3 className="text-lg font-bold mb-2">Trøje Info</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Mere omkring {jersey.jersey_name}
              </p>
              <p className="text-xs text-muted-foreground">Ding Dang</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default FlipCard;
