import { Component, OnInit } from '@angular/core';
import { NavbarItem } from '../../../models/NavbarItem';
import { SiteService } from '../../../services/site.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar-items',
  templateUrl: './navbar-items.component.html',
  styleUrls: ['./navbar-items.component.css']
})
export class NavbarItemsComponent implements OnInit {
  navbarItems: NavbarItem[];

  constructor(private siteService: SiteService, private authService: AuthService) { }
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.blockUI.start('Cargando Menú de Opciones...');
      this.siteService.getMenu().subscribe(
        res => {
          this.blockUI.stop();
          this.navbarItems = res;
        },
        err => {
          this.blockUI.stop();
        }
      )
    }
  }

}
