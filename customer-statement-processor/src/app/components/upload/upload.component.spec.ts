import {createComponentFactory, Spectator} from "@ngneat/spectator";
import {UploadComponent} from "./upload.component";

describe('UploadComponent', () => {
    let spectator: Spectator<UploadComponent>;
    const createComponent = createComponentFactory({
        component: UploadComponent,
    });

    beforeEach(() => spectator = createComponent());

    it('should create', () => {
        expect(spectator.component).toBeTruthy();
    });
});
