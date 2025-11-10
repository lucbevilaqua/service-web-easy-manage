import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ZardIconComponent } from '@shared/components/icon/icon.component';

@Component({
  selector: 'app-not-authorized',
  imports: [RouterLink, ZardIconComponent],
  templateUrl: './not-authorized.html',
  styleUrls: ['./not-authorized.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotAuthorized {

}
