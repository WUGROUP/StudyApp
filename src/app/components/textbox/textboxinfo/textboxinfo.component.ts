import { Component, OnInit, Inject } from '@angular/core';
import { TextBookInfosService } from 'src/app/services/textbox-info-service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TextBoxInfo } from 'src/app/dto/text-box';
import { BaseComponent } from 'src/app/pages/base-component';
import { Router } from '@angular/router';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { ComfirmDialogComponent } from '../../comfirm-dialog/comfirm-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-textboxinfo',
  templateUrl: './textboxinfo.component.html',
  styleUrls: ['./textboxinfo.component.css'],
  providers: [TextBookInfosService]
})
export class TextboxinfoComponent extends BaseComponent implements OnInit {

  constructor(private textBooxInfoService: TextBookInfosService, private router: Router, public dialog: MatDialog) { super(); }

  public displayedColumns: string[] = ['select', 'id', 'title', 'courseCount', 'action'];
  public textBooxInfos: MatTableDataSource<TextBoxInfo> = null;
  public selection = new SelectionModel<TextBoxInfo>(true, []);

  ngOnInit() {
    this.getAllInfos();
  }

  private getAllInfos() {
    this.textBooxInfoService.getTextBookInfos().subscribe(
      (infos: TextBoxInfo[]) => {
        this.textBooxInfos = new MatTableDataSource<TextBoxInfo>(infos);
        this.selection.clear();
      }
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.textBooxInfos.data.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: TextBoxInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  new() {
    // tslint:disable-next-line: no-use-before-declare
    const dialogRef = this.dialog.open(TextInfoDialog, {
      width: '600px',
      disableClose: true,
      data: { flag: 'N' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result) {
        this.getAllInfos();
      }
    });
  }

  delete() {
    if (this.selection.selected.length === 0) {
      alert('1行以上を選択してください。');
    } else {
      // tslint:disable-next-line: no-use-before-declare
      const dialogRef = this.dialog.open(ComfirmDialogComponent, {
        width: '600px',
        disableClose: true,
        data: { message: '選択された行を削除してもよろしいでしょうか？' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const deleteTag = [];
          this.selection.selected.forEach((textBoxInfo: TextBoxInfo) => {
            deleteTag.push(textBoxInfo.id);
          });
          this.textBooxInfoService.deleteTextBox(deleteTag).subscribe(
            () => {
              this.getAllInfos();
            },
            (error) => {
              alert(error);
            }
          );
        }
      });
    }
  }

  update() {
    if (this.selection.selected.length > 1) {
      alert('2行以上選択しないでください。');
    } else if (this.selection.selected.length === 0) {
      alert('1行を選択してください。');
    } else {
      // tslint:disable-next-line: no-use-before-declare
      const dialogRef = this.dialog.open(TextInfoDialog, {
        width: '600px',
        disableClose: true,
        data: { flag: 'U', textBoxInfo: this.selection.selected[0] }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        if (result) {
          this.getAllInfos();
        }
      });
    }
  }

  setWordCourse(info: TextBoxInfo) {
    this.router.navigate(['WordCourse'], { queryParams: { id: info.id, title: info.title, courseCount: info.courseCount } });
  }

  setSentenceCourse(info: TextBoxInfo) {
    this.router.navigate(['SentenceCourse'], { queryParams: { id: info.id, title: info.title, courseCount: info.courseCount } });
  }
}


@Component({
  // tslint:disable-next-line: component-selector
  selector: 'textinfo-dialog',
  templateUrl: './textinfo-dialog.html',
  styleUrls: ['./textinfo-dialog.css'],
  providers: [TextBookInfosService]
})
// tslint:disable-next-line: component-class-suffix
export class TextInfoDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TextInfoDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData,
    private textBooxInfoService: TextBookInfosService,
    private fb: FormBuilder) {
    if (data.textBoxInfo) {
      this.info = data.textBoxInfo;
    }
  }


  // 各フォームコントロールを取得するGetter
  get title(): AbstractControl {
    return this.editForm.get('title');
  }
  get courseCount(): AbstractControl {
    return this.editForm.get('courseCount');
  }

  public info: TextBoxInfo = new TextBoxInfo();

  // FormGroup
  editForm: FormGroup;

  ngOnInit(): void {
    if (this.data.flag === 'N') {
      this.editForm = this.fb.group({
        title: ['', [Validators.required]],
        courseCount: ['', [Validators.required, Validators.min(1)]]
      });
    } else {
      this.editForm = this.fb.group({
        title: [this.info.title, [Validators.required]],
        courseCount: [this.info.courseCount, [Validators.required, Validators.min(1), Validators.max(30)]]
      });
    }
  }

  onOkClick(): void {
    this.info.title = this.title.value;
    this.info.courseCount = this.courseCount.value;
    switch (this.data.flag) {
      case 'N':
        this.createTextBox(this.info).subscribe((res) => {
          this.dialogRef.close(res);
        });
        return;
      case 'U':
        this.updateTextBox(this.info).subscribe((res) => {
          this.dialogRef.close(res);
        });
        return;
      default:
        return;
    }
  }

  private createTextBox(textBoxInfo: TextBoxInfo) {
    return new Observable((observer) => {
      this.textBooxInfoService.createTextBox(textBoxInfo).subscribe(
        (res) => {
          if (res['result'] === 'OK') {
            observer.next(true);
            return true;
          } else {
            observer.next(false);
            return false;
          }
        },
        (error) => {
          alert(error);
          observer.next(false);
          return false;
        }
      );
    });
  }

  private updateTextBox(textBoxInfo: TextBoxInfo) {
    return new Observable((observer) => {
      this.textBooxInfoService.updateTextBox(textBoxInfo).subscribe(
        (res) => {
          if (res['result'] === 'OK') {
            observer.next(true);
            return true;
          } else {
            observer.next(false);
            return false;
          }
        },
        (error) => {
          alert(error);
          observer.next(false);
          return false;
        }
      );
    });
  }
}

export interface DialogData {
  flag: string;
  textBoxInfo: TextBoxInfo;
}
