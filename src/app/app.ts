import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeService } from '@shared/services/darkmode.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly darkmodeService = inject(DarkModeService);
 
  ngOnInit(): void {
    this.darkmodeService.initTheme();
  }
}
