import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestManagerService } from 'src/app/services/test-manager-service';
import { TestInfo } from 'src/app/dto/test-info';
import { ConfigManager } from 'src/app/utils/config-manager';
import { isNullOrUndefined } from 'util';
import { AppUtils } from 'src/app/utils/app-utils';
import { MatDialog } from '@angular/material/dialog';
import { ScoreDialogComponent } from '../score-dialog/score-dialog.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [TestManagerService]
})
export class TestComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private testManagerService: TestManagerService,
    public dialog: MatDialog,
    private router: Router) { }

  private testId: number = null;
  public costTime: number = null;
  public title: string = null;
  public testedWordCount = 0;
  public allWordCount = 0;
  public testedSentenceCount = 0;
  public allSentenceCount = 0;
  private testInfo: TestInfo[] = null;
  private interval: any = null;
  private currentTest: TestInfo = null;
  public currentIndex = -1;
  public allContentCount = -1;
  public isTesting = true;
  public costedTime = 0;
  public okWordCount = 0;
  public okSentenceCount = 0;
  public processBarValue = 0;
  public checkRes = null;
  public planCostTime = 0;

  ngOnInit() {
    this.testId = this.route.snapshot.queryParams.id as number;
    this.title = this.route.snapshot.queryParams.title as string;
    this.getTestInfos();
  }


  private getTestInfos() {
    this.testManagerService.getAllTestInfosById<TestInfo[]>({ summaryId: this.testId }).subscribe(
      (rows) => {
        this.costTime = this.route.snapshot.queryParams.costTime as number;
        this.planCostTime = this.route.snapshot.queryParams.costTime as number;
        this.costedTime = 0;
        this.okWordCount = 0;
        this.allWordCount = 0;
        this.allSentenceCount = 0;
        this.okSentenceCount = 0;
        this.isTesting = true;
        this.currentIndex = -1;
        this.testInfo = rows;
        this.currentTest = null;
        this.allContentCount = this.testInfo.length;
        this.processBarValue = 0;
        this.checkRes = null;
        this.setAllInfo();
        this.next();
      },
      error => {
        alert(error);
      }
    );
  }

  private setAllInfo() {
    this.testInfo.forEach(
      (info) => {
        info.answer = null;
        info.res = null;
        if (info.type === 1) {
          this.allWordCount = this.allWordCount + 1;
        } else {
          this.allSentenceCount = this.allSentenceCount + 1;
        }
      }
    );
  }

  public next() {
    if (this.currentIndex !== -1 && this.currentIndex < this.allContentCount - 1) {
      this.check(true);
    } else if (this.currentIndex === this.allContentCount - 1) {
      clearInterval(this.interval);
      this.isTesting = false;
      const res = AppUtils.calScore(this.okWordCount, this.allWordCount, this.okSentenceCount, this.allSentenceCount);
      this.saveTestRes(res);
      return;
    }
    this.currentIndex = this.currentIndex + 1;
    this.currentTest = this.testInfo[this.currentIndex];
    this.checkRes = null;
    this.processBarValue = 0;
    if (this.currentTest.type === 1) {
      this.testedWordCount = this.testedWordCount + 1;
    } else {
      this.testedSentenceCount = this.testedSentenceCount + 1;
    }
    this.setTimmer(this.currentTest.type === 1 ?
      ConfigManager.getValue<number>(ConfigManager.wordPerTimeKey) :
      ConfigManager.getValue<number>(ConfigManager.sentencePerTimeKey));
  }

  public check(inCount?: boolean) {
    if (isNullOrUndefined(this.currentTest.answer)) {
      this.currentTest.res = 1;
    } else if (this.currentTest.content.toLowerCase() === this.currentTest.answer.toLowerCase()) {
      if (inCount) {
        if (this.currentTest.type === 1) {
          this.okWordCount = this.okWordCount + 1;
        } else {
          this.okSentenceCount = this.okSentenceCount + 1;
        }
      }
      this.currentTest.res = 0;
    } else {
      this.currentTest.res = 2;
    }
    if (this.currentTest.res === 0) {
      this.checkRes = '⭕';
    } else {
      this.checkRes = '❌';
    }
  }

  public setTimmer(t: number) {
    if (this.interval) {
      clearInterval(this.interval);
    }
    let counter = t as number;
    this.interval = setInterval(() => {
      if (counter > 0) {
        counter--;
        if (this.costTime > 0) {
          this.costTime = this.costTime - 1;
          this.costedTime = this.costedTime + 1;
          this.processBarValue = ((t - counter) / t) * 100;
        }
      } else {
        clearInterval(this.interval);
        this.interval = null;
        if (this.isTesting) {
          this.next();
        }
      }
    }, 1000);
  }

  private finish(res: number) {
    const dialogRef = this.dialog.open(ScoreDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        okWordCount: this.okWordCount,
        okSentenceCount: this.okSentenceCount,
        allWordCount: this.allWordCount,
        allSentenceCount: this.allSentenceCount,
        score: res
      }
    }

    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTestInfos();
      } else {
        this.router.navigate(['MainPage']);
      }
    });
  }

  private saveTestRes(res: number) {
    this.testManagerService.saveTestRes({ score: res, costTime: this.costedTime, res: this.testInfo }).subscribe(
      () => {
        this.finish(res);
      },
      error => alert(error)
    );
  }
}