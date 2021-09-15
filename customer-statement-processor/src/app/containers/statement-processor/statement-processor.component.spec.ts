import {createComponentFactory, Spectator} from "@ngneat/spectator";
import {StatementProcessorComponent} from "./statement-processor.component";
import {UploadedFile} from "../../models/uploaded-file.interface";
import {CsvParserService} from "../../services/csv-parser.service";
import {MockComponents, MockProvider} from "ng-mocks";
import {UploadComponent} from "../../components/upload/upload.component";
import {ValidationReportComponent} from "../../components/validation-report/validation-report.component";
import {TransactionValidatorService} from "../../services/transaction-validator.service";
import {of} from "rxjs";
import {ParsedDataInterface} from "../../models/parsed-data.interface";
import {XmlParserService} from "../../services/xml-parser.service";

let csvBlob = new Blob(["aaa,bbb,ccc"], {type: 'text/csv'});
csvBlob["lastModifiedDate"] = "";
csvBlob["name"] = "file1";

let xmlBlob = new Blob(["aaa,bbb,ccc"], {type: 'text/xml'});
xmlBlob["lastModifiedDate"] = "";
xmlBlob["name"] = "file2";

const mockFiles: UploadedFile[] = [
    {
        name: 'file1.csv',
        relativePath: '/file1.csv',
        size: 784,
        type: 'csv',
        allowedSize: true,
        file: csvBlob as File,
    },
    {
        name: 'file2.xml',
        relativePath: '/file2.xml',
        size: 784,
        type: 'xml',
        allowedSize: true,
        file: xmlBlob as File,
    }
];

const mockParsedData: ParsedDataInterface = {
    headers: ['Reference', 'Account Number', 'Description', 'Start Balance', 'Mutation', 'End Balance'],
    data: [
        {
            Reference: '1',
            'Account Number': 'NL00RABO1234567891',
            Description: 'Desc1',
            'Start Balance': '10',
            Mutation: '-1',
            'End Balance': '9'
        },
        {
            Reference: '2',
            'Account Number': 'NL00RABO1234567892',
            Description: 'Desc2',
            'Start Balance': '20',
            Mutation: '+1',
            'End Balance': '21'
        },
    ]
}

describe('StatementProcessorComponent', () => {
    let spectator: Spectator<StatementProcessorComponent>;
    const createComponent = createComponentFactory({
        component: StatementProcessorComponent,
        providers: [
            MockProvider(
                CsvParserService,
                {parseCsvData: (data: string) => mockParsedData}
            ),
            MockProvider(
                XmlParserService,
                {parseXmlData: (data: string) => mockParsedData}
            ),
            MockProvider(
                TransactionValidatorService,
                {
                    validate: () => of({
                        validTransactions: [],
                        duplicateTransactions: [],
                        incorrectMutations: []
                    })
                }
            )
        ],
        declarations: [
            ...MockComponents(
                UploadComponent,
                ValidationReportComponent
            )
        ]
    });

    beforeEach(() => spectator = createComponent());

    it('should create', () => {
        expect(spectator.component).toBeTruthy();
    });

    describe('onSubmitUploadFiles method', () => {
        it('should loop trough provide files and generate reports based on file-type', () => {
            const generateReportSpy = spyOn<any>(spectator.component, 'generateReport').and.callThrough();

            let mockFileReader = {
                result: '',
                readAsText: (blobInput) => {
                    console.log('readAsDataURL');
                },
                onload: () => {
                    console.log('onload');
                }
            };

            spyOn<any>(window, 'FileReader').and.returnValue(mockFileReader);
            spyOn<any>(mockFileReader, 'readAsText').and.callFake((blobInput) => {
                mockFileReader.result = '';
                mockFileReader.onload();
            });

            spectator.component.onSubmitUploadFiles(mockFiles);

            expect(generateReportSpy).toHaveBeenCalledTimes(2);
            expect(generateReportSpy).toHaveBeenCalledWith(mockParsedData, 'file1.csv');
            expect(generateReportSpy).toHaveBeenCalledWith(mockParsedData, 'file2.xml');

            expect(spectator.component.reports.length).toBe(2);
        });
    });
});
