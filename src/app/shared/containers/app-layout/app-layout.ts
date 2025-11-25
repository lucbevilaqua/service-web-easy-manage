import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarContent } from '../sidebar-content/sidebar-content';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from '@ui/components';
import { ContentComponent } from '@ui/components/layout/content.component';
import { SidebarComponent } from '@ui/components/layout/sidebar.component';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, LayoutComponent, ContentComponent, SidebarComponent, SidebarContent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayout {

}
