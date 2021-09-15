import {createServiceFactory, SpectatorService} from "@ngneat/spectator";
import {TransactionValidatorService} from "./transaction-validator.service";
import {TransactionInterface} from "../models/transaction.interface";
import {ValidationResultsInterface} from "../models/validation-results.interface";

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
        Reference: '2',
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
        Mutation: '+4',
        'End Balance': '46',
    },
];

describe('TransactionValidatorService', () => {
    let spectator: SpectatorService<TransactionValidatorService>;
    const createService = createServiceFactory(TransactionValidatorService);

    beforeEach(() => spectator = createService());

    it('should create', () => {
        expect(spectator.service).toBeTruthy();
    });

    describe('validate method', () => {
        it('should return validated values', () => {
            spectator.service.validate(mockXmlDataResult).subscribe((result: ValidationResultsInterface) => {
                expect(result.validTransactions.length).toBe(1);
                expect(result.duplicateTransactions.length).toBe(2);
                expect(result.incorrectMutations.length).toBe(1);

                expect(result.validTransactions).toEqual([mockXmlDataResult[0]]);
                expect(result.duplicateTransactions).toEqual([mockXmlDataResult[1], mockXmlDataResult[2]]);
                expect(result.incorrectMutations).toEqual([mockXmlDataResult[3]]);
            });
        });
    });
});
