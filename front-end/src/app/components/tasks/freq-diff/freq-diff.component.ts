import { Component, OnInit, ViewChild } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { FreqDiffDialogBoxComponent } from './freq-diff-dialog-box/freq-diff-dialog-box.component';
import { NotificationService } from 'src/app/services/notification.service';


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
  public displayedColumns: string[] = ['PPM', 'Descr', 'Equipo', 'Frecuencia', 'FrecuenciaEAM', 'action'];


  constructor(private siteService: SiteService, public dialog: MatDialog, private notif: NotificationService) {
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
            TareaId: element.TareaId,
            PPM: element.PPM,
            Descr: element.Descr,
            Equipo: element.Equipo,
            EquipoDescr: element.EquipoDescr,
            Frecuencia: `${element.Frecuencia}  ${element.Periodo !== null ? this.periodMap[element.Periodo.trim()][element.Frecuencia > 1 ? 2 : 1] : ''}`,
            FrecuenciaEAM: `${element.FrecuenciaEAM}  ${element.PeriodoEAM !== null ? this.periodMap[element.PeriodoEAM.trim()][element.FrecuenciaEAM > 1 ? 2 : 1] : ''}`,
            FreqPSP: element.Frecuencia,
            PeriodoPSP: element.Periodo,
            FreqEAM: element.FrecuenciaEAM,
            PeriodoEAM: element.PeriodoEAM,
            TipoTareaId: element.TipoTareaId
          });

        });
        this.dataSource = new MatTableDataSource(table);
      },
      err => {
        this.blockUI.stop();
      }
    );
  }

  openDialog(obj) {
    const dialogRef = this.dialog.open(FreqDiffDialogBoxComponent, {
      width: '600px',
      data: {...obj},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.notif.clear();
      if (result){
        console.log(result);
        if (result.event === 'import'){
          const modif = {
            Id: result.data.TareaId,
            PPM: result.data.PPM,
            Descr: result.data.Descr,
            Frecuencia: result.data.FreqEAM,
            Periodo: result.data.PeriodoEAM,
            TipoTareaId: result.data.TipoTareaId,
            Equipo: result.data.Equipo
          };
          this.blockUI.start('Modificando Tarea...');
          this.siteService.putTarea(modif).subscribe(
            res => {
              console.log('res: ', res);
              const aux = this.dataSource.data.filter((value, key) => {
                return value.PPM === modif.PPM && value.Equipo === modif.Equipo;
              });
              aux[0].FreqPSP = aux[0].FreqEAM;
              aux[0].PeriodoPSP = aux[0].PeriodoEAM;
              aux[0].Frecuencia =aux[0].FrecuenciaEAM;
              console.log('aux: ',aux)
              this.blockUI.stop();
              this.notif.info('La Tarea se modificó correctamente.');

            },
            error => {
              this.blockUI.stop();
              console.log(error);
            }
          );
        }
      }
    });
  }

}
