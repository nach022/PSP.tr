import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { GlobalConstants } from '../../common/global.constants';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {
  public filtro: string;
  public isDataLoaded = false;
  public dashboardUrl: SafeResourceUrl;
  public dashboardUrl2: SafeResourceUrl;
  public dashboardUrl3: SafeResourceUrl;

  constructor(private authService: AuthService, private sanitizer: DomSanitizer) {
  }
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    if (!sessionStorage.getItem(GlobalConstants.SESSION_FILTRO_AREAS)){
      this.blockUI.start('Aplicando Filtros de Grupos de Acción...');
      this.authService.getFiltroAreas().subscribe(
      res => {
        this.blockUI.stop();
        let filtro = '';
        res.forEach(area => {
          filtro = `${filtro}&var-area=${area}`;
        });
        sessionStorage.setItem(GlobalConstants.SESSION_FILTRO_AREAS, filtro);
        this.filtro = filtro;


        this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_HOME_TAREAS(this.filtro));
        this.dashboardUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_HOME_TRABAJOS(this.filtro));
        this.dashboardUrl3 = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_HOME_LAST_UPD);
        this.isDataLoaded = true;

      },
      err => {
        console.log(err);
        this.blockUI.stop();
      });
    }
    else{
      this.filtro = sessionStorage.getItem(GlobalConstants.SESSION_FILTRO_AREAS);
      this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_HOME_TAREAS(this.filtro));
      this.dashboardUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_HOME_TRABAJOS(this.filtro));
      this.dashboardUrl3 = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_HOME_LAST_UPD);
      this.isDataLoaded = true;
    }
  }


  navegarTareas(){
    alert('click');
  }

}
