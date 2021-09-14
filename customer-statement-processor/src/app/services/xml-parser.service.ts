import {Injectable} from "@angular/core";
import {parseString} from "xml2js";
import {ParsedDataInterface} from "../models/parsed-data.interface";
import {TransactionInterface} from "../models/transaction.interface";

@Injectable({
    providedIn: 'root'
})
export class XmlParserService {
    constructor() {
    }

    public parseXmlData(data: string): ParsedDataInterface {
        let mappedData: ParsedDataInterface;

        parseString(data, (err: Error, result: string) => {
            mappedData = {
                headers: this.getHeaders(result),
                data: this.getData(result),
            }
        });

        return mappedData;
    }

    private getHeaders(data): string[] {
        let headers: string[] = [];

        const firstHeader = Object.keys(data.records.record[0].$)[0];
        headers.push(firstHeader.charAt(0).toUpperCase() + firstHeader.substring(1, firstHeader.length));

        const keys = Object.keys(data.records.record[0]);

        for (let i = 1; i < keys.length; i++) {
            const words = keys[i].split(/(?=[A-Z])/).join(" ");
            let transformedHeader = words.charAt(0).toUpperCase() + words.substring(1, words.length);

            headers.push(transformedHeader);
        }

        return headers;
    }

    private getData(data): TransactionInterface[] {
        const result: TransactionInterface[] = [];
        const rows = data.records.record;

        for (const currentRow of rows) {
            const transaction: TransactionInterface = {
                Reference: currentRow.$.reference,
                "Account Number": currentRow.accountNumber[0],
                Description: currentRow.description[0],
                "Start Balance": currentRow.startBalance[0],
                Mutation: currentRow.mutation[0],
                "End Balance": currentRow.endBalance[0],
            }

            result.push(transaction);
        }

        return result;
    }
}
