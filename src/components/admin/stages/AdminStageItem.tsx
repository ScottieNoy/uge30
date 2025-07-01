'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import StageFormModal from '@/components/admin/stages/StageFormModal'

export default function AdminStageItem({ stage, index, onUpdated }: any) {
  const supabase = createClient()
  const [editing, setEditing] = useState(false)

  const handleDelete = async () => {
    await supabase.from('stages').delete().eq('id', stage.id)
    onUpdated()
  }

  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-md text-white flex justify-between items-start">
      <div>
        <div className="text-lg font-semibold flex gap-2 items-center">
          <span>{stage.emoji ?? '📍'}</span> {stage.title}
        </div>
        {stage.description && (
          <div className="text-sm text-blue-100">{stage.description}</div>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setEditing(true)}>Rediger</Button>
        <Button variant="destructive" onClick={handleDelete}>Slet</Button>
      </div>

      {editing && (
        <StageFormModal
          existingStage={stage}
          onClose={() => setEditing(false)}
          onSaved={onUpdated}
        />
      )}
    </div>
  )
}
