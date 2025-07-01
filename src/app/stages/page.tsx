'use client'

import React from 'react'
import StageList from '@/components/stages/StageList'

export default function StagesPage() {
  return (
    <div className="pt-20 px-4 pb-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Etaper</h1>
      <StageList />
    </div>
  )
}
