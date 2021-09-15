import {createComponentFactory, Spectator} from "@ngneat/spectator";
import {ValidationReportComponent} from "./validation-report.component";
import {MockComponent} from "ng-mocks";
import {DataTableComponent} from "../data-table/data-table.component";
import {ValidationResultsInterface} from "../../models/validation-results.interface";
import {TransactionInterface} from "../../models/transaction.interface";

describe('ValidationReportComponent', () => {
    let spectator: Spectator<ValidationReportComponent>;
    const createComponent = createComponentFactory({
        component: ValidationReportComponent,
        declarations: [MockComponent(DataTableComponent)],
    });

    beforeEach(() => spectator = createComponent({
        props: {
            validatedData: {
                fileName: 'test.csv',
                headers: ['Reference', 'Account Number', 'Description', 'Start Balance', 'Mutation', 'End Balance'],
                data: {
                    validTransactions: [
                        {
                            Reference: '1',
                            'Account Number': 'NL00RABO1234567891',
                            Description: 'Desc1',
                            'Start Balance': '10',
                            Mutation: '-1',
                            'End Balance': '9'
                        },
                    ],
                    duplicateTransactions: [],
                    incorrectMutations: [],
                }
            }
        },
    }));

    it('should create', () => {
        expect(spectator.component).toBeTruthy();
    });
});
