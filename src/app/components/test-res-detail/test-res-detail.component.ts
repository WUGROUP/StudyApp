import { Component, OnInit } from '@angular/core';
import { TestManagerService } from 'src/app/services/test-manager-service';
import { SummaryTestInfoDto } from 'src/app/dto/summary-test-info';

@Component({
  selector: 'app-test-res-detail',
  templateUrl: './test-res-detail.component.html',
  styleUrls: ['./test-res-detail.component.css'],
  providers: [TestManagerService]
})
export class TestResDetailComponent implements OnInit {

  constructor(private testManagerService: TestManagerService) { }

  public testedListInfos: SummaryTestInfoDto[] = null;

  public selected = -1;

  ngOnInit() {
    this.testManagerService.getAllTestedInfos<SummaryTestInfoDto[]>().subscribe(
      (rows) => {
        this.testedListInfos = rows;
      },
      (error) => alert(error)
    );
  }

}
