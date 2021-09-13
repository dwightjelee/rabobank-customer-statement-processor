import {Component, OnInit} from '@angular/core';
import {CsvParserService} from "./services/csv-parser.service";
import {CsvDataInterface} from "./models/csv-data.interface";
import {XmlParserService} from "./services/xml-parser.service";

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
        private xmlParserService: XmlParserService,
    ) {}

    ngOnInit() {
        this.csvParserService.loadCsv().subscribe((csvData: string) => {
            const parsedData: CsvDataInterface = this.csvParserService.parseCsvData(csvData);
            this.datasource = parsedData.data;
            this.headers = parsedData.headers;
        });
    }
}
