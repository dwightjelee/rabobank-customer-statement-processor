import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TransactionValidatorService {
    public validate(data: object[]) {
        console.log('validate: ', data);

        const failedTransactions: object[] = [];

        for (const transaction of data) {

        }
    }
}
