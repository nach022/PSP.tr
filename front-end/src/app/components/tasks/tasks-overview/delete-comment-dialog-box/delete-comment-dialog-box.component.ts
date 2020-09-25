import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

export interface CommentData {
  Coment: string;
  Id: number;
}


@Component({
  selector: 'app-delete-comment-dialog-box',
  templateUrl: './delete-comment-dialog-box.component.html',
  styleUrls: ['./delete-comment-dialog-box.component.css']
})
export class DeleteCommentDialogBoxComponent implements OnInit {

    localData: any;


  constructor(public dialogRef: MatDialogRef<DeleteCommentDialogBoxComponent>,
    // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data: CommentData) {
      this.localData = {...data};
    }




  ngOnInit(): void {

  }

  deleteComment(){
    this.dialogRef.close({event: 'Delete', Id: this.localData.Id});
  }





  closeDialog(){
    this.dialogRef.close({event: 'Cancel'});
  }

}
