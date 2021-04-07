import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

export interface ProfundData {
  Nombre: string;
  Id: number;
  Abreviacion: string;
}


@Component({
  selector: 'app-dialog-box',
  templateUrl: './profund-dialog-box.component.html',
  styleUrls: ['./profund-dialog-box.component.css']
})
export class ProfundDialogBoxComponent implements OnInit {

  action: string;
  localData: any;


  constructor(public dialogRef: MatDialogRef<ProfundDialogBoxComponent>,
    // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: ProfundData) {
      this.localData = {...data};
      this.action = this.localData.action;
    }




  ngOnInit(): void {

  }

  doAction(form: NgForm) {
    if (form.invalid) {
      return;
    }
    else{
      let servData ={
        Nombre : form.value.nombreServ,
        Id : 0
      }
      if(this.action != "Add"){
        servData.Id = this.localData.Id;
      }
      if(this.action == "Delete"){
        servData.Nombre = this.localData.Nombre;
      }
      this.dialogRef.close({event:this.action,data:servData});
    }


  }

  closeDialog(){
    this.dialogRef.close({event:'Cancel'});
  }

}
