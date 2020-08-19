import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-dialog-box3',
  templateUrl: './tasks-dialog-box.component.html',
  styleUrls: ['./tasks-dialog-box.component.css']
})
export class TasksDialogBoxComponent implements OnInit {

  public action:string;
  public local_data:any;


  constructor(public dialogRef: MatDialogRef<TasksDialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) {
      this.local_data = {...data};
      this.action = this.local_data.action;

    }




  ngOnInit(): void {
  }

  doAction(form: NgForm){
    if(form.invalid){
      return;
    }
    else{

     let tarea ={
        Id: this.local_data.Id,
        PPM: this.local_data.PPM,
        Descr: this.local_data.Descr,
        Equipo: this.local_data.Equipo,
        EquipoDescr: this.local_data.EquipoDescr,
        TipoTareaId: this.local_data.TipoTareaId,
        Frecuencia: this.local_data.Frecuencia,
        Periodo: this.local_data.Periodo,
        PeriodoMap: this.local_data.PeriodoMap
      }
      this.dialogRef.close({event:this.action,data:tarea});
    }


  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
