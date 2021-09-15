import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {UploadedFile} from "../../models/uploaded-file.interface";
import {FileTypeHelper} from "./file-type/file-type.helper";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";

@Component({
    selector: 'upload',
    templateUrl: 'upload.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class UploadComponent implements OnInit {
    @Output()
    submitUploadFiles = new EventEmitter<UploadedFile[]>();

    public dropzoneClass: string;
    public droppedFiles$: Observable<UploadedFile[]>;
    public acceptedExtensions = FileTypeHelper.ALLOWED_UPLOAD_TYPES;
    public invalidExtensions: string;

    private idleDropzoneClass = 'border-dimmed';
    private activeDropzoneClass = 'border-primary';
    private dropZoneStateSubject = new BehaviorSubject<boolean>(false);
    private droppedFilesSubject = new BehaviorSubject<UploadedFile[]>([]);
    private subscriptions: Subscription[] = [];

    constructor() {
    }

    /**
     * Set subscriptions
     */
    public ngOnInit(): void {
        this.droppedFiles$ = this.droppedFilesSubject.asObservable();
        this.subscriptions.push(
            this.dropZoneStateSubject.asObservable().subscribe((isActive: boolean) => {
                this.dropzoneClass = isActive ? this.activeDropzoneClass : this.idleDropzoneClass;
            }),
        );
    }

    /**
     * Remove all subscriptions on destroy
     */
    public ngOnDestroy(): void {
        this.subscriptions.map(sub => sub.unsubscribe());
    }

    /**
     * Emit uploaded files on submit
     */
    public submit(): void {
        this.submitUploadFiles.emit(this.droppedFilesSubject.getValue());
    }

    /**
     * Removes a file from the upload list
     * @param file
     */
    public removeFile(file: UploadedFile): void {
        const currentFiles = this.droppedFilesSubject.getValue();
        currentFiles.splice(currentFiles.indexOf(file), 1);
        this.droppedFilesSubject.next(currentFiles);
    }

    /**
     * Processes dropped files and checks for
     * valid file-extensions
     * @param files
     */
    public fileDrop(files: NgxFileDropEntry[]): void {
        this.invalidExtensions = null;
        const fileExtensionErrors: string[] = [];

        files
            .filter(file => file.fileEntry.isFile)
            .forEach(dropEntry => {
                const fileExtension = `.${dropEntry.fileEntry.name.split('.').pop()}`;
                const dropEntryApproved = this.acceptedExtensions.includes(fileExtension);

                if (dropEntryApproved) {
                    this.transformEntry(dropEntry).then((result: UploadedFile) => {
                        const currentFiles = this.droppedFilesSubject.getValue();
                        this.droppedFilesSubject.next([...currentFiles, result]);
                        this.setDropzoneState(false);
                    });
                } else {
                    if (!fileExtensionErrors.includes(fileExtension)) {
                        fileExtensionErrors.push(fileExtension);
                    }
                }
            });

        if (fileExtensionErrors.length) {
            this.invalidExtensions = `Files with the extentions: ${fileExtensionErrors} are not allowed.`;
        }
    }

    /**
     * Sets the state of the drop zone
     * @param isActive
     */
    public setDropzoneState(isActive: boolean): void {
        this.dropZoneStateSubject.next(isActive);
    }

    /**
     * Transforms uploaded files to UploadedFile
     * @param dropEntry
     * @returns Promise<UploadedFile>
     * @private
     */
    private async transformEntry(dropEntry: NgxFileDropEntry): Promise<UploadedFile> {
        let nativeFile: File;

        nativeFile = await this.getNativeFile(dropEntry.fileEntry as FileSystemFileEntry);

        return new Promise(resolve => {
            resolve({
                relativePath: dropEntry.relativePath,
                name: dropEntry.fileEntry.name,
                file: nativeFile,
                size: nativeFile?.size,
                type: dropEntry.fileEntry.name.split('.')[1],
                allowedSize: nativeFile?.size <= 1024 * 1024 * 10, // 10 MB
            });
        });
    }

    /**
     * Takes a fileEntry and returns the native file
     * @param fileEntry
     * @returns Promise<File>
     * @private
     */
    private async getNativeFile(fileEntry: FileSystemFileEntry): Promise<File> {
        return new Promise(resolve => {
            (fileEntry as FileSystemFileEntry).file((file: File) => {
                resolve(file);
            });
        });
    }
}
