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

  constructor(private router: Router, private notif: NotificationService) { }

  ngOnInit(): void {
  }

  navbarItemClick(item: NavbarItem){
    this.notif.clear();
    this.router.navigate([item.route]).catch(err => {
      this.notif.error(err);
    });
  }

}
