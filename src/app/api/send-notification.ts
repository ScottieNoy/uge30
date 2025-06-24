import type { NextApiRequest, NextApiResponse } from "next"
import webpush from "web-push"
import { createClient } from "@supabase/supabase-js"

webpush.setVapidDetails(
  "mailto:dups@uge30.dk",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { title, body } = req.body

  const { data: subs } = await supabase.from("push_subscriptions").select("*")
  if (!subs) return res.status(500).json({ error: "No subscriptions found" })

  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        sub.subscription,
        JSON.stringify({ title, body })
      )
    } catch (err) {
      console.error("Push failed:", err)
    }
  }

  res.status(200).json({ success: true })
}
