import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'data-table',
    templateUrl: 'data-table.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DataTableComponent {
    @Input()
    datasource: any;

    @Input()
    displayedColumns: string[];

    constructor() {
    }
}
