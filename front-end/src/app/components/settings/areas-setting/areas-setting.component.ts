import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AreasDialogBoxComponent } from './areas-dialog-box/areas-dialog-box.component';
import { SiteService } from 'src/app/services/site.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotificationService } from 'src/app/services/notification.service';



export interface AreaData {
  Nombre: string;
  Id: number;
}


@Component({
  selector: 'app-areas-setting',
  templateUrl: './areas-setting.component.html',
  styleUrls: ['./areas-setting.component.css']
})
export class AreasSettingComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource = [];

  @ViewChild(MatTable) table: MatTable<any>;

  constructor(public dialog: MatDialog, private siteService: SiteService, private notif: NotificationService) { }
  @BlockUI() blockUI: NgBlockUI;
  public isDataLoaded = false;


  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(AreasDialogBoxComponent, {
      width: '600px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.notif.clear();
      if (result){
        if (result.event === 'Add'){
          this.addRowData(result.data);
        }else if (result.event === 'Update'){
          this.updateRowData(result.data);
        }else if (result.event === 'Delete'){
          this.deleteRowData(result.data);
        }

      }

    });
  }

  addRowData(row){
    this.blockUI.start('Creando Grupo de Acción...');
    this.siteService.postServicioEjecutor(row).subscribe(
      res => {
        this.dataSource.push(res);
        this.table.renderRows();
        this.blockUI.stop();
        this.notif.info('El Grupo de Acción se creó correctamente.');

      },
      error => {
        this.blockUI.stop();
      }
    );
  }

  updateRowData(row){
    this.blockUI.start('Modificando Grupo de Acción...');
    this.siteService.putServicioEjecutor(row).subscribe(
      res => {
        this.dataSource = this.dataSource.filter((value, key) => {
          if (value.Id === row.Id){
            value.Nombre = row.Nombre;
          }
          return true;
        });
        this.blockUI.stop();
        this.notif.info('El Grupo de Acción se modificó correctamente.');

      },
      error => {
        this.blockUI.stop();
      }
    );
  }


  deleteRowData(row){
    this.blockUI.start('Eliminando Grupo de Acción...');
    this.siteService.deleteServicioEjecutor(row).subscribe(
      res => {
        this.dataSource = this.dataSource.filter((value, key) => {
          return value.Id !== row.Id;
        });
        this.blockUI.stop();
        this.notif.info(`El Grupo de Acción ${row.Nombre} se eliminó correctamente.`);
      },
      error => {
        this.blockUI.stop();
      }
    );
  }



  ngOnInit(): void {


    this.blockUI.start('Cargando Grupo de Acción...');
    this.siteService.getServiciosEjecutores().subscribe(
      res => {
        this.blockUI.stop();
        this.dataSource = res;
        this.isDataLoaded = true;
      },
      err => {
        this.blockUI.stop();
      }
    );

  }

}
