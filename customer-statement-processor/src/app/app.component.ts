import {Component, OnInit} from '@angular/core';
import {CsvParserService} from "./services/csv-parser.service";
import {CsvDataInterface} from "./models/csv-data.interface";
import {XmlParserService} from "./services/xml-parser.service";
import {TransactionValidatorService} from "./services/transaction-validator.service";
import {TransactionInterface} from "./models/transaction.interface";
import {UploadedFile} from "./models/uploaded-file.interface";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public title = 'customer-statement-processor';

    public headers: string[];
    public validTransactions: TransactionInterface[];
    public duplicateTransactions: TransactionInterface[];
    public incorrectMutations: TransactionInterface[];

    constructor(
        private csvParserService: CsvParserService,
        private xmlParserService: XmlParserService,
        private transactionValidatorService: TransactionValidatorService,
    ) {}

    ngOnInit() {
        // this.csvParserService.loadCsv().subscribe((csvData: string) => {
        //     const parsedData: CsvDataInterface = this.csvParserService.parseCsvData(csvData);
        //     this.headers = parsedData.headers;
        //
        //     this.transactionValidatorService.validate(parsedData.data).subscribe((data) => {
        //         this.validTransactions = data.validTransactions;
        //         this.duplicateTransactions = data.duplicateTransActions;
        //         this.incorrectMutations = data.incorrectMutations;
        //     });
        // });

        // this.xmlParserService.loadXml().subscribe(data => this.xmlParserService.parseXmlData(data).subscribe(result => console.log(result.records.record)));
    }

    public onSubmitUploadFiles(uploadedFiles: UploadedFile[]) {
        console.log('uploaded: ', uploadedFiles);
        uploadedFiles.forEach((file: UploadedFile) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                if(file.type === 'csv') {
                    this.generateReport(this.csvParserService.parseCsvData(fileReader.result as string));
                }

                if(file.type === 'xml') {
                    this.xmlParserService.parseXmlData(fileReader.result as string).subscribe(result => console.log(result));
                }
                // console.log(fileReader.result);
            }
            fileReader.readAsText(file.file);
        })
    }

    private generateReport(parsedData: CsvDataInterface) {
        this.headers = parsedData.headers;

        this.transactionValidatorService.validate(parsedData.data).subscribe((data) => {
            this.validTransactions = data.validTransactions;
            this.duplicateTransactions = data.duplicateTransActions;
            this.incorrectMutations = data.incorrectMutations;
        });
    }
}
