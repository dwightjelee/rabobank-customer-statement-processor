import {Component, OnInit} from '@angular/core';
import {CsvParserService} from "./services/csv-parser.service";
import {CsvDataInterface} from "./models/csv-data.interface";
import {TransactionValidatorService} from "./services/transaction-validator.service";
import {TransactionInterface} from "./models/transaction.interface";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public title = 'customer-statement-processor';

    public headers!: string[];
    public validTransactions: TransactionInterface[];
    public duplicateTransactions: TransactionInterface[];
    public incorrectMutations: TransactionInterface[];

    constructor(
        private csvParserService: CsvParserService,
        private transactionValidatorService: TransactionValidatorService
    ) {}

    ngOnInit() {
        this.csvParserService.loadCsv().subscribe((csvData: string) => {
            const parsedData: CsvDataInterface = this.csvParserService.parseCsvData(csvData);
            this.headers = parsedData.headers;

            this.transactionValidatorService.validate(parsedData.data).subscribe((data) => {
                this.validTransactions = data.validTransactions;
                this.duplicateTransactions = data.duplicateTransActions;
                this.incorrectMutations = data.incorrectMutations;
            });
        });
    }
}
