import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import * as xml2js from 'xml2js';

@Injectable({
    providedIn: 'root'
})
export class XmlParserService {
    constructor(private http: HttpClient) {
    }

    public loadXml(): Observable<string> {
        return this.http.get('/assets/data/records.xml',
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'text/xml')
                    .append('Access-Control-Allow-Methods', 'GET'),
                responseType: 'text'
            });
    }

    public parseXmlData(data: string): any {
        let key: string | number;
        let arr = [];
        const parser = new xml2js.Parser();
        // const temp = new xml2js.Parser({});
        // const xml2js = require('xml2js');

        parser.parseString(data, function (err: any, result: any) {
            if(err) console.log(err);
            console.log(result);
        });

        // const parser = new xml2js.parseString(data, (err: any, result: JSON) => {
        //     console.log(result);
        //
        //     // for (key in obj.emp) {
        //     //     var item = obj.emp[k];
        //     //     arr.push({
        //     //         id: item.id[0],
        //     //         name: item.name[0],
        //     //         gender: item.gender[0],
        //     //         mobile: item.mobile[0]
        //     //     });
        //     // }
        // });
    }
}
