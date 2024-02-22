import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgZorroAntdModule, NZ_I18N, es_ES } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { AppRoutingModule } from './app-routing.module';
import { TemplateModule } from './shared/template/template.module';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';

//CSV Parser
import { NgxCsvParserModule } from 'ngx-csv-parser';

//QRCode
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

import { NgChartjsModule } from 'ng-chartjs';
import { ThemeConstantService } from './shared/services/theme-constant.service';
registerLocaleData(es);

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

import { environment } from 'src/environments/environment';

// SortableJS
import { SortablejsModule } from 'ngx-sortablejs';

// Ngx Permissions
import { NgxPermissionsModule } from 'ngx-permissions';

// ag-grid
import { AgGridModule } from 'ag-grid-angular';
import { LicenseManager } from 'ag-grid-enterprise';
LicenseManager.setLicenseKey('Evaluation_License_Valid_Until_29_August_2018__MTUzNTQ5NzIwMDAwMA==00c7d5ad3b64cd638c04ea5496156d8b');

import { SharedUsersListComponent } from './shared/components/users/list/list.component';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

@NgModule({
    declarations: [
        AppComponent,
        CommonLayoutComponent,
        FullLayoutComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireMessagingModule,
        AngularFireFunctionsModule,
        AngularFirestoreModule,
        NgxPermissionsModule.forRoot(),
        NgZorroAntdModule,
        AppRoutingModule,
        TemplateModule,
        SortablejsModule.forRoot({ animation: 150 }),
        SharedModule,
        NgChartjsModule,
        NgxQRCodeModule,
        NgxCsvParserModule,
        AgGridModule.withComponents([
            SharedUsersListComponent
        ])
    ],
    providers: [
        {
            provide: NZ_I18N,
            useValue: es_ES,
        },
        AngularFireAuthGuard,
        ThemeConstantService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
