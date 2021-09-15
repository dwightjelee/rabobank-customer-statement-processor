export class FileTypeHelper {
    public static FILE_TYPES_DOCUMENT = ['.csv', '.xml'];

    public static ALLOWED_UPLOAD_TYPES = [
        ...FileTypeHelper.FILE_TYPES_DOCUMENT,
    ];
}
