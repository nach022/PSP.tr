import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-dialog-box2',
  templateUrl: './task-types-dialog-box.component.html',
  styleUrls: ['./task-types-dialog-box.component.css']
})
export class TaskTypesDialogBoxComponent implements OnInit {

  action:string;
  area: number;
  local_data:any;


  constructor(public dialogRef: MatDialogRef<TaskTypesDialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data) {
      this.local_data = {...data};
      this.action = this.local_data.action;
      this.area = this.local_data.Responsable;
    }




  ngOnInit(): void {

  }

  doAction(form: NgForm){
    if(form.invalid){
      return;
    }
    else{
      let tipoData ={
        Nombre : form.value.nombreTipo,
        Id : 0,
        Responsable: this.area
      }
      if(this.action != "Add"){
        tipoData.Id = this.local_data.Id;
      }
      if(this.action == "Delete"){
        tipoData.Nombre = this.local_data.Nombre;
      }
      this.dialogRef.close({event:this.action,data:tipoData});
    }


  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
