import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { RolIterface } from 'src/app/models/RolInterface';
import { UserIterface } from 'src/app/models/UserInterface';


@Component({
  selector: 'app-dialog-box3',
  templateUrl: './users-dialog-box.component.html',
  styleUrls: ['./users-dialog-box.component.css']
})
export class UsersDialogBoxComponent implements OnInit {

  public action: string;
  public usuario: UserIterface;
  public roles: RolIterface[];


  constructor(public dialogRef: MatDialogRef<UsersDialogBoxComponent>,
    // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data) {
      const aux = {...data};
      this.usuario = aux.user;
      this.action = aux.action;
      this.roles = aux.rolesList;
  }




  ngOnInit(): void {
  }


  doAction(form: NgForm){
    if (form.invalid){
      return;
    }
    else{
     this.dialogRef.close({event: this.action, data: this.usuario});
    }


  }

  closeDialog(){
    this.dialogRef.close({event: 'Cancel'});
  }

}
