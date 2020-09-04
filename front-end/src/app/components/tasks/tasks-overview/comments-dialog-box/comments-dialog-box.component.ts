import { Component, OnInit, Inject, Optional, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { RolIterface } from 'src/app/models/RolInterface';
import { UserIterface } from 'src/app/models/UserInterface';
import { SiteService } from 'src/app/services/site.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';


@Component({
  selector: 'app-dialog-box3',
  templateUrl: './comments-dialog-box.component.html',
  styleUrls: ['./comments-dialog-box.component.css']
})
export class CommentsDialogBoxComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('newComment') private newComment: ElementRef;
  public IdTarea: number;
  public Equipo: string;
  public Tarea: string;
  public verAdd = false;


  constructor(public dialogRef: MatDialogRef<CommentsDialogBoxComponent>,
    // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data, private siteService: SiteService) {
      this.IdTarea = data.Id;
      this.Equipo = data.Equipo;
      this.Tarea =  data.Tarea;
  }




  ngOnInit(): void {
    this.blockUI.start('Cargando Roles...');
    this.siteService.getCommentsTarea(this.IdTarea).subscribe(
      comments => {
        this.blockUI.stop();
        console.log(comments);
      },
      error => {
        this.blockUI.stop();
      });
  }

  addComment(){
    this.verAdd = true;
  }

 /* doAction(form: NgForm){
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
*/
}
