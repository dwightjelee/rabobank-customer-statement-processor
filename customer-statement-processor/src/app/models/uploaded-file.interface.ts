export interface UploadedFile {
    name: string;
    relativePath: string;
    size: number;
    type: string;
    allowedSize: boolean;
    file: File;
}
