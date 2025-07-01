// app/api/save-subscription/route.ts
import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const subscription = await req.json()

  // Basic validation
  if (!subscription || !subscription.endpoint || !subscription.keys) {
    return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 })
  }

  const supabase = await createClient()

  // Get user from session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user already has a subscription saved
  const { error: upsertError } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      created_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

  if (upsertError) {
    console.error('[Push Subscription] Error saving:', upsertError)
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
