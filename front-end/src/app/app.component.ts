import { Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotificationService } from './services/notification.service';
import { GlobalConstants } from './common/global.constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @BlockUI() blockUI: NgBlockUI;
  title = GlobalConstants.APP_TITLE;

  constructor(protected notificationSvc: NotificationService, public router: Router) {}

}
