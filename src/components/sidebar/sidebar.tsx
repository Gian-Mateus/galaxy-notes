import type { ReactNode } from "react";
import "./sidebar.css";
import type { LucideIcon } from "lucide-react";

export interface SidebarItem {
  label: string;
  icon: LucideIcon;
  link: string;
}

// ============================================================================
// Sidebar Principal
// ============================================================================
interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <nav className="sidebar">
      <div className="sidebar-wrapper">{children}</div>
    </nav>
  );
}

// ============================================================================
// Sidebar Brand (Logo/Título)
// ============================================================================
export function SidebarBrand({ children }: SidebarProps) {
  return <div className="sidebar-brand">{children}</div>;
}

// ============================================================================
// Sidebar Items (Aceita items como prop OU children manual)
// ============================================================================
interface SidebarItemsProps {
  items?: SidebarItem[];
  children?: ReactNode;
  renderItem?: (item: SidebarItem, index: number) => ReactNode;
}

export function SidebarItems({
  items,
  children,
  renderItem,
}: SidebarItemsProps) {
  return (
    <div className="sidebar-group-items">
      <ul className="sidebar-list-items">
        {items
          ? items.map((item, index) =>
              renderItem ? (
                renderItem(item, index)
              ) : (
                <SidebarItemDefault key={index} item={item} />
              ),
            )
          : children}
      </ul>
    </div>
  );
}

// ============================================================================
// Sidebar Item Default (renderização padrão de um item)
// ============================================================================
interface SidebarItemDefaultProps {
  item: SidebarItem;
}

export function SidebarItemDefault({ item }: SidebarItemDefaultProps) {
  const Icon = item.icon;

  return (
    <li>
      <a href={item.link}>
        <span>{Icon && <Icon size={32} />}</span>
        {item.label}
      </a>
    </li>
  );
}

// ============================================================================
// Sidebar Footer
// ============================================================================
export function SidebarFooter({ children }: SidebarProps) {
  return <div className="sidebar-footer">{children}</div>;
}

// ============================================================================
// Sidebar Provider (wrapper que envolve Sidebar + Conteúdo)
// ============================================================================
export function SidebarProvider({ children }: SidebarProps) {
  
  /*
  * Futuramente utilizar o provider, para dar contexto do sidebar aberto ou fechado
  * E também dar contexto do componente ativo
  */
  return (
    <div className="sidebar-provider">
      {children}
    </div>
  );
}
