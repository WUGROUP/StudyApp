import { ConfigManager } from './config-manager';
import { HttpHeaders } from '@angular/common/http';
import { SelectInfo } from '../dto/select-info';

export class AppUtils {


    public static isNullorUndefined(obj: any): boolean {
        return obj === null || obj === undefined;
    }

    public static isNullOrSpace(obj: any): boolean {
        return obj === null || obj === undefined || obj === '';
    }

    /** check admin passsword */
    public static checkPass(value: string): boolean {
        return value === ConfigManager.getValue<string>(ConfigManager.passKey);
    }

    public static httpOptions = {
        responseType: 'json', headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    public static calScore(okWordCount: number, allWordCount: number, okSentenceCount: number, allSentenceCount: number, okSelectCount: number, allSelectCount: number) {
        const wcRatio = 1;
        const score = Math.round((100 / (allWordCount + allSelectCount + allSentenceCount * wcRatio)) * (okWordCount + okSelectCount + okSentenceCount * wcRatio));
        return score;
    }

    public static toCheckString(checkStr: string) {
        return Array.from(checkStr).filter((item) => {
            return item.match(/^[A-Za-z0-9']*$/);
        }).join('');
    }

    public static checkWordIsOK(checkStr: string, answer: string): number {
        if (this.isNullorUndefined(answer) || this.isNullorUndefined(checkStr)) {
            return 1;
        }
        if (this.toCheckString(checkStr.toLowerCase()) === this.toCheckString(answer.toLowerCase())) {
            return 0;
        } else {
            return 2;
        }
    }

    public static toTestList(checkStr: string, randomFLg?: boolean) {
        if (!this.isNullorUndefined(checkStr)) {
            let tmpStr = checkStr.replace(/　/g, ' ');
            const lastChar = tmpStr.charAt(tmpStr.length - 1);
            let isLastHas = false;
            if (lastChar === '.' || lastChar === '?' || lastChar === '。' || lastChar === '!' || lastChar === '！') {
                isLastHas = true;
            }
            if (isLastHas) {
                tmpStr = tmpStr.substr(0, tmpStr.length - 1);
            }
            tmpStr = Array.from(tmpStr).filter((item) => {
                return item.match(/^[A-Za-z0-9 ',!。?.]*$/);
            }).join('');

            const tmpList = tmpStr.split(' ');
            console.log(`before : ${tmpList}`);
            if (randomFLg) {
                for (let i = tmpList.length - 1; i > 0; i--) {
                    const r = Math.floor(Math.random() * (i + 1));
                    const tmp = tmpList[i];
                    tmpList[i] = tmpList[r];
                    tmpList[r] = tmp;
                }
            }
            if (isLastHas) {
                tmpList.push(lastChar);
            }
            console.log(`after : ${tmpList}`);
            return tmpList;
        } else {
            return [];
        }
    }

    public static checkSentenceIsOK(contentStr: string, answer: string[]): number {
        if (this.isNullorUndefined(answer) || this.isNullorUndefined(contentStr)) {
            return 1;
        }
        const checkList = this.toTestList(contentStr, false);
        if (answer.join('') === checkList.join('')) {
            return 0;
        } else {
            return 2;
        }
    }

    public static getPerTime(type: number): number {
        if (type === 1) {
            return Number.parseInt(ConfigManager.getValue<string>(ConfigManager.wordPerTimeKey), 10);
        } else if (type === 2) {
            return Number.parseInt(ConfigManager.getValue<string>(ConfigManager.sentencePerTimeKey), 10);
        } else {
            return Number.parseInt(ConfigManager.getValue<string>(ConfigManager.selectPerTimeKey), 10);
        }
    }

    public static checkSelectIsOK(selectItem: SelectInfo[]): number {
        let isAllRight = true;
        let isAllFalse = true;

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < selectItem.length; i++) {
            const item = selectItem[i];
            if (item.answer !== item.isAnswer) {
                isAllRight = false;
            }
            if (item.answer) {
                isAllFalse = false;
            }
        }

        if (isAllFalse) {
            return 1;
        }
        if (isAllRight) {
            return 0;
        } else {
            return 2;
        }
    }
}
