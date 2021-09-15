import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'readableBytesize',
})
export class ReadableBytesizePipe implements PipeTransform {

    /**
     * Transforms bytes to a string and converts bytes
     * to Bytes, KB, MB, GB accordingly
     * @param bytes
     * @returns string
     */
    transform(bytes: number): string {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (!!bytes) {
            const calculatedIndex = Math.floor(Math.log(bytes) / Math.log(1024));
            return Math.round(bytes / Math.pow(1024, calculatedIndex)) + ' ' + sizes[calculatedIndex];
        }

        return '0 KB';
    }
}
