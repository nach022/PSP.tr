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
        this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://172.16.3.43:3000/d-solo/o8DrKF4Gk/homepage?orgId=1${this.filtro}&theme=light&panelId=4`);
        this.dashboardUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(`http://172.16.3.43:3000/d-solo/o8DrKF4Gk/homepage?orgId=1${this.filtro}&theme=light&panelId=5`);
        this.dashboardUrl3 = this.sanitizer.bypassSecurityTrustResourceUrl(`http://172.16.3.43:3000/d-solo/o8DrKF4Gk/homepage?orgId=1&theme=light&panelId=2`);
        this.isDataLoaded = true;

      },
      err => {
        console.log(err);
        this.blockUI.stop();
      });
    }
    else{
      this.filtro = sessionStorage.getItem(GlobalConstants.SESSION_FILTRO_AREAS);
      this.dashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`http://172.16.3.43:3000/d-solo/o8DrKF4Gk/homepage?orgId=1${this.filtro}&theme=light&panelId=4`);
      this.dashboardUrl2 = this.sanitizer.bypassSecurityTrustResourceUrl(`http://172.16.3.43:3000/d-solo/o8DrKF4Gk/homepage?orgId=1${this.filtro}&theme=light&panelId=5`);
      this.dashboardUrl3 = this.sanitizer.bypassSecurityTrustResourceUrl(`http://172.16.3.43:3000/d-solo/o8DrKF4Gk/homepage?orgId=1&theme=light&panelId=2`);
      this.isDataLoaded = true;
    }
  }


  navegarTareas(){
    alert('click');
  }

}
