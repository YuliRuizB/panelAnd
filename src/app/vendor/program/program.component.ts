import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone } from '@angular/core'
import { map, take, takeUntil, tap } from 'rxjs/operators';
import { startOfToday, endOfToday, format, fromUnixTime, startOfDay } from 'date-fns';
import esLocale from 'date-fns/locale/es';
import * as _ from 'lodash';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

import am4themes_animated from "@amcharts/amcharts4/themes/animated"
import { IActivityLog ,LiveProgramColumnDefs, LiveProgramColumnsDef } from 'src/app/logistics/classes';
import { LogisticsService } from 'src/app/logistics/services.service';
import { GeoJson } from 'src/app/logistics/map';
import { Subject, Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { LiveService } from 'src/app/shared/services/live.service';
import { ProgramService } from 'src/app/shared/services/program.service';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { UsersService } from 'src/app/shared/services/users.service';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import 'ag-grid-community/dist/styles/ag-grid.css';
import { AssignmentsService } from 'src/app/shared/services/assignments.service';
import { DriversService } from 'src/app/shared/services/drivers.service';
import { VehiclesService } from 'src/app/shared/services/vehicles.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

am4core.useTheme(am4themes_animated);

declare var mapboxgl: any;

export interface Data {
  id: number;
  name: string;
  age: number;
  address: string;
  disabled: boolean;
}
interface IActivityLogAssing {
  assignmentId?:string;
  program?:string;
  customerId?:string;
  customerName:string;
  routeId?:string;
  routeName?:string;
  vendorId?:string;
  round?:string;
  date?:Date;
  vehicleCapacity?:number;
  vehicleId?:string;
  vehicleName?:string;
  id?:string;
  beginhour?:string;
  time?:Date;
  stopBeginHour?:string;
  stopEndName?:string;
  type?:string;
  vendorName?:string;
  vendorid?:string;
  driverId?:string;
  driverName?:string;
}

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.css']
})
export class ProgramComponent implements OnInit, OnDestroy {

  @ViewChild('map', { static: true }) mapElement: ElementRef;


  date = startOfToday();
  mode = 'month';
  // Grid
  rowFleetData: any[];
  columnFleetDefsProgram = LiveProgramColumnsDef;
  columnDefs =  LiveProgramColumnsDef;

  defaultColDef:  ColDef  = {
   // flex: 1,
    cellClass: 'align-right',
    resizable: true,
  };
  public rowSelection = 'multiple';

  visible = false;

  lat = 37.75;
  lng = -122.41;
  loading = false;

  // mapData
  map: any = mapboxgl.Map;
  source: any;
  markers: any;
  columnFleetDefs = LiveProgramColumnDefs

  rowData: IActivityLog[];
  rowDataAsignPostProg: IActivityLog[];
  rowDataAsignModal:IActivityLogAssing[];
  stopSubscription$: Subject<boolean> = new Subject();
  activityList: IActivityLog[];
  startDate: Date;
  endDate: Date;
  numAssing: string = "(0)";
  numAssingPro:string = "(0)";
  regSelected: string = "(0)";
  regFound:string;
  signupForm: UntypedFormGroup;

  private chart: am4charts.XYChart;
  chartData: any;
  gridApi: any;
  gridApiDetail: any;
  gridColumnApi: any;
  gridColumnApiDetail: any;

  isSpinning: boolean = true;
  isAssignmentsModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  user: any;
  stopSubscriptions$:Subject<boolean> = new Subject();
  vendorRoutesSubscription: Subscription;
  assignmentSubscription: Subscription;
  vehicleAssignmentSubscription: Subscription;
  arrDrivers: any[] =[];
  arrDriversEdit: any[] =[];
  arrVehicle: any[] =[];
  arrVehicleEdit : any[]=[];
  vehiclesSubscription: Subscription;
  driversSubscription: Subscription;
  pageIndex = 1;
  pageSize = 50;
  total = 1;
  listOfData: any[] = [];
  sortValue: string | null = null;
  sortKey: string | null = null;
  filterGender = [{ text: 'male', value: 'male' }, { text: 'female', value: 'female' }];
  searchGenderList: string[] = [];
  filterCustomer = [];
  filterRoute =[];
  customerPath:string = "";
  routePath:string = "";
  routeNameSelected:string ="";
  routeSelectedRecord:any =[];
  vendorID:string;
  filterCustomerRoute = [];
  public rowSelectionEdit = 'single';
  vehicleEditInput:string = "";
  driverEditInput:string = "";

