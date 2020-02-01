import { ConfigManager } from './config-manager';
import { HttpHeaders } from '@angular/common/http';

export class AppUtils {


    public static isNullorUndefined(obj: any): boolean {
        return obj === null || obj === undefined;
    }

    /** check admin passsword */
    public static checkPass(value: string): boolean {
        return value === ConfigManager.getValue<string>(ConfigManager.passKey);
    }

    public static httpOptions = {
        responseType: 'json', headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }

    public static calScore(okWordCount: number, allWordCount: number, okSentenceCount: number, allSentenceCount: number) {
        const wcRatio = 5;
        const score = Math.round((100 / (allWordCount + allSentenceCount * wcRatio)) * (okWordCount + okSentenceCount * wcRatio));
        return score;
    }

}
