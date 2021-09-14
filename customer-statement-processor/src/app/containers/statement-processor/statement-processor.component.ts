import {Component, OnInit} from '@angular/core';
import {TransactionInterface} from "../../models/transaction.interface";
import {CsvParserService} from "../../services/csv-parser.service";
import {XmlParserService} from "../../services/xml-parser.service";
import {TransactionValidatorService} from "../../services/transaction-validator.service";
import {UploadedFile} from "../../models/uploaded-file.interface";
import {CsvDataInterface} from "../../models/csv-data.interface";
import {ValidationResultsInterface} from "../../models/validation-results.interface";
import {ReportInterface} from "../../models/report.interface";

@Component({
    selector: 'statement-processor',
    templateUrl: 'statement-processor.component.html'
})

export class StatementProcessorComponent implements OnInit {
    public reports: ReportInterface[] = [];

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
                    this.generateReport(this.csvParserService.parseCsvData(fileReader.result as string), file.name);
                }

                if(file.type === 'xml') {
                    this.xmlParserService.parseXmlData(fileReader.result as string).subscribe(result => console.log(result));
                }
                // console.log(fileReader.result);
            }
            fileReader.readAsText(file.file);
        })
    }

    private generateReport(parsedData: CsvDataInterface, fileName: string) {
        this.transactionValidatorService.validate(parsedData.data).subscribe((data: ValidationResultsInterface) => {
            this.reports.push({
                fileName,
                headers: parsedData.headers,
                data
            });
        });
    }
}