  constructor(
    private logisticsService: LogisticsService,
    private liveService: LiveService,
    private programService: ProgramService,
    private routesService: RoutesService,
    private authService: AuthenticationService,
    private usersService: UsersService,
    private assignmentsService: AssignmentsService,
    private vehiclesService: VehiclesService,
    private driversService: DriversService,
    private zone: NgZone,
    private fb: UntypedFormBuilder,
    private nzMessageService: NzMessageService,
  ) {
    this.markers = [] as GeoJson[];
    this.startDate = startOfToday();
    this.endDate = endOfToday();
  }

  onQuickFilterChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('quickFilter') as HTMLInputElement).value
    );
  }
  onQuickFilterDetail() {
    this.gridApiDetail.setQuickFilter(
      (document.getElementById('filterDetail') as HTMLInputElement).value
    );
  }
  panelChange(change: { date: Date; mode: string }): void {
    //console.log(change.date, change.mode);
  }

  onValueChange(value: Date): void {
   //console.log(`Current value: ${value}`);
   if (this.date != startOfDay(new Date(value))) {
      // si son diferentes. 
      this.rowDataAsignModal = [];  // clear code before fill
      this.numAssing ="(0)";
      console.log("Se limpia el modal porque cambio la fecha de las asignaciones");
   }
    this.date = startOfDay(new Date(value));
    this.searchData(true);
  }

  public columnFleetDefsAsign: (ColDef) [] =[
    { headerName: 'Cliente', width:170, field: 'customerName',
      filter: true,checkboxSelection: true, headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true , sortable: true,enableCellChangeFlash:true },
    { headerName: 'Ruta',width:130, field: 'routeName', sortable: true, enableCellChangeFlash:true },
    { headerName: 'Conductor',width:200,field: 'driverName', sortable: true,
    cellEditor: 'agRichSelectCellEditor',
    editable:true,
    cellEditorParams: {values: this.arrDrivers.sort()},
     enableCellChangeFlash:true },
      { headerName: 'Vehículo', width:130, field: 'vehicleName', 
      cellEditor: 'agRichSelectCellEditor',
      editable:true,
      cellEditorParams: {values: this.arrVehicle.sort()},
      sortable: true,enableCellChangeFlash:true },
    { headerName: 'Inicia', width:115,field: 'time', sortable: true, filter: true ,
       valueGetter: (params) => {
      if(params && params.node && params.node.data.time) {
        return format( fromUnixTime(params.node.data.time.seconds), 'HH:mm a', { locale: esLocale })
      }
  } },,
    { headerName: 'Programa / Turno', width:175,field: 'round', valueGetter: (params) => {
        if(params && params.node) {     
          return  params.node.data.round + " / " + params.node.data.program
        }
    }}, 
    { headerName: 'Tipo', width:120,field: 'type', sortable: true, enableCellChangeFlash:true }
     ];
     
  onSelectDrivers(vendorID:string) {
  // fill dropdowns
    this.vehiclesSubscription = this.vehiclesService.getVendorVehicles(vendorID).pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map((a:any) => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data}
      }))
    ).subscribe(vehicles => {
      for (var x=0; x < vehicles.length;x++) {
        if (this.arrVehicle.indexOf(vehicles[x].name) === -1 && vehicles[x].name != undefined && vehicles[x].name != "") {
          this.arrVehicle.push(vehicles[x].name); 
          this.arrVehicleEdit.push({name: vehicles[x].name , id: vehicles[x].id})
        }
      }
    
    });
    this.driversSubscription = this.driversService.getDrivers(vendorID).pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data}
      }))
    ).subscribe(drivers => {
      for (var x=0; x < drivers.length;x++) {
        if (this.arrDrivers.indexOf(drivers[x].displayName) === -1 && drivers[x].displayName != undefined && drivers[x].displayName != "") {
          this.arrDrivers.push(drivers[x].displayName);  
          this.arrDriversEdit.push({ displayName: drivers[x].displayName, id:drivers[x].id});
        }
      }
    });
  }
  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }

  ngOnInit() {
    this.markers = this.logisticsService.getMarkers(this.startDate, this.endDate);
    setTimeout(() => {
      this.searchData();
      this.isSpinning = false
    }, 500);  
    this.createForm();
  }
  public columnAsign: ColDef = {
    resizable: true,
  };
  public columnProgram: ColDef = {
    resizable: true,
  };

  getSubscriptions(vendorId: string) {
    this.vendorRoutesSubscription = this.usersService.getBoardingPassesByRoute(vendorId).pipe(
      takeUntil(this.stopSubscriptions$)
    ).subscribe(data => {

      var filterCustomerC = [];
     this.filterCustomerRoute = [];
      for (var x = 0; x < data.length; x++) {

        this.filterCustomerRoute.push({
          customerId: data[x].customerId, customerName: data[x].customerName,
          routeId: data[x].passes[0].routeId, routeName: data[x].passes[0].routeName,
          type: data[x].passes[0].operation_type, round: data[x].passes[0].round,
          status: data[x].passes[0].status, program: data[x].passes[0].category
        });
      }
      this.filterCustomerRoute.forEach((element) => {
        var duplicateRecord = filterCustomerC.find( y =>
          y.customerName == element.customerName);
          if (duplicateRecord == undefined) {
            filterCustomerC.push({ customerId: element.customerId, customerName: element.customerName});
          }
      });
      this.filterCustomer = filterCustomerC;
    });
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  onPanelChange(event) {
  }

  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort.key;
    this.sortValue = sort.value;
    this.searchData();
  }

  searchData(reset: boolean = false): void {
    if (reset) {
      this.pageIndex = 1;
    }
    this.loading = true;
    this.programService.getProgramsByDay(this.date).pipe(
      take(1),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data }
      })),
      tap(data => {
        this.loading = false;
        this.total = data.length;
        //console.log(data);
        
        this.rowData = data;
        this.numAssingPro = " ( " + data.length + " ) ";
        this.rowDataAsignPostProg = data;
          
      })
    ).subscribe();
  }

  updateFilter(value: string[]): void {
    this.searchGenderList = value;
    this.searchData(true);
  }

  ngOnDestroy() {
    this.stopSubscription$.next();
    this.stopSubscription$.complete();
    
  }
  getInfoAssigments(){
    this.authService.user.subscribe( (user:any) => {
      this.user = user;
      this.vendorID = user.vendorId;
      this.getSubscriptions(user.vendorId);

      this.onSelectDrivers(user.vendorId);
    })
  }

  getAssignments() {
    this.getInfoAssigments();
    this.isAssignmentsModalVisible = true;
   
  }

  deleteAssignment(assignmentId: string, customerId: string ) {
    this.routesService.deleteCustomerVendorAssignment(assignmentId, customerId);
  }

  cancelDeleteAssignment(): void {
    console.log('delete cancelled');
  }

  handleCancel() {
    this.isAssignmentsModalVisible = false;
     this.stopSubscriptions$.next();
     this.stopSubscriptions$.complete();
     (document.getElementById('quickFilter') as HTMLInputElement).value = "";
     (document.getElementById('filterDetail') as HTMLInputElement).value = "";
     this.onQuickFilterChanged();     
     this.regSelected = "(0)";
     this.regFound="";
     this.rowDataAsignModal = [];
     this.rowDataAsignPostProg = [];
     this.routePath = "";
     this.customerPath = "";
     this.routeNameSelected =  "";
     this.searchData(true);
  }

  handleOk() {
    var selectedRows = this.gridApi.getSelectedRows();
    this.rowDataAsignPostProg = [];
    var numAssignI: number = this.gridApi.length;
    selectedRows.forEach(x => {
      let data = x;

      data.vendorId = x.vendorId;
      data.customerId = x.customerId;
      data.assignmentId = x.assignmentId;
      data.routeId = x.routeId;
      data.customerName = x.customerName;
      data.routeName = x.routeName;
      console.log('full data is: ', data);
      this.programService.setProgram(data);
    });

    this.searchData(true);
    numAssignI = numAssignI - selectedRows.length;
    this.regSelected = "(0)";
    this.rowDataAsignModal = [];
    this.rowDataAsignPostProg = [];
    this.regFound = "";
    this.routePath = "";
    this.customerPath = "";
    this.routeNameSelected = "";
    this.isAssignmentsModalVisible = false;
    this.nzMessageService.success('Se Programo con éxito, favor de actualizar la tabla.'); 
  }

  formatDate(date: any) {
    return format(fromUnixTime(date.seconds), 'HH:mm', { locale: esLocale });
  }

  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApiDetail = params.api;
    this.gridColumnApiDetail = params.columnApi;
  }
  onGridReadyP(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onSelectionChanged(params: GridReadyEvent) {
    const selectedRows = this.gridApi.getSelectedRows();
   this.regSelected = " ( " + selectedRows.length + " ) ";
  }

  onSelect(customerSelected:any) {
    this.customerPath = customerSelected.customerName;
    this.routePath = this.customerPath;
    var filterRoute =[];

    this.filterCustomerRoute.forEach((element) => {
      if (element.customerId == customerSelected.customerId){
      var duplicateRecord = filterRoute.find( y =>
        y.routeId == element.routeId && y.customerId == element.customerId);
        if (duplicateRecord == undefined) {
          filterRoute.push({ routeId: element.routeId, routeName: element.routeName});
        }
      }
    });
    this.filterRoute = filterRoute;
  }

  onSelectRoute(routeSelected: any) {
    this.routePath = this.customerPath + " / " + routeSelected.routeName;
    if( this.routeNameSelected != routeSelected.routeName){
      this.rowDataAsignModal = [];
    }
    this.routeNameSelected =routeSelected.routeName;
    
    this.assignmentSubscription = this.assignmentsService.getActiveAssignmentsRoute(this.vendorID, routeSelected.routeId).pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data }
      }))
    ).subscribe(assignments => {
      this.routeSelectedRecord = assignments;
    });
  }
  handleSearch() {
    if (this.routeSelectedRecord.length > 0) {
      this.rowDataAsignModal = [];
      let assignedDataModal = [];
      this.regFound = "";
      let counter = 0;
       this.routeSelectedRecord.forEach((element) => {
        if (element.id.length > 0) {
          this.vehicleAssignmentSubscription = this.routesService.getRouteVehicleAssignments(element.customerId,
            element.routeId, element.id, element.vendorId).pipe(
              takeUntil(this.stopSubscription$),
              map(actions => actions.map(a => {
                const id = a.payload.doc.id;
                const data = a.payload.doc.data() as any;
                return { id, ...data }
              }))
            ).subscribe(assignmentsVehiculo => {
              counter++;
              assignmentsVehiculo.forEach((vehiculoAssigmentElement) => {
                if (element.active) {
                  //search inside the assigned , to now showed
                  var findAssignacion = this.rowDataAsignPostProg.find(x =>
                    x.customerId == element.customerId &&  x.routeName == this.routeNameSelected &&
                    x.driver == vehiculoAssigmentElement.driverName &&
                    x.vehicleName == vehiculoAssigmentElement.vehicleName && x.type == element.type
                  );
                  // delete duplicity of data
                  if (findAssignacion == undefined) {
                    if (this.rowDataAsignModal.indexOf(vehiculoAssigmentElement.assignmentId) === -1) {
                      assignedDataModal.push({
                        assignmentId: vehiculoAssigmentElement.assignmentId,
                        program: element.program, // si
                        customerId: element.customerId,
                        customerName:  this.customerPath,  //1
                        routeId: element.routeId,
                        routeName: this.routeNameSelected,  //2
                        vendorId: element.vendorId,
                        round: element.round,  //3 Turno
                        date: this.date,
                        vehicleCapacity: vehiculoAssigmentElement.vehicleCapacity,
                        vehicleId: vehiculoAssigmentElement.vehicleId,
                        vehicleName: vehiculoAssigmentElement.vehicleName, // 4
                        id: vehiculoAssigmentElement.id,
                        beginhour: element.beginhour,  //5
                        time: element.time, //si
                        stopEndName: element.stopEndName,
                        type: element.type,  // 6  si
                        vendorName: element.vendorName, //7
                        vendorid: this.vendorID,
                        driverId: vehiculoAssigmentElement.driverId,
                        driverName: vehiculoAssigmentElement.driverName //8
                      });
                    }
                  }
                }
              });
              if(counter === this.routeSelectedRecord.length) {
                this.rowDataAsignModal = assignedDataModal;
              }
              if (this.rowDataAsignModal != undefined) {  
                if(this.rowDataAsignModal.length == 0) {
                  this.regFound= "No se encontraron rutas para programar.";
                }
                this.numAssing = " (" + this.rowDataAsignModal.length + ") ";
              } 
            });
        }
      });
    }
  }

  handleOKEdit() { // Accept the  edit over the program row
    // Save the edit mode
    let data = this.signupForm;
    console.log('full data is: ', data);
    this.programService.editProgram( this.vendorID, data);
    // close the modal.
    this.isEditModalVisible = false;
  }
  handleCancelEdit () { // cancel.
    this.isEditModalVisible = false;
  }
  createForm() {
    this.signupForm = this.fb.group({
    id: [],
    customerName: [''],
    routeName: [''],
    driver: [''],
    vehicleName: [''],
    vehicleId:[''],
    routeId: [''],
    driverId:[''],
    customerId: [''],
    idProgram: ['']
    });
  }

  onSelectionChangedEdit(params: GridReadyEvent) {
    const selectedRows = this.gridApiDetail.getSelectedRows();
    console.log(selectedRows);
    this.isEditModalVisible = true;
    let recordToPatchValue = { ...selectedRows[0] };
    this.signupForm.patchValue({ ...recordToPatchValue });
    // this.arrDrivers // arrVehicle fill 
    this.getInfoAssigments();
  }
  vehicleSet(vehicle: any){
    this.signupForm.controls['vehicleName'].setValue(vehicle.name);
    this.signupForm.controls['vehicleId'].setValue(vehicle.id);
  }
  driverSet(driver: any){
   this.signupForm.controls['driver'].setValue(driver.displayName);
   this.signupForm.controls['driverId'].setValue(driver.id);
  }

  refreshTable(){
    this.searchData(true);
  }
}

