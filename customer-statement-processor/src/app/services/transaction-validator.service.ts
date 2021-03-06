import {Injectable} from "@angular/core";
import {TransactionInterface} from "../models/transaction.interface";
import {Observable, of} from "rxjs";
import {ValidationResultsInterface} from "../models/validation-results.interface";

@Injectable({
    providedIn: 'root'
})
export class TransactionValidatorService {

    /**
     * Takes an array of TransactionInterface and checks if there are no
     * duplicate references and if the end-balance is correctly calculated.
     * @param data
     * @returns Observable of ValidationResultsInterface
     */
    public validate(data: TransactionInterface[]): Observable<ValidationResultsInterface> {
        const lookupReference = data.reduce((a: {}, e: TransactionInterface) => {
            a[e.Reference] = ++a[e.Reference] || 0;
            return a;
        }, {});

        let incorrectMutations: TransactionInterface[] = [];
        const duplicateTransactions: TransactionInterface[] = data.filter(transaction => lookupReference[transaction.Reference]);
        const uniqueTransactions: TransactionInterface[] = data.filter(transaction => !lookupReference[transaction.Reference]);

        uniqueTransactions.forEach((transaction: TransactionInterface, index: number) => {
            const addOrSubstract = transaction.Mutation.substring(0, 1);
            const mutation = transaction.Mutation.substring(1, transaction.Mutation.length);

            let calculatedResult: string;
            switch (addOrSubstract) {
                case '-':
                    calculatedResult = (+transaction["Start Balance"] - +mutation).toFixed(2);
                    break;
                case '+':
                    calculatedResult = (+transaction["Start Balance"] + +mutation).toFixed(2);
                    break;
            }

            if (+calculatedResult !== +transaction["End Balance"]) {
                incorrectMutations.push(transaction);
                uniqueTransactions.splice(index, 1);
            }
        });

        return of({
            validTransactions: uniqueTransactions,
            duplicateTransactions: duplicateTransactions.length > 0 ? duplicateTransactions : null,
            incorrectMutations: incorrectMutations.length > 0 ? incorrectMutations : null
        });
    }
}
