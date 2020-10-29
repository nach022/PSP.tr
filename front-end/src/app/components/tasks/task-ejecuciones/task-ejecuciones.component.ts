import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../../../services/site.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-task-ejecuciones',
  templateUrl: './task-ejecuciones.component.html',
  styleUrls: ['./task-ejecuciones.component.css']
})
export class TaskEjecucionesComponent implements OnInit  {
  public tarea;
  public id;
  public frecuencia;
  public dataLoaded = false;
  public ots: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public futuras: any[];
  public periodMap = {
    Y: [],
    M: [],
    D: [],
    W: [],
  };

  public displayedColumns: string[] = ['OT', 'Vencimiento', 'Inicio', 'Fin', 'Estado', 'Comentarios'];
  public displayedColumns2: string[] = ['OT2', 'Vencimiento2'];

  constructor(private activatedRoute: ActivatedRoute, private siteService: SiteService) { }
  @BlockUI() blockUI: NgBlockUI;
  ngOnInit() {
    this.periodMap.Y[1] = 'año';
    this.periodMap.Y[2] = 'años';
    this.periodMap.M[1] = 'mes';
    this.periodMap.M[2] = 'meses';
    this.periodMap.D[1] = 'día';
    this.periodMap.D[2] = 'días';
    this.periodMap.W[1] = 'semana';
    this.periodMap.W[2] = 'semanas';

    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.blockUI.start('Cargando Datos de Tarea...');
      this.siteService.getTarea(this.id).subscribe(
        tar => {
          this.blockUI.stop();
          this.tarea = tar;
          console.log('Tarea:', tar);

          this.frecuencia= `${tar.Frecuencia}  ${tar.Periodo !== null ? this.periodMap[tar.Periodo.trim()][tar.Frecuencia > 1 ? 2 : 1] : ''}`,

          this.blockUI.start('Cargando Ejecuciones de Tarea...');
          this.siteService.getOTs(this.id).subscribe(
          ots => {
            this.blockUI.stop();
            this.ots = new MatTableDataSource(ots);
            this.paginator._intl.itemsPerPageLabel = 'Items por página';
            this.paginator._intl.firstPageLabel = 'Primera página';
            this.paginator._intl.lastPageLabel = 'Última página';
            this.paginator._intl.nextPageLabel = 'Próxima página';
            this.paginator._intl.previousPageLabel = 'Página anterior';
            console.log(this.paginator._intl);
            console.log(this.paginator._intl.getRangeLabel(1, 20, 500));
            this.ots.paginator = this.paginator;
            console.log(ots);
            this.blockUI.start('Calculando Ejecuciones Futuras de Tarea...');
            this.siteService.getEjecucionesFuturas(this.id).subscribe(
              futuras => {
                this.blockUI.stop();
                this.futuras = futuras;
                console.log(futuras);
                this.dataLoaded = true;
              }
              ,
              () => {
                this.blockUI.stop();
              }
            );


          },
          () => {
            this.blockUI.stop();
          });





        },
        () => {
          this.blockUI.stop();
        });

    });


  }



}
