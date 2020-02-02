import { Component, OnInit } from '@angular/core';
import { TextBookInfosService } from 'src/app/services/textbox-info-service';
import { TextBoxInfo } from 'src/app/dto/text-box';
import { TestManagerService } from 'src/app/services/test-manager-service';
import { MainInfo } from 'src/app/dto/main-info';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { isNullOrUndefined } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { ComfirmDialogComponent } from '../comfirm-dialog/comfirm-dialog.component';
import { CreateTitleDialogComponent } from '../create-title-dialog/create-title-dialog.component';


@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css'],
  providers: [TextBookInfosService, TestManagerService]
})
export class CreateTestComponent implements OnInit {

  constructor(private textBookInfoService: TextBookInfosService, private testManager: TestManagerService, public dialog: MatDialog) { }

  public textBooks: TextBoxInfo[] = null;

  public selectedBookId = -1;

  public displayedColumns: string[] = ['select', 'title', 'courseIndex', 'type', 'contentsCount'];
  public testInfos: MatTableDataSource<MainInfo> = null;
  public selection = new SelectionModel<MainInfo>(true, []);

  public createBtnDisabled = true;

  ngOnInit() {
    this.textBookInfoService.getTextBookInfos().subscribe(
      (textbookInfos: TextBoxInfo[]) => {
        this.textBooks = textbookInfos;
      },
      (error) => {
        alert(error);
      }
    );
  }

  onChange(v: number) {
    this.testManager.selectTestInfos(v).subscribe(
      (rows: MainInfo[]) => {
        if (isNullOrUndefined(rows) || rows.length === 0) {
          this.createBtnDisabled = true;
          alert('試験内容が未設定です。教材管理画面から設定してください。');
        } else {
          this.createBtnDisabled = false;
        }
        this.testInfos = new MatTableDataSource<MainInfo>(rows);
      },
      (error) => {
        alert(error);
      }
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.testInfos.data.length;
    return numSelected === numRows;
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: MainInfo): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  clear() {
    this.selectedBookId = -1;
    this.testInfos = null;
    this.createBtnDisabled = true;
  }

  createTest() {
    if (this.selection.selected.length === 0) {
      alert('1行以上を選択してください。');
    } else {
      // tslint:disable-next-line: no-use-before-declare
      const dialogRef = this.dialog.open(ComfirmDialogComponent, {
        width: '600px',
        disableClose: true,
        data: { message: `選択された行(${this.selection.selected.length}行)で新しい試験を作成してもよろしいでしょうか？` }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.inputTitle();
        }
      });
    }
  }

  private inputTitle() {
    const dialogRef = this.dialog.open(CreateTitleDialogComponent, {
      width: '400px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveTestInfo(result);
      }
    });
  }

  private saveTestInfo(title: string) {
    const createTagMainIds = [];
    this.selection.selected.forEach((mainInfo: MainInfo) => {
      createTagMainIds.push(mainInfo.id);
    });
    this.testManager.saveTestInfo(title, createTagMainIds).subscribe(
      () => {
        this.selection.clear();
        alert('保存しました。');
      },
      (error) => alert(error)
    );
  }
}

