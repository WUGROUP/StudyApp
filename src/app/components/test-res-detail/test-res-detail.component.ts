import { Component, OnInit } from '@angular/core';
import { TestManagerService } from 'src/app/services/test-manager-service';
import { SummaryTestInfoDto } from 'src/app/dto/summary-test-info';
import { ContentInfo } from 'src/app/dto/content-Info';
import { TestInfo } from 'src/app/dto/test-info';
import { MatTableDataSource } from '@angular/material/table';
import { AppUtils } from 'src/app/utils/app-utils';

@Component({
  selector: 'app-test-res-detail',
  templateUrl: './test-res-detail.component.html',
  styleUrls: ['./test-res-detail.component.css'],
  providers: [TestManagerService]
})
export class TestResDetailComponent implements OnInit {

  constructor(private testManagerService: TestManagerService) { }

  public testedListInfos: SummaryTestInfoDto[] = null;

  public wordsInfos: MatTableDataSource<ContentInfo> = null;

  public displayedWordsColumns: string[] = ['content', 'content1', 'content2', 'answers'];

  public sentencesInfos: MatTableDataSource<ContentInfo> = null;

  public displayedSentenceColumns: string[] = ['sentence'];

  public selectInfos: MatTableDataSource<ContentInfo> = null;

  public displayedSelectColumns: string[] = ['select'];

  public selected = -1;

  ngOnInit() {
    this.testManagerService.getAllTestedInfos<SummaryTestInfoDto[]>().subscribe(
      (rows) => {
        this.testedListInfos = rows;
      },
      (error) => alert(error)
    );
  }

  onChange(v: number) {
    if (v > 0) {
      this.getAllTestedInfos(v);
    }
  }

  private getAllTestedInfos(idParam: number) {
    this.testManagerService.getAllTestedInfosById<{
      id: number,
      mainId: number,
      type: number,
      content: string,
      content1: string,
      content2: string,
      answer: string,
      createdDate: string
    }[]>({ id: idParam }).subscribe(
      (rows) => {
        const testedWordInfos = [];
        const testedSentenceInfos = new Array<ContentInfo>();
        const testedSelectInfos = new Array<ContentInfo>();
        let tempId: number;
        let cInfo: ContentInfo = null;
        for (let i = 0; i < rows.length; i++) {
          const item = rows[i];
          if (tempId !== item.id) {
            cInfo = new ContentInfo();
            if (item.type === 1) {
              testedWordInfos.push(cInfo);
            } else if (item.type === 2) {
              testedSentenceInfos.push(cInfo);
            } else {
              testedSelectInfos.push(cInfo);
            }
            tempId = item.id;
            cInfo.id = item.id;
            cInfo.content = item.content;
            if (cInfo.type === 3) {
              cInfo.selectItems = JSON.parse(item.content1);
            }
            cInfo.content1 = item.content1;
            cInfo.content2 = item.content2;
            cInfo.answers = new Array<TestInfo>();
          }
          const testInfo = new TestInfo();
          testInfo.answer = item.answer;
          testInfo.createdDate = item.createdDate;
          if (item.type === 1) {
            testInfo.res = AppUtils.checkWordIsOK(cInfo.content, testInfo.answer);
          } else if (item.type === 2) {
            testInfo.res = AppUtils.checkSentenceIsOK(cInfo.content, AppUtils.toTestList(testInfo.answer, false));
          } else {
            testInfo.res = AppUtils.checkSelectIsOK(JSON.parse(testInfo.answer));
          }
          cInfo.answers.push(testInfo);
        }
        this.wordsInfos = new MatTableDataSource<ContentInfo>(testedWordInfos);
        this.sentencesInfos = new MatTableDataSource<ContentInfo>(testedSentenceInfos);
        this.selectInfos = new MatTableDataSource<ContentInfo>(testedSelectInfos);
      },
      (error) => {
        alert(error);
      }
    );
  }
}
