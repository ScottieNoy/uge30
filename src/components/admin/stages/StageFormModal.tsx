'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabaseClient'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function StageFormModal({ existingStage, onClose, onSaved }: any) {
  const supabase = createClient()
  const [title, setTitle] = useState(existingStage?.title ?? '')
  const [description, setDescription] = useState(existingStage?.description ?? '')
  const [emoji, setEmoji] = useState(existingStage?.emoji ?? '')
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    emoji: '',
    location: '',
    description: '',
  })

  // Load existing events if editing
  useEffect(() => {
    if (!existingStage) return
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('stage_id', existingStage.id)
        .order('time')
      if (data) setEvents(data)
    }
    fetchEvents()
  }, [existingStage])

  const handleSubmit = async () => {
    setLoading(true)
    const payload = { title, description, emoji }

    if (existingStage) {
      await supabase.from('stages').update(payload).eq('id', existingStage.id)
    } else {
      await supabase.from('stages').insert(payload)
    }

    setLoading(false)
    onSaved()
    onClose()
  }

  const handleCreateEvent = async () => {
    if (!existingStage) return

    const { error } = await supabase.from('events').insert({
      ...newEvent,
      stage_id: existingStage.id,
    })

    if (!error) {
      setNewEvent({ title: '', time: '', emoji: '', location: '', description: '' })
      toast.success('Event oprettet')
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('stage_id', existingStage.id)
        .order('time')
      if (data) setEvents(data)
    } else {
      toast.error('Kunne ikke oprette event')
    }
  }

  const handleDeleteEvent = async (id: string) => {
    await supabase.from('events').delete().eq('id', id)
    setEvents(events.filter((e) => e.id !== id))
  }

  const handleUpdateEvent = async (event: any) => {
    await supabase.from('events').update(event).eq('id', event.id)
    toast.success('Event opdateret')
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 max-h-[90vh] overflow-y-auto rounded-lg p-6 space-y-6">
  <DialogTitle className="text-white text-xl font-semibold">
    {existingStage ? 'Rediger Etape' : 'Ny Etape'}
  </DialogTitle>

  {/* Stage Details */}
  <div className="space-y-4">
    <div>
      <label className="block text-sm text-white mb-1">Titel</label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="F.eks. Øldag" />
    </div>

    <div>
      <label className="block text-sm text-white mb-1">Beskrivelse</label>
      <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Kort beskrivelse" />
    </div>

    <div>
      <label className="block text-sm text-white mb-1">Emoji</label>
      <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🍺" />
    </div>

    <Button onClick={handleSubmit} disabled={loading} className="w-full bg-cyan-600">
      {loading ? 'Gemmer...' : 'Gem Etape'}
    </Button>
  </div>

  {/* Events Section */}
  {existingStage && (
    <>
      <hr className="border-white/20" />
      <h3 className="text-white font-semibold text-lg">Planlagte Aktiviteter</h3>

      {/* Existing Events */}
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-md border border-white/20 bg-white/5 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Titel"
                value={event.title}
                onChange={(e) =>
                  setEvents((prev) =>
                    prev.map((ev) => ev.id === event.id ? { ...ev, title: e.target.value } : ev)
                  )
                }
              />
              <Input
                type="datetime-local"
                value={event.time}
                onChange={(e) =>
                  setEvents((prev) =>
                    prev.map((ev) => ev.id === event.id ? { ...ev, time: e.target.value } : ev)
                  )
                }
              />
              <Input
                placeholder="Lokation"
                value={event.location ?? ''}
                onChange={(e) =>
                  setEvents((prev) =>
                    prev.map((ev) => ev.id === event.id ? { ...ev, location: e.target.value } : ev)
                  )
                }
              />
              <Input
                placeholder="Emoji"
                value={event.emoji ?? ''}
                onChange={(e) =>
                  setEvents((prev) =>
                    prev.map((ev) => ev.id === event.id ? { ...ev, emoji: e.target.value } : ev)
                  )
                }
              />
            </div>

            <Textarea
              placeholder="Beskrivelse"
              value={event.description ?? ''}
              onChange={(e) =>
                setEvents((prev) =>
                  prev.map((ev) => ev.id === event.id ? { ...ev, description: e.target.value } : ev)
                )
              }
            />

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={() => handleUpdateEvent(event)} className="flex-1">
                Gem ændringer
              </Button>
              <Button variant="destructive" onClick={() => handleDeleteEvent(event.id)} className="flex-1">
                Slet
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Event */}
      <div className="mt-8 p-4 rounded-md border border-white/20 bg-white/10 space-y-3">
        <h4 className="text-white font-medium text-md">➕ Tilføj ny aktivitet</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            placeholder="Titel"
            value={newEvent.title}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, title: e.target.value }))}
          />
          <Input
            type="datetime-local"
            value={newEvent.time}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, time: e.target.value }))}
          />
          <Input
            placeholder="Lokation"
            value={newEvent.location}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, location: e.target.value }))}
          />
          <Input
            placeholder="Emoji"
            value={newEvent.emoji}
            onChange={(e) => setNewEvent((prev) => ({ ...prev, emoji: e.target.value }))}
          />
        </div>

        <Textarea
          placeholder="Beskrivelse"
          value={newEvent.description}
          onChange={(e) => setNewEvent((prev) => ({ ...prev, description: e.target.value }))}
        />

        <Button onClick={handleCreateEvent} className="w-full bg-green-600">
          ➕ Opret Event
        </Button>
      </div>
    </>
  )}
</DialogContent>

    </Dialog>
  )
}
