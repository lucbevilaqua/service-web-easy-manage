import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContentComponent } from '@shared/components/layout/content.component';
import { FooterComponent } from '@shared/components/layout/footer.component';
import { HeaderComponent } from '@shared/components/layout/header.component';
import { LayoutComponent } from '@shared/components/layout/layout.component';
import { SidebarComponent } from '@shared/components/layout/sidebar.component';
import { SidebarContent } from '../sidebar-content/sidebar-content';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, LayoutComponent, HeaderComponent, ContentComponent, FooterComponent, SidebarComponent, SidebarContent],
  templateUrl: './app-layout.html',
  styleUrl: './app-layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppLayout {

}
