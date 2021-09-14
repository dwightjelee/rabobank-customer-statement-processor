import {Injectable} from '@angular/core';
import {ParsedDataInterface} from "../models/parsed-data.interface";
import {TransactionInterface} from "../models/transaction.interface";

@Injectable({
    providedIn: 'root'
})
export class CsvParserService {
    constructor() {
    }

    public parseCsvData(data: string): ParsedDataInterface {
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
        const cleanedData = csvData.filter((str: string) => {
            return str;
        });

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
