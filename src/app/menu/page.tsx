import { MenuDayView } from "@/components/menu/menu-day-view";
import { todayMenuDateString } from "@/lib/dates";

export const metadata = { title: "Menu" };

export default function MenuPage() {
  const today = todayMenuDateString();
  return <MenuDayView menuDate={today} title="Today's menu" />;
}
