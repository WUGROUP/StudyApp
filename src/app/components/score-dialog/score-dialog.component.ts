import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-score-dialog',
  templateUrl: './score-dialog.component.html',
  styleUrls: ['./score-dialog.component.css']
})
export class ScoreDialogComponent implements OnInit {

  public res: ScoreDialogParamObj = null;

  constructor(public dialogRef: MatDialogRef<ScoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public param: ScoreDialogParamObj) {
    this.res = param;
  }

  ngOnInit() {
  }

  // public challenge() {
  //   this.dialogRef.close(true);
  // }

  // public finish() {
  //   this.dialogRef.close(false);
  // }
}

export class ScoreDialogParamObj {
  okWordCount: number;
  okSentenceCount: number;
  allWordCount: number;
  allSentenceCount: number;
  score: number;
}
