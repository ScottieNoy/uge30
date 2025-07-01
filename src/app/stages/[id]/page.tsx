'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function StageDetailPage() {
  const supabase = createClient()
  const params = useParams()
  const id = params?.id as string | undefined
  const [stage, setStage] = useState<any | null>(null)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (!id) return

    const load = async () => {
      const { data: stageData } = await supabase.from('stages').select('*').eq('id', id).single()
      const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('stage_id', id)
        .order('time')

      setStage(stageData)
      setEvents(eventData || [])
    }

    load()
  }, [id])

  if (!id) return <p className="text-white">ID mangler.</p>
  if (!stage) return <p className="text-white">Indlæser etape...</p>

  return (
    <div className="pt-20 px-4 pb-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-white flex items-center gap-2 mb-4">
        <span>{stage.emoji ?? '📍'}</span> {stage.title}
      </h1>
      {stage.description && (
        <p className="text-white text-sm mb-6">{stage.description}</p>
      )}

      {events.length ? (
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-4 bg-white/5 border border-white/10 rounded text-white"
            >
              <div className="text-lg font-semibold flex items-center gap-2">
                {event.emoji ?? '🕓'} {event.title}
              </div>
              <div className="text-sm text-blue-100">
                {new Date(event.time).toLocaleString('da-DK')}
                {event.location && ` • ${event.location}`}
              </div>
              {event.description && (
                <p className="text-sm mt-1">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">Ingen aktiviteter planlagt for denne etape.</p>
      )}
    </div>
  )
}
