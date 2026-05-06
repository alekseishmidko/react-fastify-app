import { Link, useLocation } from 'react-router-dom';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { PlusIcon, SquaresExclude } from 'lucide-react';

export function AppSidebarNav() {
  const pathname = useLocation().pathname;

  const isCreate = pathname === '/events/new';
  const isMy = pathname.startsWith('/events/my');
  const isAll =
    pathname === '/events' ||
    (pathname.startsWith('/events/') &&
      pathname !== '/events/new' &&
      !pathname.startsWith('/events/my'));

  return (
    <SidebarMenu className="gap-3 px-1">
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          size="lg"
          isActive={isCreate}
          tooltip="Создать событие"
          className="min-h-12 bg-primary py-3 text-primary-foreground"
        >
          <Link to="/events/new">
            <PlusIcon />
            <span>Создать событие</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isAll} tooltip="Все события">
          <Link to="/events">
            <SquaresExclude />
            <span>Все события</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isMy} tooltip="Мои события">
          <Link to="/events/my">
            <SquaresExclude />
            <span>Мои события</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
