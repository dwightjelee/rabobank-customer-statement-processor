import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {parseStringPromise} from "xml2js";

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

    public parseXmlData(data: string): Observable<any> {
        return from(parseStringPromise(data)) as Observable<any>;

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
