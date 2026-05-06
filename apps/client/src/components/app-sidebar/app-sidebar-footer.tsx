import type { UserPublic } from '@/shared/api/types';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getUserInitials } from '@/lib/utils';
import { LogOutIcon } from 'lucide-react';

type Props = {
  user: UserPublic;
  sidebarExpanded: boolean;
  onLogout: () => void;
};

export function AppSidebarUserFooter({ user, sidebarExpanded, onLogout }: Props) {
  return (
    <SidebarMenu className="gap-2 px-1">
      {sidebarExpanded ? (
        <SidebarMenuItem>
          <div className="flex items-center gap-2 rounded-md px-2 py-1 5">
            <Avatar className="size-8 rounded-lg">
              <AvatarFallback className="rounded-lg text-xs">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </SidebarMenuItem>
      ) : null}

      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => onLogout()} tooltip="Выйти из аккаунта">
          <LogOutIcon />
          <span>Выйти</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
