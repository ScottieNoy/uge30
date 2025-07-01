'use client'

import React from 'react'
import AdminStageList from '@/components/admin/stages/AdminStageList'

export default function AdminStagesPage() {
  return (
    <div className="pt-20 px-4 pb-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-6">Administrer Etaper</h1>
      <AdminStageList />
    </div>
  )
}
