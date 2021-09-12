import {CsvParserService} from "./csv-parser.service";
import {createHttpFactory, HttpMethod, SpectatorHttp} from "@ngneat/spectator";
import {CsvDataInterface} from "../models/csv-data.interface";

const mockCsvData: string = `Reference,Account Number,Description,Start Balance,Mutation,End Balance
        1,NL01RABO1234567891,Description1,10,-1,9
        2,NL01RABO1234567892,Description2,20,+2,22
        3,NL01RABO1234567893,Description1,30,-3,27
        4,NL01RABO1234567894,Description1,40,-4,36`;

describe('CsvParserService', () => {
    let spectator: SpectatorHttp<CsvParserService>;
    const createService = createHttpFactory(CsvParserService);

    beforeEach(() => spectator = createService());

    it('should create', () => {
        expect(spectator.service).toBeTruthy();
    });

    describe('loadCsv method', () => {
        it('load CSV-file and return data as an object', () => {
            spectator.service.loadCsv().subscribe();
            spectator.expectOne('/assets/data/records.csv', HttpMethod.GET);
        });
    });

    describe('parseCsvData method', () =>{
        it('should return an object containing headers and data', () => {
            const headerSpy = spyOn<any>(spectator.service, 'getHeaders').and.callThrough();
            const dataSpy = spyOn<any>(spectator.service, 'getData').and.callThrough();

            const parsedData: CsvDataInterface = spectator.service.parseCsvData(mockCsvData);
            expect(headerSpy).toHaveBeenCalled();
            expect(dataSpy).toHaveBeenCalled();
            expect(parsedData.headers.length).toBe(6) ;
            expect(parsedData.data.length).toBe(4);
        });
    });
});
