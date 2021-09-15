import {createComponentFactory, Spectator} from "@ngneat/spectator";
import {UploadComponent} from "./upload.component";
import {UploadedFile} from "../../models/uploaded-file.interface";
import {FileSystemFileEntry, NgxFileDropEntry, NgxFileDropModule} from "ngx-file-drop";
import {MatListModule} from "@angular/material/list";
import {MockPipe} from "ng-mocks";
import {ReadableBytesizePipe} from "../../pipes/readable-bytesize.pipe";
import {fakeAsync, tick} from "@angular/core/testing";
import {take} from "rxjs/operators";

const mockFile: UploadedFile = {
    name: 'foo.bar',
    relativePath: 'foo.bar',
    allowedSize: true,
    size: 1024,
    type: 'bar',
    file: {
        size: 1024,
    } as File,
};

const mockDropEntry = {
    relativePath: 'foo.bar',
    fileEntry: {
        isDirectory: false,
        isFile: true,
        name: 'foo.bar',
        file: callback =>
            callback({
                size: 1024,
            }),
    } as unknown as FileSystemFileEntry,
} as NgxFileDropEntry;

const mockIncorrectFile: UploadedFile = {
    name: 'bar.foo',
    relativePath: 'bar.foo',
    allowedSize: true,
    size: 1024,
    type: 'foo',
    file: {
        size: 1024,
    } as File,
};

const mockIncorrectDropEntry = {
    relativePath: 'bar.foo',
    fileEntry: {
        isDirectory: false,
        isFile: true,
        name: 'bar.foo',
        file: callback =>
            callback({
                size: 1024,
            }),
    } as unknown as FileSystemFileEntry,
} as NgxFileDropEntry;

describe('UploadComponent', () => {
    let spectator: Spectator<UploadComponent>;
    const createComponent = createComponentFactory({
        component: UploadComponent,
        imports: [
            NgxFileDropModule,
            MatListModule,
        ],
        declarations: [
            MockPipe(ReadableBytesizePipe),
        ]
    });

    beforeEach(() => spectator = createComponent({
        props: { acceptedExtensions: ['.bar'] }
    }));

    it('should create', () => {
        expect(spectator.component).toBeTruthy();
    });

    it('should set dropzone state', () => {
        expect(spectator.component.dropzoneClass).toBe('border-dimmed');
        spectator.component.setDropzoneState(true);
        expect(spectator.component.dropzoneClass).toBe('border-primary');
        spectator.component.setDropzoneState(false);
        expect(spectator.component.dropzoneClass).toBe('border-dimmed');
    });

    it('should handle selected files', fakeAsync(() => {
        spectator.component.fileDrop([mockDropEntry]);

        tick();

        spectator.component.droppedFiles$.pipe(take(1)).subscribe(files => {
            expect(files).toEqual([mockFile]);
        });
    }));

    it('should handle removed files', fakeAsync(() => {
        spectator.component.fileDrop([mockDropEntry, { ...mockDropEntry }]);

        tick();

        spectator.component.removeFile(mockFile);
        spectator.component.droppedFiles$.pipe(take(1)).subscribe(files => {
            expect(files).toEqual([mockFile]);
        });
    }));

    it('should return warnings for unsupported file-types', fakeAsync(() => {
        spectator.component.fileDrop([mockIncorrectDropEntry]);

        tick();

        spectator.component.droppedFiles$.pipe(take(1)).subscribe(files => {
            expect(spectator.component.invalidExtensions).toBe('Files with the extentions: .foo are not allowed.');
        });
    }));

    it('should emit the uploaded files on submit', fakeAsync(() => {
        const emitSpy = spyOn<any>(spectator.component.submitUploadFiles, 'emit');

        spectator.component.fileDrop([mockDropEntry, { ...mockDropEntry }]);

        tick();

        spectator.component.submit();

        expect(emitSpy).toHaveBeenCalledWith([mockFile, mockFile]);
    }));
});
