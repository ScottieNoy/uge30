"use client";

import { useParticipants } from "@/hooks/useParticipants";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { UserIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import Link from "next/link";

export default function ParticipantsPage() {
  const { participants, loading } = useParticipants();
  const { user: currentUser } = useAuth();

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4 sm:mb-8 flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            UGE30{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Deltagere
            </span>
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">
            Her kan du se alle deltagere i UGE30.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {participants.map((user) => {
              const isCurrentUser = user.id === currentUser?.id;
              const link = isCurrentUser ? "/my" : `/participants/${user.id}`;

              return (
                <Link href={link} key={user.id}>
                  <Card
                    className={`border transition ${
                      isCurrentUser
                        ? "bg-blue-900/40 border-blue-400/60 ring-2 ring-blue-400"
                        : "bg-white/10 border-white/10 hover:bg-white/20"
                    }`}
                  >
                    <CardContent className="flex items-center space-x-4 py-4 px-6">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.displayname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col leading-tight">
                        <p
                          className={`text-sm font-semibold ${
                            isCurrentUser ? "text-blue-100" : "text-white"
                          }`}
                        >
                          {user.firstname} {user.lastname} {isCurrentUser && "(dig)"}
                        </p>
                        <p
                          className={`text-xs ${
                            isCurrentUser ? "text-blue-300" : "text-gray-300"
                          }`}
                        >
                          {user.displayname} 
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
