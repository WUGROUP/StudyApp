import { BaseService } from './base-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TestInfo } from '../dto/test-info';

export class TestManagerService extends BaseService {
    constructor(public httpClient: HttpClient) {
        super(httpClient);
    }
    public selectTestInfos<T>(id: number): Observable<T> {
        return this.httpClient.post<T>(this.ApiUrl + `/TestManager?ACTION=SELECT_ALL`, { bookId: id },
            { responseType: 'json', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
    }

    public saveTestInfo<T>(testTitle: string, testMainIds: number[]) {
        return this.httpClient.post<T>(this.ApiUrl + `/TestManager?ACTION=INSERT`, { title: testTitle, mainIds: testMainIds },
            { responseType: 'json', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
    }

    public getAllTodoTestInfos<T>() {
        return this.httpClient.post<T>(this.ApiUrl + `/TestManager?ACTION=TODO_LIST`, null,
            { responseType: 'json', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
    }

    public getAllTestInfosById<T>(id: { summaryId: number }) {
        return this.httpClient.post<T>(this.ApiUrl + `/TestManager?ACTION=TEST_LIST`, id,
            { responseType: 'json', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
    }

    public saveTestRes(testRes: { score: number; costTime: number; res: TestInfo[] }) {
        return this.httpClient.post(this.ApiUrl + `/TestManager?ACTION=SAVE_TEST`, testRes,
            { responseType: 'json', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
    }

    public getAllTestedInfos<T>() {
        return this.httpClient.post<T>(this.ApiUrl + `/TestManager?ACTION=TESTED_LIST`, null,
            { responseType: 'json', headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
    }
}

