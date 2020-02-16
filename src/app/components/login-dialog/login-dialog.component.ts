import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfigManager } from 'src/app/utils/config-manager';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>, private _snackBar: MatSnackBar) { }

  public password: string;

  onOkClick(): void {
    if (this.password === ConfigManager.getValue(ConfigManager.passKey)) {
      this.dialogRef.close(true);
    } else {
      this._snackBar.open('パスワードが間違いました。', null, {
        duration: 2000,
      });
    }
  }
  onCancelClick(): void {
    this.dialogRef.close(false);
  }

}
