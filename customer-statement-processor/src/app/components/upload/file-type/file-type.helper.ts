export class FileTypeHelper {
    public static FILE_TYPES_DOCUMENT = ['.csv', '.xml'];

    public static ALLOWED_UPLOAD_TYPES = [
        ...FileTypeHelper.FILE_TYPES_DOCUMENT,
    ];

    public static hasAnyExtension(input: string, possibilities: string[]): boolean {
        let match = false;

        possibilities.some((possibility: string) => {
            match = input.endsWith(possibility.toLowerCase()) || input.endsWith(possibility.toUpperCase());
            return match;
        });

        return match;
    }
}
