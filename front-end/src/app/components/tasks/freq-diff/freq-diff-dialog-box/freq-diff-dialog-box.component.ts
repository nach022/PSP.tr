import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'freq-diff-dialog-box',
  templateUrl: './freq-diff-dialog-box.component.html',
  styleUrls: ['./freq-diff-dialog-box.component.css']
})
export class FreqDiffDialogBoxComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<FreqDiffDialogBoxComponent>,
    // @Optional() is used to prevent error if no data is passed
              @Optional() @Inject(MAT_DIALOG_DATA) public data) {
  }




  ngOnInit(): void {
  }


  doAction(){
     this.dialogRef.close({event: 'import', data: this.data});
  }

  closeDialog(){
    this.dialogRef.close({event: 'Cancel'});
  }

}
