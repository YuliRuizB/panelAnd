import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { takeUntil, map } from 'rxjs/operators';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { IBaseProgram } from 'src/app/shared/interfaces/program.type';
import { IStopPoint } from 'src/app/shared/interfaces/route.type';
import * as _ from 'lodash';
import { AssignmentType } from 'src/app/shared/interfaces/assignment.type';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { IVendor } from 'src/app/shared/interfaces/vendor.type';
import { NzNotificationService } from 'ng-zorro-antd';
import { addMinutes, set } from 'date-fns';

@Component({
  selector: 'app-shared-customer-vendor-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class SharedCustomerVendorAssignmentsComponent implements OnInit {

  @Input() accountId: string;

  //temp var
  routeId;


  loading: boolean = true;
  pageSize: number = 10;

  stopSubscription$: Subject<any> = new Subject();
  programsList: any = [];
  routesList: any = [];
  stopPointsList: any = [];
  vendorsList: any = [];

  isCreateVisible: boolean = false;
  isEditMode: boolean = false;
  currentSelectedId: string;
  currentSelected: any;
  programForm: UntypedFormGroup;
  assigmentType: AssignmentType

  constructor(
    private notification: NzNotificationService,
    private routesService: RoutesService,
    private vendorsService: VendorService,
    private fb: UntypedFormBuilder
  ) {
    this.createForm();
    console.log(this.assigmentType);
  }

  ngOnInit() {
    this.getSubscriptions();
  }

  ngOnDestroy() {
    this.stopSubscription$.next();
    this.stopSubscription$.complete();
  }

  getSubscriptions() {

    this.routesService.getRoutes(this.accountId).pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data }
      })))
      .subscribe((routes: IStopPoint[]) => {
        this.routesList = routes;
        this.loading = false;
      });

    this.routesService.getCustomerVendorAssignments(this.accountId).pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as IBaseProgram;
        return { id, ...data }
      })))
      .subscribe((programs: IBaseProgram[]) => {
        this.programsList = programs;
        console.log(programs);
        this.loading = false;
      });

    this.vendorsService.getVendors().pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as IVendor;
        return { id, ...data }
      })))
      .subscribe((vendors: IVendor[]) => {
        this.vendorsList = vendors;
        this.loading = false;
      });
  }

  getRouteName(routeId: string) {

    let routeName = '';
    if (this.routesList.length > 0) {
      let selectedRoute = _.filter(this.routesList, r => {
        return r.id == routeId
      });
      if (selectedRoute.length > 0) {
        routeName = selectedRoute[0].name;
      }
    }
    return routeName;
  }

  createForm() {
    this.programForm = this.fb.group({
      active: [false, [Validators.required]],
      acRequired: [false, [Validators.required]],
      isSunday: [false, [Validators.required]],
      isMonday: [true, [Validators.required]],
      isTuesday: [true, [Validators.required]],
      isWednesday: [true, [Validators.required]],
      isThursday: [true, [Validators.required]],
      isFriday: [true, [Validators.required]],
      isSaturday: [false, [Validators.required]],
      program: ['', [Validators.required]],
      round: ['', [Validators.required]],
      stopBeginId: ['', [Validators.required]],
      stopBeginName: ['', [Validators.required]],
      stopBeginHour: ['', [Validators.required]],
      stopBeginHourT: [''],
      stopEndId: ['', [Validators.required]],
      stopEndName: ['', [Validators.required]],
      stopEndHour: ['', [Validators.required]],
      stopEndHourT: [''],
      time: [new Date(), [Validators.required]],
      type: [this.assigmentType, [Validators.required]],
      customerName: ['', [Validators.required]],
      customerId: [this.accountId, [Validators.required]],
      vendorName: ['', [Validators.required]],
      vendorId: ['', [Validators.required]],
      routeId: ['', [Validators.required]]
    })
  }

  patchForm(data) {

    const stopBeginHourArray = data.stopBeginHour.split(':');
    const stopEndHourArray = data.stopEndHour.split(':');

    console.log(set(data.time.toDate(), { hours: stopBeginHourArray[0], minutes: stopBeginHourArray[1]}));

    this.programForm.patchValue({
      active: data.active,
      acRequired: data.acRequired,
      isSunday: data.isSunday,
      isMonday: data.isMonday,
      isTuesday: data.isTuesday,
      isWednesday: data.isWednesday,
      isThursday: data.isThursday,
      isFriday: data.isFriday,
      isSaturday: data.isSaturday,
      program: data.program,
      round: data.round,
      stopBeginId: data.stopBeginId,
      stopBeginName: data.stopBeginName,
      stopBeginHour: data.stopBeginHour,
      stopBeginHourT: set(data.time.toDate(), { hours: stopBeginHourArray[0], minutes: stopBeginHourArray[1]}),
      stopEndId: data.stopEndId,
      stopEndName: data.stopEndName,
      stopEndHour: data.stopEndHour,
      stopEndHourT: set(data.time.toDate(), { hours: stopEndHourArray[0], minutes: stopEndHourArray[1]}),
      time: (data.time).toDate(),
      type: data.type,
      customerName: data.customerName,
      customerId: this.accountId,
      vendorName: data.vendorName,
      vendorId: data.vendorId,
      routeId: data.routeId
    });
  }

  toggleActive(data) {
    this.routesService.toggleRouteAssignment(this.accountId, data.routeId, data.id, data).then(() => {
      this.isCreateVisible = false;
      this.isEditMode = false;
    })
      .catch(err => console.log(err));
  }

  showCreateModal() {
    this.programForm.reset();
    this.isCreateVisible = true;
    this.currentSelectedId = null;
    this.currentSelected = null;
  }

  showModalDelete(data) {
    console.log(data);
    this.routesService.deleteRouteAssignments(this.accountId, data.routeId, data.id).then(() => {
      this.isCreateVisible = false;
      this.isEditMode = false;
    })
      .catch(err => console.log(err));
  }

  showModalEdit(data) {
    this.currentSelectedId = data.id;
    this.currentSelected = data;
    this.patchForm(data);
    console.log(data);
    
    setTimeout(() => {
      this.isCreateVisible = true;
    }, 100);
    this.isEditMode = true;
  }

  handleCancel() {
    this.isCreateVisible = false;
    this.isEditMode = false;
    this.currentSelectedId = null;
  }

  createProgram() {

    // console.log(this.programForm.value);

    this.programForm.get('customerId').setValue(this.accountId);
    
    // const program = this.programForm.get('program').value;

    const stopBeginHourDate = new Date(this.programForm.controls['stopBeginHourT'].value);
      const stopEndHourDate = new Date(this.programForm.controls['stopEndHourT'].value);
      const stopBeginHour = [stopBeginHourDate.getHours(), String(stopBeginHourDate.getMinutes()).padStart(2, '0')].join(':');
      const stopEndHour = [stopEndHourDate.getHours(), String(stopEndHourDate.getMinutes()).padStart(2, '0')].join(':');

      this.programForm.controls['stopBeginHour'].setValue(stopBeginHour);
      this.programForm.controls['stopEndHour'].setValue(stopEndHour);
      
      console.log(stopBeginHour, stopEndHour);
    // if(program == 'M') {
    //   this.onStopPointSelected(this.programForm.get('stopBeginId').value, 'stopBeginName','stopBeginHour');
    //   this.onStopPointSelected(this.programForm.get('stopEndId').value, 'stopEndName','stopEndHour');
    // } else {
    //   this.onStopPointSelected(this.programForm.get('stopBeginId').value, 'stopBeginName','stopEndHour');
    //   this.onStopPointSelected(this.programForm.get('stopEndId').value, 'stopEndName','stopBeginHour');
    // }
    
    if( this.programForm.get('stopBeginHour').value == '' || this.programForm.get('stopEndHour').value == '') {
      return this.notification.create(
        'error',
        'Problema con la información',
        'No están definidos los tiempos entre paradas de esta ruta para el turno seleccionado'
      );
    }

    if (!this.isEditMode) {
      this.routesService.setRouteAssignments(this.accountId, this.programForm.get('routeId').value, this.programForm.value).then(() => {
        this.isCreateVisible = false;
        this.isEditMode = false;
      })
        .catch(err => console.log(err));
      console.log(this.programForm.value);
      
      
    } else {
      this.routesService.updateRouteAssignment(this.accountId, this.programForm.get('routeId').value, this.currentSelectedId, this.programForm.value).then(() => {
        this.isCreateVisible = false;
        this.isEditMode = false;
        this.currentSelectedId = null;
      })
        .catch(err => console.log(err));
      console.log(this.programForm.value);
    }

  }

  checkChange(formControl: string, event: boolean) {
    this.programForm.controls[formControl].setValue(event);
    console.log(this.programForm.value);
  }

  onRouteSelected(routeId: string) {
    this.routesService.getRouteStopPoints(this.accountId, routeId).pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as IStopPoint;
        return { id, ...data }
    })))
    .subscribe( (stopPoints:IStopPoint[]) => {
      this.stopPointsList = stopPoints;
      this.loading = false;
    });
  }

  onStopPointSelected(event, field, timeSelection) {

    console.log(this.currentSelected);
    const commitmentTime = this.programForm.controls['time'].value;
    console.log(commitmentTime);
    const program = this.programForm.controls['program'].value;
    const selector = field;
    let time = '';
    if(program == 'M') {
      if(selector == 'stopBeginName') {
        time = 'stopBeginHourT';
      } else {
        time = 'stopEndHourT';
      }
    } else {
      if(selector == 'stopEndName') {
        time = 'stopBeginHourT';
      } else {
        time = 'stopEndHourT';
      }
    }
    
    console.log(commitmentTime, program, event, field, time);
    
    if (event) {
      const recordArray = _.filter(this.stopPointsList, s => {
        return s.id == event;
      });
      const record = recordArray[0];
      
      console.log(record);
      let round = this.programForm.controls['round'].value;
      console.log(round);
      this.programForm.controls[field].setValue(record.name);

      // if( this.programForm.get('stopBeginHour').value == '' || this.programForm.get('stopEndHour').value == '') {
      //   return this.notification.create(
      //     'error',
      //     'Problema con la información',
      //     'No están definidos los tiempos entre paradas de esta ruta para el turno seleccionado'
      //   );
      // }

      switch (round) {
        case 'Día':
          this.programForm.controls[time].setValue(addMinutes(commitmentTime, record.round1MinutesSinceStart));
          break;
        case 'Tarde':
          this.programForm.controls[time].setValue(addMinutes(commitmentTime, record.round2MinutesSinceStart));
          break;
        case 'Noche':
          this.programForm.controls[time].setValue(addMinutes(commitmentTime, record.round3MinutesSinceStart));
          break;
        default:
          this.programForm.controls[time].setValue(addMinutes(commitmentTime, record.round1MinutesSinceStart));
          break;
      }
    }
  }

  onVendorSelected(event, field) {
    if (event) {
      const recordArray = _.filter(this.vendorsList, s => {
        return s.id == event;
      });
      const record = recordArray[0];
      console.log(record);
      this.programForm.controls[field].setValue(record.name);
    }
  }
}
