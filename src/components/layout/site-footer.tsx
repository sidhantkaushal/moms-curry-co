import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-forest/10 bg-ivory">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-brown/80 md:grid-cols-3">
        <div>
          <p className="font-semibold text-forest">Mom&apos;s Curry Co.</p>
          <p className="mt-1">Home-style Indian meals, made with care.</p>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cancellation-refunds">Cancellation &amp; refunds</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/contact">Contact</Link>
          <Link href="/admin">Kitchen login</Link>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-brown/60">
        © Mom&apos;s Curry Co. Personal project — configure business details in admin.
      </p>
    </footer>
  );
}
