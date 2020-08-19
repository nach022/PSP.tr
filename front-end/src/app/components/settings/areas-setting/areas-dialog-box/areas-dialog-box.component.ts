import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

export interface AreaData {
  Nombre: string;
  Id: number;
}


@Component({
  selector: 'app-dialog-box',
  templateUrl: './areas-dialog-box.component.html',
  styleUrls: ['./areas-dialog-box.component.css']
})
export class AreasDialogBoxComponent implements OnInit {

  action:string;
  local_data:any;


  constructor(public dialogRef: MatDialogRef<AreasDialogBoxComponent>,
    //@Optional() is used to prevent error if no data is passed
    @Optional() @Inject(MAT_DIALOG_DATA) public data: AreaData) {
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
      let servData ={
        Nombre : form.value.nombreServ,
        Id : 0
      }
      if(this.action != "Add"){
        servData.Id = this.local_data.Id;
      }
      if(this.action == "Delete"){
        servData.Nombre = this.local_data.Nombre;
      }
      this.dialogRef.close({event:this.action,data:servData});
    }


  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
