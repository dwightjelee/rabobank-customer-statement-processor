import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import {DataTableComponent} from "./components/data-table/data-table.component";
import {MatTableModule} from "@angular/material/table";
import {UploadComponent} from "./components/upload/upload.component";
import {NgxFileDropModule} from "ngx-file-drop";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ReadableBytesizePipe} from "./pipes/readable-bytesize.pipe";

@NgModule({
    declarations: [
        AppComponent,
        DataTableComponent,
        UploadComponent,
        ReadableBytesizePipe,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatTableModule,
        NgxFileDropModule,
        MatListModule,
        MatButtonModule,
        MatTooltipModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
