import { Component, OnInit } from '@angular/core';
import { TestManagerService } from 'src/app/services/test-manager-service';
import { SummaryTestInfoDto } from 'src/app/dto/summary-test-info';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigManager } from 'src/app/utils/config-manager';
import { Router } from '@angular/router';
import { AppUtils } from 'src/app/utils/app-utils';

@Component({
  selector: 'app-test-result',
  templateUrl: './test-result.component.html',
  styleUrls: ['./test-result.component.css'],
  providers: [TestManagerService]
})
export class TestResultComponent implements OnInit {

  public displayedColumns: string[] = ['title', 'mainInfosTitle', 'mainInfosContentsCount', 'costTime', 'costedTime', 'score', 'action'];
  public testedListInfos: MatTableDataSource<SummaryTestInfoDto> = null;

  constructor(private router: Router, private testManagerService: TestManagerService) { }

  ngOnInit() {
    this.testManagerService.getAllTestedInfos<SummaryTestInfoDto[]>().subscribe(
      (rows) => {
        rows.forEach(
          (item: SummaryTestInfoDto) => {
            item.costTime = 0;
            item.mainInfos.forEach((mainInfo) => {
              item.costTime = item.costTime +
                AppUtils.getPerTime(mainInfo.type) * mainInfo.contentsCount;
            });
          }
        );
        this.testedListInfos = new MatTableDataSource<SummaryTestInfoDto>(rows);
      },
      (error) => alert(error)
    );
  }

  startTest(todoInfo: SummaryTestInfoDto) {
    this.router.navigate(['Test'], { queryParams: { id: todoInfo.id, costTime: todoInfo.costTime, title: todoInfo.title, flg: todoInfo.countTimeFlg } });
  }
}
