// app/api/send-test-push/route.ts
import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:oscar@stromsborg.dk',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function GET() {
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const userId = session?.user?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch the user's push subscription
  const { data: subscription, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error || !subscription) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
  }

  try {
    // Ensure the subscription matches the PushSubscription type
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: (subscription.keys as any).p256dh,
    auth: (subscription.keys as any).auth,
      },
    }

    await webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: 'Testbesked 🔔',
        body: 'Dette er en test af dine notifikationer.',
        url: '/my'
      })
    )
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[Push Error]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
