import {Component} from '@angular/core';
import {CsvParserService} from "../../services/csv-parser.service";
import {XmlParserService} from "../../services/xml-parser.service";
import {TransactionValidatorService} from "../../services/transaction-validator.service";
import {UploadedFile} from "../../models/uploaded-file.interface";
import {ParsedDataInterface} from "../../models/parsed-data.interface";
import {ValidationResultsInterface} from "../../models/validation-results.interface";
import {ReportInterface} from "../../models/report.interface";
import {take} from "rxjs/operators";

@Component({
    selector: 'statement-processor',
    templateUrl: 'statement-processor.component.html',
})

export class StatementProcessorComponent {
    public reports: ReportInterface[] = [];

    constructor(
        private csvParserService: CsvParserService,
        private xmlParserService: XmlParserService,
        private transactionValidatorService: TransactionValidatorService,
    ) {
    }

    /**
     * Takes uploaded files and read it's contents,
     * sends it to generateReport
     * @param uploadedFiles
     */
    public onSubmitUploadFiles(uploadedFiles: UploadedFile[]): void {
        uploadedFiles.forEach((file: UploadedFile) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                if (file.type === 'csv') {
                    this.generateReport(this.csvParserService.parseCsvData(fileReader.result as string), file.name);
                }

                if (file.type === 'xml') {
                    this.generateReport(this.xmlParserService.parseXmlData(fileReader.result as string), file.name);
                }
            }
            fileReader.readAsText(file.file);
        })
    }

    /**
     * Takes parsed data and filename,
     * calls TransactionValidatorService to validate the data
     * and shows reports
     * @param parsedData
     * @param fileName
     * @private
     */
    private generateReport(parsedData: ParsedDataInterface, fileName: string): void {
        this.transactionValidatorService.validate(parsedData.data).pipe(take(1)).subscribe((data: ValidationResultsInterface) => {
            this.reports.push({
                fileName,
                headers: parsedData.headers,
                data
            });
        });
    }
}
