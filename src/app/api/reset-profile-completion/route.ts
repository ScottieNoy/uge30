// app/api/reset-profile-completion/route.ts

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseAdmin";

export async function POST() {
  const supabase = createAdminClient();

  const { data: users, error: listError } = await supabase.auth.admin.listUsers({
    perPage: 1000,
  });

  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const failures: string[] = [];

  for (const user of users?.users || []) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        profile_complete: false,
      },
    });

    if (updateError) {
      failures.push(`${user.email}: ${updateError.message}`);
    }
  }

  return NextResponse.json({
    message: "Reset complete",
    total: users?.length,
    failed: failures.length,
    failures,
  });
}
