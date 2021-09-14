import {ValidationResultsInterface} from "./validation-results.interface";

export interface ReportInterface {
    fileName: string;
    headers: string[];
    data: ValidationResultsInterface;
}
