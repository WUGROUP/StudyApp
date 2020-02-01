import { Component, OnInit } from '@angular/core';
import { TestManagerService } from 'src/app/services/test-manager-service';
import { SummaryTestInfoDto } from 'src/app/dto/summary-test-info';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigManager } from 'src/app/utils/config-manager';
import { Router } from '@angular/router';

@Component({
  selector: 'app-todo-test',
  templateUrl: './todo-test.component.html',
  styleUrls: ['./todo-test.component.css'],
  providers: [TestManagerService]
})
export class TodoTestComponent implements OnInit {

  public displayedColumns: string[] = ['title', 'mainInfosTitle', 'mainInfosContentsCount', 'costTime', 'action'];
  public todoListInfos: MatTableDataSource<SummaryTestInfoDto> = null;

  constructor(private router: Router, private testManagerService: TestManagerService) { }

  ngOnInit() {
    this.testManagerService.getAllTodoTestInfos<SummaryTestInfoDto[]>().subscribe(
      (rows) => {
        rows.forEach(
          (item: SummaryTestInfoDto) => {
            item.costTime = 0;
            item.mainInfos.forEach((mainInfo) => {
              item.costTime = item.costTime +
                (mainInfo.type === 1 ?
                  mainInfo.contentsCount * ConfigManager.getValue<number>(ConfigManager.wordPerTimeKey)
                  : mainInfo.contentsCount * ConfigManager.getValue<number>(ConfigManager.sentencePerTimeKey));
            });
          }
        );
        this.todoListInfos = new MatTableDataSource<SummaryTestInfoDto>(rows);
      },
      (error) => alert(error)
    );
  }

  startTest(todoInfo: SummaryTestInfoDto) {
    this.router.navigate(['Test'], { queryParams: { id: todoInfo.id, costTime: todoInfo.costTime, title: todoInfo.title } });
  }
}
