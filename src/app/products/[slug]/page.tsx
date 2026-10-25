import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/server/db/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: slug.replace(/-/g, " ") };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: product } = await supabase!
    .from("products")
    .select("name, description, product_variants ( name, price_paise )")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) notFound();

  const variants = (product.product_variants as { name: string; price_paise: number }[]) ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/menu" className="text-sm text-terracotta hover:underline">← Menu</Link>
      <h1 className="mt-4 font-serif text-3xl text-forest">{product.name}</h1>
      {product.description ? <p className="mt-4 text-brown/80">{product.description}</p> : null}
      <h2 className="mt-8 text-sm font-medium uppercase tracking-wide text-gold">Portions</h2>
      <ul className="mt-3 space-y-2 text-sm">
        {variants.map((v) => (
          <li key={v.name} className="flex justify-between border-b border-forest/10 py-2">
            <span>{v.name}</span>
            <span>From catalogue — see today&apos;s menu for ordering price</span>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-brown/70">
        Order from <Link href="/menu" className="underline">today&apos;s menu</Link> for current availability and
        prices.
      </p>
    </div>
  );
}
