import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { takeUntil, map } from 'rxjs/operators';
import { VehiclesService } from 'src/app/shared/services/vehicles.service';
import { DriversService } from 'src/app/shared/services/drivers.service';
import { ProgramService } from 'src/app/shared/services/program.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-shared-vehicle-assignments',
  templateUrl: './vehicle-assignments.component.html',
  styleUrls: ['./vehicle-assignments.component.css']
})
export class SharedVehicleAssignmentsComponent implements OnInit, OnDestroy {

  @Input() vendorId: string;
  @Input() customerId: string;
  @Input() customerName: string;
  @Input() assignmentId: string;
  @Input() routeId: string;
  @Input() routeName: string;

  stopSubscription$: Subject<boolean> = new Subject();
  loading: boolean = true;
  isModalVisible: boolean = false;
  isSelectDayVisible: boolean = false;

  selectedAssignment: any;

  programSelectedDate: Date = new Date();
  vehicleAssignmentsList: any[] = [];
  vehicleAssignmentSubscription: Subscription;
  
  vehiclesList: any[] = [];
  vehiclesSubscription: Subscription;

  driversList: any[] = [];
  driversSubscription: Subscription;

  assignmentForm: UntypedFormGroup;

  constructor(
    private routesService: RoutesService,
    private vehiclesService: VehiclesService,
    private driversService: DriversService,
    private programService: ProgramService,
    private fb: UntypedFormBuilder
    ) { }

  ngOnInit() {
    
    this.getSubscriptions();
    this.createForm();
  }

  ngOnDestroy() {
    this.stopSubscription$.next();
    this.stopSubscription$.complete();
  }

  createForm() {
    this.assignmentForm = this.fb.group({
      active: [true, [ Validators.required ]],
      customerId: [this.customerId, [Validators.required ]],
      vendorId: [this.vendorId, [Validators.required ]],
      routeId: [ this.routeId, [Validators.required ]],
      assignmentId: [this.assignmentId, [Validators.required ]],
      vehicleId: ['', [Validators.required ]],
      vehicleName: ['', [Validators.required ]],
      vehicleCapacity: [0],
      driverId: ['', [Validators.required ]],
      driverName: ['', [Validators.required ]]
    })
  }

  getSubscriptions() {
    this.vehicleAssignmentSubscription = this.routesService.getRouteVehicleAssignments(this.customerId, this.routeId, this.assignmentId, this.vendorId).pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data}
      }))
    ).subscribe( assignments => {
      this.vehicleAssignmentsList = assignments;
      this.loading = false;
    });

    this.vehiclesSubscription = this.vehiclesService.getVendorVehicles(this.vendorId).pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data}
      }))
    ).subscribe( vehicles => {
      this.vehiclesList = vehicles;
      console.log(vehicles);
      this.loading = false;
    });

    this.driversSubscription = this.driversService.getDrivers(this.vendorId).pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data}
      }))
    ).subscribe( drivers => {
      this.driversList = drivers;
      console.log(drivers);
      this.loading = false;
    });

  }

  showModal() {
    this.isModalVisible = true;
  }

  handleCancel() {
    this.isModalVisible = false;
    this.isSelectDayVisible = false;
  }

  handleOk() {
    console.log(this.assignmentForm.value);
    if(this.assignmentForm.valid) {
      this.routesService.setRouteVehicleAssignments(this.customerId, this.routeId, this.assignmentForm.value);
      this.isModalVisible = false;
    } else {
      console.log('form is invalid');
    }
  }

  toggleActive(data) {
    this.loading = true;
    this.routesService.toggleRouteVehicleAssignment(this.customerId, this.routeId, data.id, data).then( () => {
      this.loading = false;
    })
    .catch( err => console.log(err));
  }

  selectProgramDay(data) {
    this.selectedAssignment = data;
    this.isSelectDayVisible = true;
    this.selectedAssignment.date = new Date();
  }

  onSelectedDayChange(date) {
    this.selectedAssignment.date = date;
  }

  makeProgram() {
    let data = this.selectedAssignment;
    data.vendorId = this.vendorId;
    data.customerId = this.customerId;
    data.assignmentId = this.assignmentId;
    data.routeId = this.routeId;
    data.customerName = this.customerName;
    data.routeName = this.routeName;
    console.log('full data is: ', data);
    this.programService.setProgram(data);
    this.selectedAssignment = null;
    this.isSelectDayVisible = false;
  }

  deleteAssignment(data) {
    this.loading = true;
    this.routesService.deleteRouteVehicleAssignments(this.customerId, this.routeId, data.id).then( () => {
      this.loading = false;
    })
    .catch( err => console.log(err));
  }

  onDriverSelected(event, field) {
    if(event) {
      const recordArray = _.filter(this.driversList, s => {
        return s.id == event;
      });
      const record = recordArray[0];
      console.log(record);
      this.assignmentForm.controls[field].setValue(record.displayName);
    }
  }

  onVehicleSelected(event, field) {
    if(event) {
      const recordArray = _.filter(this.vehiclesList, s => {
        return s.id == event;
      });
      const record = recordArray[0];
      console.log(record);
      this.assignmentForm.controls[field].setValue(record.name);
      this.assignmentForm.controls['vehicleCapacity'].setValue(record.seats);
    }
  }

}
