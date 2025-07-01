'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import StageCard from '@/components/stages/StageCard'

export default function StageList() {
  const supabase = createClient()
  const [stages, setStages] = useState<any[]>([])

  useEffect(() => {
    const loadStages = async () => {
      const { data, error } = await supabase
        .from('stages')
        .select('*')
        .order('position', { ascending: true })

      if (data) setStages(data)
    }

    loadStages()
  }, [])

  if (!stages.length) return <p className="text-white">Ingen etaper oprettet endnu.</p>

  return (
    <div className="grid gap-6">
      {stages.map((stage) => (
        <StageCard key={stage.id} stage={stage} />
      ))}
    </div>
  )
}
