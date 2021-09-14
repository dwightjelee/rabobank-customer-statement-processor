import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CsvDataInterface} from "../models/csv-data.interface";
import {Observable} from "rxjs";
import {TransactionInterface} from "../models/transaction.interface";

@Injectable({
    providedIn: 'root'
})
export class CsvParserService {
    constructor(private http: HttpClient) {}

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

    private getData(csvData: string[]): TransactionInterface[] {
        const properties = csvData[0].split(',');
        const cleanedData = csvData.filter((str) => {return str;});

        const result: TransactionInterface[] = [];

        for (const currentRow of cleanedData.splice(1)) {
            const rowData: TransactionInterface[] = currentRow
                .split('","')
                .map((value: string) => {

                    const obj: TransactionInterface = {
                        Reference: '',
                        "Account Number": '',
                        Description: '',
                        "Start Balance": '',
                        Mutation: '',
                        "End Balance": '',
                    };

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
