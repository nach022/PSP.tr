import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { GlobalConstants } from '../../../common/global.constants';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-rpt-grupo-accion',
  templateUrl: './rpt-grupo-accion.component.html',
  styleUrls: ['./rpt-grupo-accion.component.css']
})
export class RptGrupoAccionComponent implements OnInit {


  constructor(private siteService: SiteService, private notif: NotificationService, private router: Router) { }
  @BlockUI() blockUI: NgBlockUI;
  public isDataLoaded = false;
  public grupos: any;
  public area: number;
  public comentario: string;

  ngOnInit(): void {
    this.blockUI.start('Cargando Grupo de Acción...');
    this.siteService.getServiciosEjecutores().subscribe(
      res => {
        this.blockUI.stop();
        this.grupos = res;
        this.isDataLoaded = true;
        console.log(this.grupos);
      },
      err => {
        this.blockUI.stop();
      }
    );
  }

  generarReporte(){
    const nombre = (this.grupos.find(x => x.Id === this.area)).Nombre;
    this.siteService.postReporte(this.area, this.comentario).subscribe(
      res => {
        saveAs(res, `Informe PSP - ${nombre}.docx`);
        this.blockUI.stop();
        console.log(res);

      },
      err => {
        console.log(err);
        this.blockUI.stop();
      }
    );
  }

}
