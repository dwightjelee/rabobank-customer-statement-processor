import {Component, OnInit} from '@angular/core';
import {CsvParserService} from "./services/csv-parser.service";
import {CsvDataInterface} from "./models/csv-data.interface";
import {TransactionValidatorService} from "./services/transaction-validator.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public title = 'customer-statement-processor';
    public datasource: any | undefined;
    public headers!: string[];

    constructor(
        private csvParserService: CsvParserService,
        private transactionValidatorService: TransactionValidatorService
    ) {}

    ngOnInit() {
        this.csvParserService.loadCsv().subscribe((csvData: string) => {
            const parsedData: CsvDataInterface = this.csvParserService.parseCsvData(csvData);
            this.datasource = parsedData.data;
            this.headers = parsedData.headers;

            this.transactionValidatorService.validate(parsedData.data);
        });
    }
}
