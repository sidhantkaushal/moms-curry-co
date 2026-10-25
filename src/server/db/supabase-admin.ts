import { createClient } from "@supabase/supabase-js";
import { getPublicEnv, getServerSecrets, isServerOrderPipelineConfigured } from "@/lib/env";

export function createSupabaseAdminClient() {
  if (!isServerOrderPipelineConfigured()) {
    throw new Error(
      "Supabase service role and ORDER_TOKEN_PEPPER must be configured for server operations.",
    );
  }
  const { NEXT_PUBLIC_SUPABASE_URL } = getPublicEnv();
  const { SUPABASE_SERVICE_ROLE_KEY } = getServerSecrets();
  if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase configuration.");
  }
  return createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
