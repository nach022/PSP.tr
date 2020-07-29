import { Component, OnInit, Input } from '@angular/core';
import { NavbarItem } from 'src/app/models/NavbarItem';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-navbar-item',
  templateUrl: './navbar-item.component.html',
  styleUrls: ['./navbar-item.component.css']
})
export class NavbarItemComponent implements OnInit {
  @Input() navbarItem: NavbarItem;

  constructor(private _router: Router, private _notif: NotificationService) { }

  ngOnInit(): void {
  }

  navbarItemClick(item : NavbarItem){
    this._notif.clear();
    this._router.navigate([item.route]).catch(err =>{
      this._notif.error(err);
    });
  }

}
