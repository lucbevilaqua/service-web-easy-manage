import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { ZardIconComponent } from '@shared/components/icon/icon.component';
import { ZardIcon } from '@shared/components/icon/icons';
import { SidebarGroupComponent, SidebarGroupLabelComponent } from '@shared/components/layout/sidebar.component';
import { DarkModeService } from '@shared/services/darkmode.service';
import { extractRoles, hasAllRoles } from 'src/app/core/auth/roles';
import { MENU_DATA } from 'src/app/core/data/menu.data';

export type MenuItem = {
  label: string;
  route: string;
  permissions?: string[];
  isBeta?: boolean;
  icon?: ZardIcon;
};

export type MenuGroup = {
  name: string;
  items: MenuItem[];
};

@Component({
  selector: 'app-sidebar-content',
  imports: [CommonModule, RouterLink, ZardIconComponent, SidebarGroupLabelComponent, SidebarGroupComponent],
  templateUrl: './sidebar-content.html',
  styleUrl: './sidebar-content.css',
})
export class SidebarContent {
  private readonly auth = inject(AuthService);
  private readonly dark = inject(DarkModeService);

  readonly user = signal<Record<string, unknown> | null>(null);
  readonly userRoles = signal<string[]>([]);

  readonly userPicture = computed(() => {
    const u = this.user();
    return (u as any)?.picture ?? null;
  });

  readonly userDisplayName = computed(() => {
    const u = this.user();
    if (!u) return '';
    return (u as any).nickname || (u as any).name || '';
  });

  readonly userEmail = computed(() => {
    const u = this.user();
    return (u as any).email || '';
  });

  // Exemplo de menu agrupado. O usuário pode editar essa estrutura conforme desejar.
  readonly menuGroups: MenuGroup[] = MENU_DATA;

  constructor() {
    // mantém user e roles atualizados
    this.auth.user$.subscribe((u) => {
      this.user.set(u ?? null);
      this.userRoles.set(extractRoles(u ?? null));
    });

    // inicializa tema a partir do storage/preferência
    this.dark.initTheme();
  }

  toggleTheme(): void {
    this.dark.toggleTheme();
  }

  themeIcon(): ZardIcon {
    return this.dark.getCurrentTheme() === 'dark' ? 'sun' : 'moon';
  }

  canShow(item: MenuItem): boolean {
    return hasAllRoles(this.userRoles(), item.permissions ?? []);
  }

  // trackBy helpers for @for track usage
  trackByGroup = (_: number, g: MenuGroup) => g.name;
  trackByItem = (_: number, i: MenuItem) => i.route;
}
