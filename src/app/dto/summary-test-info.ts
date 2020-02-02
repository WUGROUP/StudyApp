import { MainInfo } from "./main-info";

export class SummaryTestInfoDto {
    public id!: number;
    public mainInfos!: MainInfo[];
    public title!: string;
    public score!: number;
    public costTime!: number;
    public costedTime!: number;
    public createdDate!: string;
}
