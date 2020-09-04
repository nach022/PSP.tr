import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SiteService } from 'src/app/services/site.service';

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
    const epochIni = new Date(anio, 0, 1).getTime();
    const epochFin = new Date(anio, 11, 1).getTime();
    this.dashboardUrlX = this.sanitizer.bypassSecurityTrustResourceUrl(`http://10.101.0.57:3003/d-solo/UKwkTCNGz/mediciones-juntas?orgId=1&var-Junta=${this.junta}&from=${epochIni}&to=${epochFin}&panelId=4&theme=light`);
    this.dashboardUrlY = this.sanitizer.bypassSecurityTrustResourceUrl(`http://10.101.0.57:3003/d-solo/UKwkTCNGz/mediciones-juntas?orgId=1&var-Junta=${this.junta}&from=${epochIni}&to=${epochFin}&panelId=8&theme=light`);
    this.dashboardUrlZ = this.sanitizer.bypassSecurityTrustResourceUrl(`http://10.101.0.57:3003/d-solo/UKwkTCNGz/mediciones-juntas?orgId=1&var-Junta=${this.junta}&from=${epochIni}&to=${epochFin}&panelId=7&theme=light`);
    this.dashboardUrlT = this.sanitizer.bypassSecurityTrustResourceUrl(`http://10.101.0.57:3003/d-solo/UKwkTCNGz/mediciones-juntas?orgId=1&var-Junta=${this.junta}&from=${epochIni}&to=${epochFin}&panelId=10&theme=light`);
    this.juntaSelected = true;

  }

}
