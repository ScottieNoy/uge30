import { createClient } from '@/lib/supabaseServer'
import { NextResponse } from 'next/server'
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:dups@uge30.dk',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(req: Request) {
  const supabase = await createClient()
  const { user_id, sender_id, broadcast, title, body, url } = await req.json()

  if (!title || !body) {
    return NextResponse.json({ error: 'Missing title or body' }, { status: 400 })
  }

  let subscriptions = []

  if (broadcast) {
    const { data, error } = await supabase.from('push_subscriptions').select('*')
    if (error || !data?.length) {
      return NextResponse.json({ error: 'No subscriptions found' }, { status: 404 })
    }

    subscriptions = data.filter(sub => sub.user_id !== sender_id) // ⛔️ exclude sender
  } else if (user_id) {
    const { data, error } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
    }

    subscriptions = [data]
  } else {
    return NextResponse.json({ error: 'Must provide either user_id or broadcast' }, { status: 400 })
  }

  const payload = JSON.stringify({ title, body, url })

  const results = await Promise.allSettled(
    subscriptions
      .filter((sub) => typeof sub.endpoint === 'string' && sub.endpoint)
      .map((sub) => {
        const pushSub = {
          endpoint: sub.endpoint as string,
          keys: {
            p256dh: (sub.keys as any).p256dh,
            auth: (sub.keys as any).auth,
          }
        }
        return webpush.sendNotification(pushSub, payload)
      })
  )

  const successCount = results.filter(r => r.status === 'fulfilled').length
  const failureCount = results.length - successCount

  return NextResponse.json({
    success: true,
    sent: successCount,
    failed: failureCount,
  })
}
