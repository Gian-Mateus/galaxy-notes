import { createContext, useContext, useState, type ReactNode } from "react";
import "./sidebar.css";
import { PanelLeftClose, PanelLeft, type LucideIcon } from "lucide-react";

export interface SidebarItem {
  label: string;
  icon: LucideIcon;
  link: string;
  sizeIcon?: number;
}

// ============================================================================
// Context
// ============================================================================
interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de SidebarProvider");
  }
  return context;
}

// ============================================================================
// Sidebar Provider
// ============================================================================
interface SidebarProviderProps {
  children: ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <div className="sidebar-provider">{children}</div>
    </SidebarContext.Provider>
  );
}

// ============================================================================
// Sidebar Principal
// ============================================================================
interface SidebarProps {
  children: ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const { isOpen } = useSidebar();

  return (
    <nav className={`sidebar ${isOpen ? "" : "closed"}`}>
      <div className="sidebar-wrapper">{children}</div>
    </nav>
  );
}

// ============================================================================
// Sidebar Brand
// ============================================================================
export function SidebarBrand({ children }: SidebarProps) {
  return <div className="sidebar-brand">{children}</div>;
}

// ============================================================================
// Sidebar Items
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
// Sidebar Item Default
// ============================================================================
interface SidebarItemDefaultProps {
  item: SidebarItem;
}

export function SidebarItemDefault({ item }: SidebarItemDefaultProps) {
  const Icon = item.icon;

  return (
    <li>
      <a href={item.link}>
        <span>{Icon && <Icon size={item.sizeIcon || 32} />}</span>
        <span>{item.label}</span>
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
// Toggle Sidebar
// ============================================================================
export function ToggleSidebar({ children }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();

  return (
    <button onClick={toggle} className="sidebar-toggle">
      {isOpen ? <PanelLeftClose size={24} /> : <PanelLeft size={24} />}
      <span>{children}</span>
    </button>
  );
}
