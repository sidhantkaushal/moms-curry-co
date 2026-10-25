import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[60vh] bg-ivory">
      <div className="border-b border-forest/10 bg-white/80">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 text-sm">
          <Link href="/admin" className="font-medium text-forest">Admin</Link>
          <Link href="/admin/orders" className="text-brown/80 hover:text-forest">Orders</Link>
          <Link href="/" className="ml-auto text-brown/60 hover:text-forest">← Site</Link>
        </div>
      </div>
      {children}
    </div>
  );
}
