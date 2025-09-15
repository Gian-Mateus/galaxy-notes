import {
  CalendarDays,
  ClipboardList,
  Clock,
  NotebookPen,
  SquareKanban,
} from "lucide-react";
import "./home.css";

export function Home() {
  const cards = [
    {
      content: "Pomodoro",
      icon: Clock,
      link: "####",
    },
    {
      content: "Listas",
      icon: ClipboardList,
      link: "####",
    },
    {
      content: "Kanban",
      icon: SquareKanban,
      link: "####",
    },
    {
      content: "Agenda",
      icon: CalendarDays,
      link: "####",
    },
    {
      content: "Anotações",
      icon: NotebookPen,
      link: "####",
    },
  ];
  return (
    <div className="grid-cards">
      {cards.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="card">
            <a href={item.link}>
              <span>
                <Icon size={52} />
              </span>
              {item.content}
            </a>
          </div>
        );
      })}
    </div>
  );
}
