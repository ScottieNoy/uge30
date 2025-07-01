import React from 'react'
import Link from 'next/link'

export default function StageCard({ stage }: { stage: any }) {
  return (
    <Link href={`/stages/${stage.id}`}>
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 shadow-md hover:bg-white/10 transition cursor-pointer">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>{stage.emoji ?? '📍'}</span> {stage.title}
        </h2>
        {stage.description && (
          <p className="text-sm text-blue-100 mt-1">{stage.description}</p>
        )}
      </div>
    </Link>
  )
}
