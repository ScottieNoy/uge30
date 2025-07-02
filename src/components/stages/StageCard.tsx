"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StageCardProps {
  stage: {
    id: string;
    title: string;
    description: string | null;
    emoji: string | null;
    position: number; // used for sorting, not rendered
    created_at: string | null;
  };
}

const StageCard: React.FC<StageCardProps> = ({ stage }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("da-DK", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link href={`/stages/${stage.id}`} className="block group">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative"
      >
        <Card className="relative bg-white/80 backdrop-blur-md border border-gray-100 shadow-md rounded-2xl overflow-hidden">
          {/* Hover gradient overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-50/60 to-indigo-100/60 pointer-events-none z-0"
          />

          <CardHeader className="relative z-10 px-4 pt-5 pb-2 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">
              <div className="flex items-start gap-2">
                {/* Emoji */}
                {stage.emoji && (
                  <motion.span
                    className="text-3xl shrink-0"
                    initial={{ y: -4 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 120 }}
                  >
                    {stage.emoji}
                  </motion.span>
                )}

                {/* Title */}
                <h3 className="self-center text-gray-900 font-semibold group-hover:text-blue-700 transition-colors duration-300 leading-tight break-words">
                  {stage.title}
                </h3>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="relative z-10 px-4 pt-2 pb-5 sm:px-6">
            {/* Description */}
            {stage.description && (
              <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                {stage.description}
              </p>
            )}

            {/* Date */}
            {stage.created_at && (
              <div className="items-center gap-2 text-xs text-gray-500 bg-gray-100/80 rounded-md px-3 py-2 inline-flex backdrop-blur-sm border border-gray-200">
                <span className="text-blue-500">📅</span>
                <span className="font-medium">
                  {formatDate(stage.created_at)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

export default StageCard;
