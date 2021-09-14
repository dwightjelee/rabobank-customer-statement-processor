import {Injectable} from "@angular/core";
import {TransactionInterface} from "../models/transaction.interface";
import {Observable, of} from "rxjs";

export interface returntypes {
    validTransactions: TransactionInterface[];
    duplicateTransActions: TransactionInterface[];
    incorrectMutations: TransactionInterface[];
}

@Injectable({
    providedIn: 'root'
})
export class TransactionValidatorService {
    public validate(data: TransactionInterface[]): Observable<returntypes> {
        const lookupReference = data.reduce((a, e) => {
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
            duplicateTransActions: duplicateTransactions,
            incorrectMutations: incorrectMutations.length > 0 ? incorrectMutations : null
        });
    }
}
