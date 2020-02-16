import { Component, OnInit } from '@angular/core';
import { ContentInfo } from '../../dto/content-Info';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ContentInfoService } from 'src/app/services/content-info-service';
import { AppUtils } from 'src/app/utils/app-utils';
import { MainInfoService } from 'src/app/services/main-info-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sentence-course',
  templateUrl: './sentence-course.component.html',
  styleUrls: ['./sentence-course.component.css'],
  providers: [ContentInfoService, MainInfoService]
})
export class SentenceCourseComponent implements OnInit {

  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute, private contentInfoService: ContentInfoService, private mainInfoService: MainInfoService) { }

  public displayedColumns: string[] = ['sentence'];

  // public displayedColumns: string[] = ['select', 'id', 'content', 'content1', 'content2'];
  public contentInfos: MatTableDataSource<ContentInfo> = new MatTableDataSource<ContentInfo>();
  // public selection = new SelectionModel<ContentInfo>(true, []);

  public bookId = null;
  public textBoxName = null;
  public courseCount = null;

  public courseOptions = [];

  public selectedCourse = -1;

  public saveBtnDisableFlg = true;

  public noMainInfoFlg = false;

  public mainId = null;

  ngOnInit() {
    this.bookId = this.route.snapshot.queryParams.id;
    this.textBoxName = this.route.snapshot.queryParams.title;
    this.courseCount = this.route.snapshot.queryParams.courseCount;
    this.initOption();
  }

  onChange(v: number) {
    this.getContentInfos(v);
  }

  private getContentInfos(v: number) {
    const searchInfo = new ContentInfo();
    searchInfo.bookId = this.bookId;
    searchInfo.courseIndex = v;
    searchInfo.type = 2;
    this.contentInfoService.getContentInfoByBookInfo<ContentInfo[]>(searchInfo).subscribe(
      (res: ContentInfo[]) => {
        if (res.length === 0) {
          this.noMainInfoFlg = true;
        } else {
          this.noMainInfoFlg = false;
          this.mainId = res[0].mainId;
        }
        this.contentInfos = new MatTableDataSource<ContentInfo>(res);
      },
      (error) => {
        alert(error);
      }
    );
  }

  clear() {
    this.selectedCourse = -1;
    this.contentInfos = new MatTableDataSource<ContentInfo>();
    // this.selection.clear();
    this.saveBtnDisableFlg = true;
    this.mainId = null;
  }

  private initOption() {
    for (let i = 1; i <= this.courseCount; i++) {
      this.courseOptions.push(i);
    }
  }

  /** The label for the checkbox on the passed row */
  // checkboxLabel(row?: ContentInfo): string {
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  // }

  addRows() {
    const count = this.contentInfos.data.length;
    for (let i = 1; i <= 5; i++) {
      const info = new ContentInfo();
      info.bookId = this.bookId;
      info.courseIndex = this.selectedCourse;
      info.mainId = this.mainId;
      this.contentInfos.data.push(info);
    }
    this.contentInfos.filter = '';
    this.saveBtnDisableFlg = false;
  }

  save() {
    const allInfos = this.contentInfos.data.filter(
      (v) => {
        if (!AppUtils.isNullorUndefined(v.id) ||
          (AppUtils.isNullorUndefined(v.id) && !AppUtils.isNullorUndefined(v.content) && !AppUtils.isNullorUndefined(v.content1))) {
          return v;
        }
      }
    );

    this.contentInfoService.saveContentInfos({
      noMainInfoFlg: this.noMainInfoFlg,
      mainId: this.mainId,
      bookId: this.bookId,
      courseIndex: this.selectedCourse,
      type: 2,
      title: `${this.textBoxName}の第${this.selectedCourse}課の文テスト`,
      infos: allInfos
    }).subscribe(
      () => {
        this.getContentInfos(this.selectedCourse);
        this._snackBar.open('保存しました。', null, {
          duration: 2000,
        });
        return;
      },
      (error) => {
        this._snackBar.open('保存失敗しました。', 'エラー', {
          duration: 2000
        });
      }
    );

    // const saveList = this.contentInfos.data.filter(
    //   (v: ContentInfo) => !AppUtils.isNullorUndefined(v.content) && !AppUtils.isNullorUndefined(v.content1)
    // );

    // const deleteList = this.contentInfos.data.filter(
    //   (v: ContentInfo) => AppUtils.isNullorUndefined(v.content)
    //     && !AppUtils.isNullorUndefined(v.id)
    // );

    // if (this.noMainInfoFlg) {
    //   const mainInfo = new MainInfo();
    //   mainInfo.bookId = this.bookId;
    //   mainInfo.courseIndex = this.selectedCourse;
    //   mainInfo.type = 1;
    //   mainInfo.title =
    //     this.mainInfoService.insertMainInfo(mainInfo).subscribe(
    //       (infos: MainInfo[]) => {
    //         if (AppUtils.isNullorUndefined(infos) || infos.length === 0) {
    //           alert('保存失敗しました。');
    //         } else {
    //           this.mainId = infos[0].mainid;
    //           saveList.forEach(
    //             (saveInfo) => {
    //               saveInfo.mainid = this.mainId;
    //             }
    //           );
    //           this.contentInfoService.insertContentInfo(saveList).subscribe(
    //             () => {

    //             },
    //             (error) => {
    //               alert('保存失敗しました。');
    //             }
    //           );

    //         }
    //       },
    //       (error) => {
    //         alert('保存失敗しました。');
    //         alert(error);
    //       }
    //     );
    // }
  }
}
