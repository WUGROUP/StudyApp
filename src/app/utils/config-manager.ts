import { HttpClient } from '@angular/common/http';
import { AppUtils } from './app-utils';

export class ConfigManager {

    private static cacheInfo = {};

    public static passKey = 'ManagerPassword';

    public static wordPerTimeKey = 'WordPerTime';

    public static sentencePerTimeKey = 'SentencePerTime';

    public static uslKey = 'ApiUrl';

    private static readonly configFilePath = 'assets/configs/SystemConfig.json';
    private constructor() {

    }

    /** get all config info from SystemConfig.json file */
    public static init(client: HttpClient) {
        return new Promise((resolve, reject) => {
            client.get(this.configFilePath).subscribe(
                (data) => {
                    this.cacheInfo = data;
                    resolve();
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    public static getValue<T>(key: string) {
        if (AppUtils.isNullorUndefined(key)) {
            return null;
        } else {
            return this.cacheInfo[key] as T;
        }
    }
}
