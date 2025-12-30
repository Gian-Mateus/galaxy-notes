import type { SidebarItem } from "@/components/sidebar/sidebar";
import {
  Bolt,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  SquareKanban,
} from "lucide-react";


export const items: SidebarItem[] = [
  {
    label: "Home",
    icon: LayoutDashboard,
    link: "####",
  },
  {
    label: "Listas",
    icon: ClipboardList,
    link: "####",
  },
  {
    label: "Kanban",
    icon: SquareKanban,
    link: "####",
  },
  {
    label: "Agenda",
    icon: CalendarDays,
    link: "####",
  },
  {
    label: "Anotações",
    icon: NotebookPen,
    link: "####",
  },
];

export const itemsFooter: SidebarItem[] = [
  {
    label: "Configurações",
    icon: Bolt,
    link: "####",
  },
  {
    label: "Sair",
    icon: LogOut,
    link: "####",
  },
];
