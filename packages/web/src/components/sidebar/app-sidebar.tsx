import {
  Sidebar,
  SidebarBrand,
  SidebarItems,
  SidebarFooter,
  ToggleSidebar,
  type SidebarItem,
} from "./sidebar";
import { items, itemsFooter } from "@parameters/items-sidebar";

// ============================================================================
// AppSidebar - Composição pronta para usar na aplicação
// ============================================================================
interface AppSidebarProps {
  brandLogo?: string;
  brandName?: string;
  mainItems?: SidebarItem[];
  footerItems?: SidebarItem[];
}

export function AppSidebar({
  brandLogo = "/planet.svg",
  brandName = "Galaxy Notes",
  mainItems = items,
  footerItems = itemsFooter,
}: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarBrand>
        <img src={brandLogo} alt={`Logo ${brandName}`} />
        <h2 className="sidebar-brand-name">{brandName}</h2>
      </SidebarBrand>

      <SidebarItems items={mainItems} />

      <SidebarFooter>
        <SidebarItems items={footerItems} />
        <ToggleSidebar>
          Ocultar
        </ToggleSidebar>
      </SidebarFooter>
    </Sidebar>
  );
}
