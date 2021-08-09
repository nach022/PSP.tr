import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { GlobalConstants } from '../../../common/global.constants';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ThrowStmt } from '@angular/compiler';
import {FormGroup, FormControl} from '@angular/forms';
import * as moment from 'moment';



@Component({
  selector: 'app-rpt-grupo-accion',
  templateUrl: './rpt-grupo-accion.component.html',
  styleUrls: ['./rpt-grupo-accion.component.css'],
  providers: [

  ],
})
export class RptGrupoAccionComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(moment()),
    end: new FormControl(moment())
  });







  constructor(private siteService: SiteService) { }
  @BlockUI() blockUI: NgBlockUI;
  public isDataLoaded = false;
  public grupos: any;
  public area: number;
  public comentario: string[] = ['','','','','',''];
  public inicio: Date;
  public fin: Date;
  public preguntas = [];
  public labels = [];


  ngOnInit(): void {
    this.blockUI.start('Cargando Grupos de Acción...');
    this.siteService.getServiciosEjecutores().subscribe(
      res => {
        this.grupos = res;
        this.isDataLoaded = true;
        console.log(this.grupos);
        this.grupos.forEach(element => {
          this.preguntas[element.Id] = ['Comentarios Generales'];
          this.labels[element.Id] = ['Comentarios Generales'];
        });

        this.preguntas[9] = [
          'En referencia a la instrumentación de Auscultación, se realizan los siguientes comentarios',
          'En referencia a las inspecciones visuales del Sector AyV se realizan los siguientes comentarios',
          'En referencia a las inspecciones visuales del Sector MyO se realizan los siguientes comentarios',
          'En referencia a las acciones de mantenimiento del Sector MyO se realizan los siguientes comentarios',
          'En referencia a las acciones de mantenimiento por desmalezado realizadas por el AGA se realizan los siguientes comentarios',
          'Comentarios generales'
        ];
        this.labels[9] = [
          'Comentarios referentes a instrumentación de auscultación',
          'Comentarios referentes a inspecciones de AyV',
          'Comentarios referentes a inspecciones de MyO',
          'Comentarios referentes a mantenimientos de MyO',
          'Comentarios referentes a desmalezados AGA',
          'Comentarios generales'
        ];
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      }
    );
  }

  generarReporte(){
    const nombre = (this.grupos.find(x => x.Id === this.area)).Nombre;
    this.siteService.postReporte(this.area, this.comentario, this.inicio, this.fin).subscribe(
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
