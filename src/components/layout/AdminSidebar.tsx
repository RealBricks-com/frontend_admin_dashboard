import { 
  Building2, 
  Users, 
  FileText, 
  MapPin, 
  Settings, 
  Home,
  Receipt,
  Mail,
  UserCheck,
  Building,
  Layers,
  HeartHandshake
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Developers", url: "/developers", icon: Building2 },
  { title: "Projects", url: "/projects", icon: Building },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Invoices", url: "/invoices", icon: Receipt },
];

const managementItems = [
  { title: "Admin Users", url: "/admin-users", icon: UserCheck },
  { title: "Builder Users", url: "/builder-users", icon: Users },
  { title: "User Auth", url: "/user-auth", icon: Settings },
];

const systemItems = [
  { title: "Countries", url: "/countries", icon: MapPin },
  { title: "States", url: "/states", icon: Layers },
  { title: "Cities", url: "/cities", icon: MapPin },
  { title: "Districts", url: "/districts", icon: MapPin },
  { title: "Areas", url: "/areas", icon: MapPin },
  { title: "Amenities", url: "/amenities", icon: HeartHandshake },
];

const utilityItems = [
  { title: "Email Events", url: "/email-events", icon: Mail },
  { title: "Project Media", url: "/project-media", icon: FileText },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={collapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">Estate Admin</h1>
                <p className="text-xs text-muted-foreground">Management Portal</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className={isActive(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  >
                    <NavLink to={item.url} end>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>User Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className={isActive(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className={isActive(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Utilities</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className={isActive(item.url) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}