import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SiteService } from 'src/app/services/site.service';
import { GlobalConstants } from '../../../common/global.constants';

@Component({
  selector: 'app-mediciones-juntas',
  templateUrl: './mediciones-juntas.component.html',
  styleUrls: ['./mediciones-juntas.component.css']
})
export class MedicionesJuntasComponent implements OnInit {
  public isDataLoaded = false;
  public juntaSelected = false;
  public dashboardUrlX: SafeResourceUrl;
  public dashboardUrlY: SafeResourceUrl;
  public dashboardUrlZ: SafeResourceUrl;
  public dashboardUrlT: SafeResourceUrl;
  public juntas = [];
  public junta: string;

  constructor(private siteService: SiteService, protected sanitizer: DomSanitizer) { }
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    this.blockUI.start('Cargando Datos de Juntas...');
    this.siteService.getJuntas().subscribe(
      res => {
        this.blockUI.stop();
        console.log(res);
        this.juntas = res;
        this.isDataLoaded = true;
      },
      error => {
        this.blockUI.stop();
      });
  }

  selectJunta(){
    console.log('cambié a ', this.junta);
    const anio = new Date().getFullYear();
    const epochIni = (new Date(anio, 0, 1).getTime()).toString();
    const epochFin = (new Date(anio, 11, 31).getTime()).toString();
    this.dashboardUrlX = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_JUNTAS_X(this.junta, epochIni, epochFin));
    this.dashboardUrlY = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_JUNTAS_Y(this.junta, epochIni, epochFin));
    this.dashboardUrlZ = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_JUNTAS_Z(this.junta, epochIni, epochFin));
    this.dashboardUrlT = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.GRAFANA_JUNTAS_T(this.junta, epochIni, epochFin));
    this.juntaSelected = true;

  }

}
