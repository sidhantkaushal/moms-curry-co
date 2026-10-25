#!/usr/bin/env node
import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal } from "./load-env.mjs";

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const clientKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !clientKey) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or ANON_KEY) in .env.local",
  );
  process.exit(1);
}

const pub = createClient(url, clientKey);
const { data, error } = await pub.from("business_settings").select("brand_name").eq("id", 1).maybeSingle();
if (error) {
  console.error("Anon API check failed:", error.message);
  process.exit(1);
}
console.log("OK — business_settings:", data?.brand_name ?? "(no row)");

const { data: menu, error: menuErr } = await pub
  .from("daily_menus")
  .select("id, menu_date, status")
  .eq("status", "published")
  .order("menu_date", { ascending: false })
  .limit(1)
  .maybeSingle();
if (menuErr) {
  console.error("Published menu check failed:", menuErr.message);
  process.exit(1);
}
console.log("OK — latest published menu:", menu?.menu_date ?? "(none)");

if (service) {
  const admin = createClient(url, service, { auth: { persistSession: false } });
  const { count, error: cErr } = await admin.from("daily_menus").select("*", { count: "exact", head: true });
  if (cErr) console.warn("Service role check:", cErr.message);
  else console.log("OK — daily_menus count:", count);
} else {
  console.warn("SUPABASE_SERVICE_ROLE_KEY not set — checkout will not work until added.");
}
