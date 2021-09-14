import {TransactionInterface} from "./transaction.interface";

export interface ParsedDataInterface {
    headers: string[];
    data: TransactionInterface[];
}
