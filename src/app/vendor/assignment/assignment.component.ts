import { Component, OnInit, OnDestroy } from '@angular/core';
import { TableService } from 'src/app/shared/services/table.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAssignment } from 'src/app/shared/interfaces/assignment.type';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { UsersService } from 'src/app/shared/services/users.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit, OnDestroy {

  allChecked: boolean = false;
  indeterminate: boolean = false;
  search: any;
  displayData = [];
  recordId: string = 'bKLBasJLckghzlqhbjIx';
  user: any;
  stopSubscriptions$:Subject<boolean> = new Subject();
  vendorRoutesSubscription: Subscription;
  vendorRoutesList: any[] = [];
  customersList: any[] = [];
  loading:boolean = true;
  objectForm: UntypedFormGroup;

  assignmentsList: IAssignment[];
  isVisible: boolean = false;
  isOkLoading: boolean = false;

  constructor(
    private tableSvc: TableService,
    private usersService: UsersService,
    private authService: AuthenticationService,
    private fb: UntypedFormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.authService.user.subscribe( (user:any) => {
      this.user = user;
      this.getSubscriptions(user.vendorId);
    })
  }

  ngOnDestroy(): void {
    this.stopSubscriptions$.next();
    this.stopSubscriptions$.complete();
    
  }

  createForm() {
    this.objectForm = this.fb.group({
      customerName: ['', Validators.required],
      customerId: ['', Validators.required],
      routeName: ['', Validators.required],
      routeId: ['', Validators.required],
      vehicleName: ['', Validators.required],
      vehicleId: ['', Validators.required],
      driverName: ['', Validators.required],
      driverId: ['', Validators.required],
      active: [true, Validators.required],
      deleted: ['', Validators.required],
      round: ['', Validators.required],
      program: ['', Validators.required],
      type: ['', Validators.required],
      vehicleType: ['', Validators.required],
      isSunday: [false, Validators.required],
      isMonday: [false, Validators.required],
      isTuesday: [false, Validators.required],
      isWednesday: [false, Validators.required],
      isThursday: [false, Validators.required],
      isFriday: [false, Validators.required],
      isSaturday: [false, Validators.required]
    })
  }

  showModal() {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  getSubscriptions(vendorId: string) {
    this.vendorRoutesSubscription = this.usersService.getBoardingPassesByRoute(vendorId).pipe(
      takeUntil(this.stopSubscriptions$)
    ).subscribe(data => {
      console.log(data);
      this.createNestedTableData(data);
    })
  }

  createNestedTableData(data: any) {
    this.vendorRoutesList = [];
    console.log(data);
    this.customersList = [] = _.chain(data).map('customerName').uniq().value();
    console.log(this.customersList);

    for (let i = 0; i < data.length; ++i) {
      data[i].routeName = data[i].passes[0].routeName;
      data[i].routeId = data[i].passes[0].routeId;
    }
    console.log(data);
    this.vendorRoutesList = data;
  }

  sort(sortAttribute: any) {
    this.displayData = this.tableSvc.sort(sortAttribute, this.assignmentsList);
  }

  currentPageDataChange($event: Array<{
    id: number;
    name: string;
    avatar: string;
    date: string;
    amount: number;
    status: string;
    checked: boolean;
  }>): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      data.checked = value;
    });
    this.refreshStatus();
  }

}
