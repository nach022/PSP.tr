import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { AuthService } from 'src/app/services/auth.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common/global.constants';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @Input() sidenav: any;
  @Output() sidenavClose = new EventEmitter();
  public menu: any;
  public version = GlobalConstants.APP_VERSION;

  constructor(private siteService: SiteService, private authService: AuthService, private router: Router) { }
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    if (this.authService.loggedIn()) {
      this.blockUI.start('Cargando Menú de Opciones...');
      this.siteService.getMenu().subscribe(
        res => {
          this.blockUI.stop();
          this.menu = res;
        },
        () => {
          this.blockUI.stop();
        }
      );
    }
  }

  public onSidenavClose(path: string): void {
    this.router.navigate([path]);
    this.sidenavClose.emit();
  }



}
