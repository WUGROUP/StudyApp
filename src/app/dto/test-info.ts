import { SelectInfo } from './select-info';

export class TestInfo {
    public summaryId!: number;
    public mainId!: number;
    public title!: string;
    public mainTitle!: string;
    public type!: number;
    public contentId!: string;
    public content!: string;
    public content1!: string;
    public content2!: string;
    public answer!: string;
    public res!: number;
    public createdDate!: string;
    public selectItems = new Array<SelectInfo>();
}
