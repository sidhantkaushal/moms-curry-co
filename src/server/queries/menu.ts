import { createSupabaseServerClient } from "@/server/db/supabase-server";

export type PublicMenuItem = {
  id: string;
  pricePaise: number;
  isSoldOut: boolean;
  sortOrder: number;
  variant: {
    id: string;
    name: string;
    product: {
      id: string;
      name: string;
      slug: string;
      description: string | null;
      imagePath: string | null;
      categorySlug: string | null;
    };
  };
};

export type PublicDailyMenu = {
  id: string;
  menuDate: string;
  status: string;
  orderingOpensAt: string | null;
  orderingClosesAt: string | null;
  items: PublicMenuItem[];
};

export async function fetchPublishedMenuForDate(menuDate: string): Promise<PublicDailyMenu | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data: menu, error: menuError } = await supabase
    .from("daily_menus")
    .select("id, menu_date, status, ordering_opens_at, ordering_closes_at")
    .eq("menu_date", menuDate)
    .eq("status", "published")
    .maybeSingle();

  if (menuError || !menu) return null;

  const { data: rows, error: itemsError } = await supabase
    .from("daily_menu_items")
    .select(
      `
      id,
      price_paise,
      is_sold_out,
      sort_order,
      product_variants (
        id,
        name,
        products (
          id,
          name,
          slug,
          description,
          image_path,
          categories ( slug )
        )
      )
    `,
    )
    .eq("daily_menu_id", menu.id)
    .order("sort_order", { ascending: true });

  if (itemsError || !rows) return null;

  const items: PublicMenuItem[] = [];
  for (const row of rows) {
    const variant = row.product_variants as unknown as {
      id: string;
      name: string;
      products: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        image_path: string | null;
        categories: { slug: string } | null;
      };
    } | null;
    if (!variant?.products) continue;
    items.push({
      id: row.id as string,
      pricePaise: row.price_paise as number,
      isSoldOut: row.is_sold_out as boolean,
      sortOrder: row.sort_order as number,
      variant: {
        id: variant.id,
        name: variant.name,
        product: {
          id: variant.products.id,
          name: variant.products.name,
          slug: variant.products.slug,
          description: variant.products.description,
          imagePath: variant.products.image_path,
          categorySlug: variant.products.categories?.slug ?? null,
        },
      },
    });
  }

  return {
    id: menu.id,
    menuDate: menu.menu_date,
    status: menu.status,
    orderingOpensAt: menu.ordering_opens_at,
    orderingClosesAt: menu.ordering_closes_at,
    items,
  };
}

export async function fetchBusinessSettings() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;
  const { data } = await supabase.from("business_settings").select("*").eq("id", 1).maybeSingle();
  return data;
}
