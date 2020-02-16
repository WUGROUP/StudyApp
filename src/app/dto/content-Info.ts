import { TestInfo } from './test-info';
import { SelectInfo } from './select-info';
export class ContentInfo {
    public id: number = null;
    public mainId: number = null;
    public bookId: number = null;
    public courseIndex: number = null;
    public content: string = null;
    public content1: string = null;
    public content2: string = null;
    public createdDate: string = null;
    public type: number = null;
    public answers: TestInfo[] = null;
    public selectItems = new Array<SelectInfo>();
}
