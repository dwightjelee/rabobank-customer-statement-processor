import {TransactionInterface} from "./transaction.interface";

export interface ValidationResultsInterface {
    validTransactions: TransactionInterface[];
    duplicateTransactions: TransactionInterface[];
    incorrectMutations: TransactionInterface[];
}
