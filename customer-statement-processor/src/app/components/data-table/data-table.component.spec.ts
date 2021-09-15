import {byTestId, createComponentFactory, Spectator} from "@ngneat/spectator";
import {DataTableComponent} from "./data-table.component";
import {MatTableModule} from "@angular/material/table";

describe('DataTableComponent', () => {
    let spectator: Spectator<DataTableComponent>;
    const createComponent = createComponentFactory({
        component: DataTableComponent,
        imports: [MatTableModule]
    });

    beforeEach(() => spectator = createComponent({
        props: {
            displayedColumns: ['Reference','Account Number','Description','Start Balance','Mutation','End Balance'],
            datasource: [
                {
                    Reference: '1',
                    'Account Number': 'NL00RABO1234567891',
                    Description: 'Desc1',
                    'Start Balance': '10',
                    Mutation: '-1',
                    'End Balance': '9'
                },
                {
                    Reference: '2',
                    'Account Number': 'NL00RABO1234567892',
                    Description: 'Desc2',
                    'Start Balance': '20',
                    Mutation: '-1',
                    'End Balance': '19'
                },
            ]
        }
    }));

    it('should create', () => {
        const dataheaders = spectator.queryAll(byTestId('dataheader'));
        const datarows = spectator.queryAll(byTestId('datarow'));

        expect(spectator.component).toBeTruthy();
        expect(dataheaders.length).toBe(6);
        expect(datarows.length).toBe(2);
    });
});
