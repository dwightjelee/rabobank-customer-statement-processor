import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ReportInterface} from "../../models/report.interface";

@Component({
    selector: 'validation-report',
    templateUrl: 'validation-report.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ValidationReportComponent {
    @Input()
    validatedData: ReportInterface;
}
