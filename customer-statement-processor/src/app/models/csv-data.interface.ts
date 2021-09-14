import {TransactionInterface} from "./transaction.interface";

export interface CsvDataInterface {
    headers: string[];
    data: TransactionInterface[];
}
