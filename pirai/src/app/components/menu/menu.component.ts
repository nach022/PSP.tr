import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { AuthService } from 'src/app/services/auth.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() sidenav: any;
  @Output() sidenavClose = new EventEmitter();
  public menu: any;


  constructor(private siteService: SiteService, private authService: AuthService) { }
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.blockUI.start('Cargando Menú de Opciones...');
      this.siteService.getMenu().subscribe(
        res => {
          this.blockUI.stop();
          this.menu = res;
        },
        err => {
          this.blockUI.stop();
        }
      );
    }
  }

  objetizar(str: string): object {
    if (str) {
      return JSON.parse(str);
    } else {
      return null;
    }
  }

  public onSidenavClose() {
    this.sidenavClose.emit();
  }



}
