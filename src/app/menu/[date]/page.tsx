import { MenuDayView } from "@/components/menu/menu-day-view";
import { formatMenuDateLabel } from "@/lib/dates";

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props) {
  const { date } = await params;
  return { title: `Menu · ${formatMenuDateLabel(date)}` };
}

export default async function MenuDatePage({ params }: Props) {
  const { date } = await params;
  return <MenuDayView menuDate={date} title={formatMenuDateLabel(date)} />;
}
