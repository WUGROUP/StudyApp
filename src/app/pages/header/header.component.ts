import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base-component';
import { SystemContext } from 'src/app/utils/system-context';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService, CounterType } from 'src/app/services/header-service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';
import { LoginDialogComponent } from 'src/app/components/login-dialog/login-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit {

  constructor(public dialog: MatDialog, private headerService: HeaderService, private router: Router) {
    super();
  }

  private interval: any = null;

  private timeLeft = 10;

  private showCounter = false;

  ngOnInit() {
    this.headerService.counterChange$.subscribe(
      (v: CounterType) => {
        if (v && v.startEndFlg) {
          this.interval = setInterval(() => {
            if (this.timeLeft > 0) {
              this.timeLeft--;
            } else {
              clearInterval(this.interval);
              this.interval = null;
              this.showCounter = false;
              this.headerService.timeOut = true;
            }
          }, 1000);
        } else {
          this.showCounter = false;
          if (!isNullOrUndefined(this.interval)) {
            clearInterval(this.interval);
            this.interval = null;
          }
        }
      }
    );
  }

  public loginButton() {
    const dialogRef = this.dialog.open(
      LoginDialogComponent,
      {
        width: '300px',
        disableClose: true
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        SystemContext.isManager = true;
        this.isManager = true;
      }
    });
  }

  public logoutButton() {
    SystemContext.isManager = false;
    this.isManager = false;
    this.router.navigate(['MainPage']);
  }

  public textBoxManager() {
    this.router.navigate(['TextBoxManager']);
  }

  public createTest() {
    this.router.navigate(['CreateTest']);
  }

  public testManager() {
    this.router.navigate(['TestManager']);
  }
}
