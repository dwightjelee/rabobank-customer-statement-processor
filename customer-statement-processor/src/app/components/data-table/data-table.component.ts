import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TransactionInterface} from "../../models/transaction.interface";

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DataTableComponent {
    @Input()
    datasource: TransactionInterface[];

    @Input()
    displayedColumns: string[];

    constructor() {
    }
}
