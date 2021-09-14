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

    public onSubmitUploadFiles(uploadedFiles: UploadedFile[]) {
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

    private generateReport(parsedData: ParsedDataInterface, fileName: string) {
        this.transactionValidatorService.validate(parsedData.data).pipe(take(1)).subscribe((data: ValidationResultsInterface) => {
            this.reports.push({
                fileName,
                headers: parsedData.headers,
                data
            });
        });
    }
}
