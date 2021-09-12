import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CsvDataInterface} from "../models/csv-data.interface";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CsvParserService {
    constructor(private http: HttpClient) {
    }

    public loadCsv(): Observable<string> {
        return this.http.get('/assets/data/records.csv',
            {
                headers: new HttpHeaders()
                    .set('Content-Type', 'text/csv')
                    .append('Access-Control-Allow-Methods', 'GET'),
                responseType: 'text'
            });
    }

    public parseCsvData(data: string): CsvDataInterface {
        const splittedData = data.split(/\r\n|\n/);

        return {
            headers: this.getHeaders(splittedData),
            data: this.getData(splittedData)
        };
    }

    private getHeaders(csvData: string[]): string[] {
        return csvData[0].split(',');
    }

    private getData(csvData: string[]): object[] {
        const properties = csvData[0].split(',');
        const result: object[] = [];

        for (const currentRow of csvData.splice(1)) {
            const rowData = currentRow
                .split('","')
                .map((value) => {
                    const obj: {[key: string]: string} = {};

                    for (const [index, header] of properties.entries()) {
                        obj[header] = value.split(',')[index]
                    }

                    return obj;
                });
            result.push(rowData[0]);
        }
        return result;
    }

}
