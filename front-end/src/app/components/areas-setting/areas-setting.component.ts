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

  constructor(public dialog: MatDialog, private _siteService: SiteService, private _notif: NotificationService) { }
  @BlockUI() _blockUI: NgBlockUI;
  public isDataLoaded: boolean = false;


  openDialog(action,obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(AreasDialogBoxComponent, {
      width: '600px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this._notif.clear();
      if(result){
        if(result.event == 'Add'){
          this.addRowData(result.data);
        }else if(result.event == 'Update'){
          this.updateRowData(result.data);
        }else if(result.event == 'Delete'){
          this.deleteRowData(result.data);
        }

      }

    });
  }

  addRowData(row_obj){
    this._blockUI.start('Creando Grupo de Acción...');
    this._siteService.postServicioEjecutor(row_obj).subscribe(
      res=>{
        this.dataSource.push(res);
        this.table.renderRows();
        this._blockUI.stop();
        this._notif.info('El Grupo de Acción se creó correctamente.');

      },
      error =>{
        this._blockUI.stop();
      }
    );
  }

  updateRowData(row_obj){
    this._blockUI.start('Modificando Grupo de Acción...');
    this._siteService.putServicioEjecutor(row_obj).subscribe(
      res=>{
        this.dataSource = this.dataSource.filter((value,key)=>{
          if(value.Id == row_obj.Id){
            value.Nombre = row_obj.Nombre;
          }
          return true;
        });
        this._blockUI.stop();
        this._notif.info('El Grupo de Acción se modificó correctamente.');

      },
      error =>{
        this._blockUI.stop();
      }
    );
  }


  deleteRowData(row_obj){
    this._blockUI.start('Eliminando Grupo de Acción...');
    this._siteService.deleteServicioEjecutor(row_obj).subscribe(
      res => {
        this.dataSource = this.dataSource.filter((value,key)=>{
          return value.Id != row_obj.Id;
        });
        this._blockUI.stop();
        this._notif.info(`El Grupo de Acción ${row_obj.Nombre} se eliminó correctamente.`);
      },
      error =>{
        this._blockUI.stop();
      }
    );
  }



  ngOnInit(): void {


    this._blockUI.start('Cargando Grupo de Acción...');
    this._siteService.getServiciosEjecutores().subscribe(
      res => {
        this._blockUI.stop();
        this.dataSource = res;
        this.isDataLoaded = true;
      },
      err => {
        this._blockUI.stop();
      }
    )

  }

}
