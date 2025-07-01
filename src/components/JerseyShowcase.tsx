"use client";
import React from "react";
import * as Icons from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JerseyCategoryConfig, jerseyConfigs, JerseyDisplay } from "@/types";

const JerseyShowcase = ({
  jerseyDisplay,
}: {
  jerseyDisplay?: JerseyDisplay[] | null;
}) => {
  if (!jerseyDisplay || jerseyDisplay.length === 0) {
    return (
      <section className="px-4 py-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            No Jerseys Available
          </h2>
          <p className="text-blue-100">Check back later for jersey updates!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Festival{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Jerseys
            </span>
          </h2>
          <p className="text-blue-100">Current jersey holders</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {jerseyDisplay.map((jersey, index) => {
            const config = jerseyConfigs[jersey.id];
            const IconComponent = Icons[
              config.icon as keyof typeof Icons
            ] as React.FC<React.SVGProps<SVGSVGElement>>;
            return (
              <Card
                key={jersey.id}
                className={`${config.bgColor} ${config.borderColor} border-2 backdrop-blur-md hover:scale-105 transform transition-all duration-300 hover:shadow-xl animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center shadow-lg`}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-sm font-bold mb-2 leading-tight">
                    {config.name}
                  </h3>

                  <div className="mb-2">
                    <Badge
                      className={`bg-gradient-to-r ${config.color} text-white border-0 px-2 py-1 text-xs`}
                    >
                      #{index + 1}
                    </Badge>
                  </div>

                  <div>
                    <p className="font-semibold text-sm mb-1">
                      {jersey.points > 0 ? jersey.holder : "No Holder"}
                    </p>
                    <p className="text-lg font-bold bg-clip-text bg-gradient-to-r from-white to-gray-300">
                      {jersey.points.toLocaleString()}
                    </p>
                    <p className="text-xs ">points</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default JerseyShowcase;
