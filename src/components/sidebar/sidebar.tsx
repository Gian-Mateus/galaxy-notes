import {
  Bolt,
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  NotebookPen,
  SquareKanban,
} from "lucide-react";
import "./sidebar.css";
export function Sidebar() {
  const items = [
    {
      label: "home",
      icon: LayoutDashboard,
      link: "####",
    },
    {
      label: "listas",
      icon: ClipboardList,
      link: "####",
    },
    {
      label: "kanban",
      icon: SquareKanban,
      link: "####",
    },
    {
      label: "agenda",
      icon: CalendarDays,
      link: "####",
    },
    {
      label: "anotações",
      icon: NotebookPen,
      link: "####",
    },
  ];
  return (
    <nav className="sidebar">
      <div className="sidebar-wrapper">
        <div className="sidebar-brand">
          <img src="/planet.svg" alt="Logo Planeta" />
          <h2 className="sidebar-brand-name">Galaxy Notes</h2>
        </div>
        <div className="sidebar-group-items">
          <ul className="sidebar-list-items">
            {items.map((item, index) => {
              const Icon = item.icon;
              return (
                <li key={index}>
                  <a href={item.link}>
                    <span>{Icon && <Icon size={32} />}</span>
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="sidebar-footer">
          <ul className="sidebar-footer-group">
            <li>
              <a href="####">
                <span>
                  <LogOut size={32} />
                </span>
                Logout
              </a>
            </li>
            <li>
              <a href="####">
                <span>
                  <Bolt size={32} />
                </span>
                Configurações
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
