import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SiteService } from '../../../../services/site.service';
import { NotificationService } from '../../../../services/notification.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { DeleteCommentDialogBoxComponent } from '../delete-comment-dialog-box/delete-comment-dialog-box.component';



@Component({
  selector: 'app-dialog-box3',
  templateUrl: './comments-dialog-box.component.html',
  styleUrls: ['./comments-dialog-box.component.css']
})
export class CommentsDialogBoxComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public IdTarea: number;
  public Equipo: string;
  public Tarea: string;
  public Fila;
  public verAdd = false;
  public Comments = [];
  public commentText = '';
  public isDataLoaded = false;



  constructor(public dialogRef: MatDialogRef<DeleteCommentDialogBoxComponent>, public dialog: MatDialog, private notif: NotificationService,
              // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data, private siteService: SiteService) {
      this.IdTarea = data.Id;
      this.Equipo = data.Equipo;
      this.Tarea =  data.Tarea;
      this.Fila = data.Fila;

  }




  ngOnInit(): void {
    this.blockUI.start('Cargando Roles...');
    this.siteService.getCommentsTarea(this.IdTarea).subscribe(
      comments => {
        this.blockUI.stop();
        this.Comments = comments;
        this.isDataLoaded = true;
      },
      () => {
        this.blockUI.stop();
      });
  }

  addComment(){
    this.verAdd = true;
  }

  saveComment(){
    this.blockUI.start('Guardando Comentario...');
    this.siteService.postCommentTarea(this.IdTarea, this.commentText).subscribe(
      comment => {
        this.Comments.push(comment);
        this.commentText = '';
        this.verAdd = false;
        this.Fila.CantComentarios ++;
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      });

  }


  deleteCommentDialog(Id, Comentario) {
    const dialogRef = this.dialog.open(DeleteCommentDialogBoxComponent, {
      width: '70%',
      data: {
        Id, Comentario
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.notif.clear();
      if (result){
        if (result.event === 'Delete'){
          this.deleteRowData(result.Id);
        }
      }

    });

  }


  closeDialog(){
    this.dialogRef.close({event: 'Cancel'});
  }



  deleteRowData(Id){
    console.log('Borrando ', Id);
    this.blockUI.start('Eliminando comentario...');
    this.siteService.deleteComentarioTarea(Id).subscribe(
      res => {
        this.Comments = this.Comments.filter((value, key) => {
          return value.ComentarioId !== Id;
        });
        this.Fila.CantComentarios --;
        this.blockUI.stop();
        this.notif.info(`El comentario de Id ${Id} se eliminó correctamente.`);
      },
      () => {
        this.blockUI.stop();
      }
    );
  }



}
