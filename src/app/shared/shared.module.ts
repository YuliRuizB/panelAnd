import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ThemeConstantService } from './services/theme-constant.service';
import { SearchPipe } from './pipes/search.pipe';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CurrencyPipe } from './pipes/currency.pipe';
import { AgGridModule } from 'ag-grid-angular';
import { SharedUsersListComponent } from './components/users/list/list.component';
import { SharedProductsListComponent } from './components/products/list/list.component';
import { SharedRoutesListComponent } from './components/routes/list/list.component';
import { SharedStopPointsListComponent } from './components/stop-points/list/list.component';
import { SharedStopPointsEditComponent } from './components/stop-points/edit/edit.component';
import { NoticeService } from './services/notice.service';
import { SharedVendorSettingsComponent } from './components/vendor/settings/settings.component';
import { SharedVendorDriversComponent } from './components/vendor/drivers/drivers.component';
import { SharedVendorVehiclesComponent } from './components/vendor/vehicles/vehicles.component';
import { SortablejsModule } from 'ngx-sortablejs';
import { TableService } from './services/table.service';
import { TreeComponent } from './components/users/charts/tree/tree.component';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SharedUsersUsageHistoryComponent } from './components/users/boardingPass/usage-history/usage-history.component';
import { SharedRouteProgramsComponent } from './components/routes/programs/programs.component';
import { SharedVendorAssignmentsComponent } from './components/vendor/assignments/assignments.component';
import { SharedVehicleAssignmentsComponent } from './components/vendor/vehicle-assignments/vehicle-assignments.component';
import { SharedStopPointsNewComponent } from './components/stop-points/new/new.component';
import { SharedCustomerVendorAssignmentsComponent } from './components/routes/assignments/assignments.component';
import { SharedAccountEditComponent } from './components/accounts/edit/edit.component';
import { SharedAccountPaymentMethodsComponent } from './components/accounts/payment-methods/payment-methods.component';
import { SharedSystemUsersListComponent } from './components/system/users/users.component';
import { SharedVendorUsersListComponent } from './components/vendor/system/users/users.component';
import { SharedUsersQRCodesComponent } from './components/users/boardingPass/qrcodes/qrcodes.component';
import { SharedUsersCredentialsQRCodesComponent } from './components/users/credentials/qrcodes/qrcodes.component';
import { MessageCenterComponent } from './components/vendor/messageCenter/messageCenter.component';

@NgModule({ 
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        NgZorroAntdModule,
        PerfectScrollbarModule,
        SearchPipe,
        NgxPermissionsModule,
        NgxQRCodeModule,
        ReactiveFormsModule,
        AgGridModule,
        SharedUsersListComponent,
        SharedProductsListComponent,
        SharedRoutesListComponent,
        SharedStopPointsListComponent,
        SharedStopPointsEditComponent,
        SharedStopPointsNewComponent,
        SharedVendorSettingsComponent,
        SharedVendorDriversComponent,
        SharedVendorVehiclesComponent,
        SortablejsModule,
        SharedUsersUsageHistoryComponent,
        SharedRouteProgramsComponent,
        SharedVendorAssignmentsComponent,
        SharedVehicleAssignmentsComponent,
        SharedCustomerVendorAssignmentsComponent,
        SharedAccountEditComponent,
        SharedAccountPaymentMethodsComponent,
        SharedSystemUsersListComponent,
        SharedVendorUsersListComponent,
        SharedUsersQRCodesComponent,
        SharedUsersCredentialsQRCodesComponent,
        MessageCenterComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        NgxQRCodeModule,
        ReactiveFormsModule,
        AgGridModule,
        PerfectScrollbarModule,
        SortablejsModule,
    ],
    declarations: [
        SearchPipe,
        CurrencyPipe,
        SharedUsersListComponent,
        SharedProductsListComponent,
        SharedRoutesListComponent,
        SharedStopPointsListComponent,
        SharedStopPointsEditComponent,
        SharedVendorSettingsComponent,
        SharedVendorDriversComponent,
        SharedVendorVehiclesComponent,
        TreeComponent,
        SharedUsersUsageHistoryComponent,
        SharedRouteProgramsComponent,
        SharedVendorAssignmentsComponent,
        SharedVehicleAssignmentsComponent,
        SharedStopPointsNewComponent,
        SharedCustomerVendorAssignmentsComponent,
        SharedAccountEditComponent,
        SharedAccountPaymentMethodsComponent,
        SharedSystemUsersListComponent,
        SharedVendorUsersListComponent,
        SharedUsersQRCodesComponent,
        SharedUsersCredentialsQRCodesComponent,
        MessageCenterComponent
    ],
    providers: [
        ThemeConstantService,
        NoticeService,
        TableService
    ],
    // entryComponents: [
    //     SharedStopPointsEditComponent,
    //     SharedStopPointsNewComponent
    // ]
})

export class SharedModule { }
