import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-create-title-dialog',
  templateUrl: './create-title-dialog.component.html',
  styleUrls: ['./create-title-dialog.component.css']
})
export class CreateTitleDialogComponent {
  constructor(public dialogRef: MatDialogRef<CreateTitleDialogComponent>) { }

  public title: string;
  public countTImeFlg = 0;

  onOkClick(): void {
    if (isNullOrUndefined(this.title)) {
      alert('名称を入力してください。');
    } else {
      this.dialogRef.close({ title: this.title, flg: this.countTImeFlg });
    }
  }
}
