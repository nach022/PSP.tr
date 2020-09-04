import { Component, OnInit, ViewChild } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-freq-diff',
  templateUrl: './freq-diff.component.html',
  styleUrls: ['./freq-diff.component.css']
})
export class FreqDiffComponent implements OnInit {

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public periodMap = {
    Y: [],
    M: [],
    D: [],
    W: [],
  };
  public displayedColumns: string[] = ['PPM', 'Descr', 'Equipo', 'Frecuencia', 'FrecuenciaEAM'];

  @ViewChild(MatSort) sort: MatSort;


  constructor(private siteService: SiteService) {
  }
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    this.periodMap.Y[1] = 'año';
    this.periodMap.Y[2] = 'años';
    this.periodMap.M[1] = 'mes';
    this.periodMap.M[2] = 'meses';
    this.periodMap.D[1] = 'día';
    this.periodMap.D[2] = 'días';
    this.periodMap.W[1] = 'semana';
    this.periodMap.W[2] = 'semanas';

    this.blockUI.start('Cargando Datos de Tareas...');
    this.siteService.getTareasFreqDiff().subscribe(
      res => {
        console.log(res);
        this.blockUI.stop();
        const table = [];
        res.forEach(element => {

          table.push({
            PPM: element.PPM,
            Descr: element.Descr,
            Equipo: element.Equipo,
            EquipoDescr: element.EquipoDescr,
            Frecuencia: `${element.Frecuencia}  ${element.Periodo !== null ? this.periodMap[element.Periodo.trim()][element.Frecuencia > 1 ? 2 : 1] : ''}`,
            FrecuenciaEAM: `${element.FrecuenciaEAM}  ${element.PeriodoEAM !== null ? this.periodMap[element.PeriodoEAM.trim()][element.FrecuenciaEAM > 1 ? 2 : 1] : ''}`,

          });

        });
        this.dataSource = new MatTableDataSource(table);
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
      },
      err => {
        this.blockUI.stop();
      }
    );
  }

}
