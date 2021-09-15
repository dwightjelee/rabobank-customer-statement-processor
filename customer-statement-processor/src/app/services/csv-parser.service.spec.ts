import {CsvParserService} from "./csv-parser.service";
import {createServiceFactory, SpectatorService} from "@ngneat/spectator";
import {ParsedDataInterface} from "../models/parsed-data.interface";
import {TransactionInterface} from "../models/transaction.interface";

const mockCsvData: string = `Reference,Account Number,Description,Start Balance,Mutation,End Balance
1,NL01RABO1234567891,Description 1,10,-1,9
2,NL01RABO1234567892,Description 2,20,+2,22
3,NL01RABO1234567893,Description 3,30,-3,27
4,NL01RABO1234567894,Description 4,40,-4,36`;

const mockXmlDataResult: TransactionInterface[] = [
    {
        Reference: '1',
        'Account Number': 'NL01RABO1234567891',
        Description: 'Description 1',
        'Start Balance': '10',
        Mutation: '-1',
        'End Balance': '9',
    },
    {
        Reference: '2',
        'Account Number': 'NL01RABO1234567892',
        Description: 'Description 2',
        'Start Balance': '20',
        Mutation: '+2',
        'End Balance': '22',
    },
    {
        Reference: '3',
        'Account Number': 'NL01RABO1234567893',
        Description: 'Description 3',
        'Start Balance': '30',
        Mutation: '-3',
        'End Balance': '27',
    },
    {
        Reference: '4',
        'Account Number': 'NL01RABO1234567894',
        Description: 'Description 4',
        'Start Balance': '40',
        Mutation: '-4',
        'End Balance': '36',
    },
];

describe('CsvParserService', () => {
    let spectator: SpectatorService<CsvParserService>;
    const createService = createServiceFactory(CsvParserService);

    beforeEach(() => spectator = createService());

    it('should create', () => {
        expect(spectator.service).toBeTruthy();
    });

    describe('parseCsvData method', () => {
        it('should return an object containing headers and data', () => {
            const headerSpy = spyOn<any>(spectator.service, 'getHeaders').and.callThrough();
            const dataSpy = spyOn<any>(spectator.service, 'getData').and.callThrough();

            const parsedData: ParsedDataInterface = spectator.service.parseCsvData(mockCsvData);
            expect(headerSpy).toHaveBeenCalled();
            expect(dataSpy).toHaveBeenCalled();
            expect(parsedData.headers.length).toBe(6);
            expect(parsedData.data.length).toBe(4);

            expect(parsedData.headers).toEqual([
                'Reference',
                'Account Number',
                'Description',
                'Start Balance',
                'Mutation',
                'End Balance'
            ]);

            expect(parsedData.data).toEqual(mockXmlDataResult);
        });
    });
});
