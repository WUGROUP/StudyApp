import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContentInfo } from 'src/app/dto/content-Info';
import { SelectInfo } from 'src/app/dto/select-info';
import { isNullOrUndefined } from 'util';
import { AppUtils } from 'src/app/utils/app-utils';
import { ContentInfoService } from 'src/app/services/content-info-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-select-course',
  templateUrl: './select-course.component.html',
  styleUrls: ['./select-course.component.css'],
  providers: [ContentInfoService]
})
export class SelectCourseComponent implements OnInit {

  public bookId = null;
  public textBoxName = null;
  public courseCount = null;
  public courseOptions = [];
  public selectedCourse = -1;
  public saveBtnDisableFlg = true;

  public noMainInfoFlg = false;

  public mainId = null;

  public contentInfos = new Array<ContentInfo>();

  constructor(
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private contentInfoService: ContentInfoService) { }

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
    searchInfo.type = 3;
    this.contentInfoService.getContentInfoByBookInfo<ContentInfo[]>(searchInfo).subscribe(
      (res: ContentInfo[]) => {
        if (res.length === 0) {
          this.noMainInfoFlg = true;
        } else {
          this.noMainInfoFlg = false;
          this.mainId = res[0].mainId;
          res.forEach(
            (info: ContentInfo) => {
              info.selectItems = JSON.parse(info.content1);
            }
          );
        }
        this.contentInfos = res;
        this.saveBtnDisableFlg = false;
      },
      (error) => {
        alert(error);
      }
    );
  }

  private initOption() {
    for (let i = 1; i <= this.courseCount; i++) {
      this.courseOptions.push(i);
    }
  }

  clear() {
    this.selectedCourse = -1;
    this.contentInfos = new Array<ContentInfo>();
    this.saveBtnDisableFlg = true;
  }

  addRows() {
    for (let j = 1; j <= 4; j++) {
      const content = new ContentInfo();
      for (let i = 1; i <= 4; i++) {
        const selectItem = new SelectInfo();
        content.selectItems.push(selectItem);
      }
      this.contentInfos.push(content);
    }
    this.saveBtnDisableFlg = false;
  }
  addSelect(content: ContentInfo) {
    const selectItem = new SelectInfo();
    content.selectItems.push(selectItem);
  }

  save() {
    // 整形
    const itemLength = this.contentInfos.length;
    for (let i = itemLength - 1; i >= 0; i--) {
      const contentInfo = this.contentInfos[i];
      if (AppUtils.isNullOrSpace(contentInfo.content)) {
        this.contentInfos.pop();
      } else {
        if (isNullOrUndefined(contentInfo.selectItems)) {
          this.contentInfos.pop();
        } else {
          for (let j = contentInfo.selectItems.length - 1; j >= 0; j--) {
            const selectContent = contentInfo.selectItems[j];
            if (AppUtils.isNullOrSpace(selectContent.content)) {
              contentInfo.selectItems.splice(j, 1);
            }
          }
          if (contentInfo.selectItems.length === 0) {
            this.contentInfos.pop();
          }
        }
      }
    }

    if (this.contentInfos.length === 0) {
      this._snackBar.open('保存内容がありません。', null, {
        duration: 2000,
      });
      this.getContentInfos(this.selectedCourse);
      return;
    }

    // 保存処理
    this.contentInfoService.saveContentInfos({
      noMainInfoFlg: this.noMainInfoFlg,
      mainId: this.mainId,
      bookId: this.bookId,
      courseIndex: this.selectedCourse,
      type: 3,
      title: `${this.textBoxName}の第${this.selectedCourse}課の選択型テスト`,
      infos: this.contentInfos
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
  }
}
