import {createServiceFactory, SpectatorService} from "@ngneat/spectator";
import {XmlParserService} from "./xml-parser.service";
import {ParsedDataInterface} from "../models/parsed-data.interface";
import {TransactionInterface} from "../models/transaction.interface";

const mockXmlData: string = `
<records>
  <record reference="1">
    <accountNumber>NL01RABO1234567891</accountNumber>
    <description>Description 1</description>
    <startBalance>10</startBalance>
    <mutation>-1</mutation>
    <endBalance>9</endBalance>
  </record>
  <record reference="2">
    <accountNumber>NL01RABO1234567892</accountNumber>
    <description>Description 2</description>
    <startBalance>20</startBalance>
    <mutation>+2</mutation>
    <endBalance>22</endBalance>
  </record>
  <record reference="3">
    <accountNumber>NL01RABO1234567893</accountNumber>
    <description>Description 3</description>
    <startBalance>30</startBalance>
    <mutation>-3</mutation>
    <endBalance>27</endBalance>
  </record>
  </records>
`;

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
];

describe('XmlParserService', () => {
    let spectator: SpectatorService<XmlParserService>;
    const createService = createServiceFactory(XmlParserService);

    beforeEach(() => spectator = createService());

    it('should create', () => {
        expect(spectator.service).toBeTruthy();
    });

    describe('parseXmlData method', () => {
        it('should return an object containing headers and data', () => {
            const headerSpy = spyOn<any>(spectator.service, 'getHeaders').and.callThrough();
            const dataSpy = spyOn<any>(spectator.service, 'getData').and.callThrough();

            const parsedData: ParsedDataInterface = spectator.service.parseXmlData(mockXmlData);

            expect(headerSpy).toHaveBeenCalled();
            expect(dataSpy).toHaveBeenCalled();
            expect(parsedData.headers.length).toBe(6);
            expect(parsedData.data.length).toBe(3);

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
