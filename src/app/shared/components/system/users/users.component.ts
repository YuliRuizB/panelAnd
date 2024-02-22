import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomersService } from 'src/app/customers/services/customers.service';
import { columnDefs, rowGroupPanelShow } from 'src/app/customers/classes/customers';
import { AngularFirestore } from '@angular/fire/firestore';
import { GridOptions } from 'ag-grid-community';

import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadChangeParam } from 'ng-zorro-antd/upload';

import { NgxCsvParser } from 'ngx-csv-parser';
import { NgxCSVParserError } from 'ngx-csv-parser';
import { map } from 'rxjs/operators';

import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-shared-system-users-list',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class SharedSystemUsersListComponent implements OnInit, OnDestroy {

  @Input() accountId: string = '';
  @Input() accountName: string = '';

  sub: Subscription;
  usersList: any = [];
  columnDefs = columnDefs;
  rowGroupPanelShow = rowGroupPanelShow;
  gridOptions: GridOptions = this.getGridOptions();
  popupParent: any;

  //Modal
  isVisible: boolean = false;
  isConfirmLoading: boolean = false;

  //Wizard
  current = 0;
  index = 'First-content';

  //Ngx CSV Parser
  csvRecords: any[] = [];
  header = true;
  isSavingUsers: boolean = false;
  isDone: boolean = false;
  validateForm: UntypedFormGroup;

  constructor(
    private usersService: CustomersService,
    private afs: AngularFirestore,
    private msg: NzMessageService,
    private ngxCsvParser: NgxCsvParser,
    private fb: UntypedFormBuilder
  ) {
    this.popupParent = document.querySelector("body");
  }

  ngOnInit() {
    this.createForm();
    this.getSubscriptions();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getSubscriptions() {
    this.sub = this.usersService.getAccountSystemUsers(this.accountId, 'customer').pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data }
      }))
    )
      .subscribe((users) => {
        this.usersList = users;
        console.log(this.usersList)
      });
  }

  createForm() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      role: [null, [Validators.required]]
    });
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  repairUsers() {
    this.usersList.forEach((user) => {

      const currentUserLocation = this.afs.doc(`/users/${user.id}`);
      const expectedUserLocation = this.afs.doc(`/users/${user.uid}`);

      if (user.uid == user.id) {
        console.log('skipped user: ', user);
      } else {
        expectedUserLocation.set(user, { merge: true }).then(() => {
          currentUserLocation.delete();
        });
      }

    });

  }

  getGridOptions() {
    return {
      columnDefs: columnDefs,
      context: {
        thisComponent: this
      },
      rowData: null,
      rowSelection: 'single',
      pagination: true,
      enableFilter: true,
      statusBar: {
        statusPanels: [
          { statusPanel: 'agFilteredRowCountComponent' },
          { statusPanel: 'agSelectedRowCountComponent' },
          { statusPanel: 'agAggregationComponent' }
        ]
      },
      enableRangeSelection: true,
      paginationPageSize: 20,
    };
  }

  getContextMenuItems(params) {
    var result = [
      {
        name: "Ver detalles de " + params.node.data.firstName,
        action: () => {
          console.log(params);
          let context = params.context.thisComponent;
          const notification = context.afs.collection('testFCM').doc(params.value);
          notification.set({ name: 'hola' });
        },
        icon: '<nz-avatar nzIcon="user"></nz-avatar>',
        cssClasses: ["redFont", "bold"]
      },

      "separator",
      {
        name: "Checked",
        checked: true,
        action: function () {
          console.log("Checked Selected");
        },
        icon: '<img src="../images/skills/mac.png"/>'
      },
      "copy",
      "separator"
    ];
    return result;
  }

  //Modal
  showModal(): void {
    this.isVisible = true;
    this.isDone = false;
    this.isSavingUsers = false;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isSavingUsers = false;
    this.isVisible = false;
    this.csvRecords = [];
    this.current = 0;
    this.isDone = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
    this.csvRecords = [];
    this.current = 0;
    this.isDone = false;
  }

  //Wizard
  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    this.isSavingUsers = true;
    this.usersService.createSystemUser(this.makeUserObject(this.validateForm.value)).then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    })
    this.isDone = true;
    this.isVisible = false;
    this.isSavingUsers = false;
  }

  makeUserObject(user: any) {
    let userObj = {
      _isEditMode: false,
      customerId: this.accountId,
      customerName: this.accountName,
      disabled: false,
      displayName: user.firstName + ' ' + user.lastName,
      email: user.email || '',
      emailVerified: false,
      firstName: user.firstName,
      lastName: user.lastName,
      lastUpdatedAt: new Date(),
      occupation: 'customer',
      paid: false,
      phone: user.phoneNumber,
      phoneNumber: user.phoneNumber,
      photoURL: '',
      roles: [user.role],
      studentId: user.employeeId || 'unspecified',
      uid: '',
      username: user.firstName,
      userRegisteredBy: 'fromSystem'
    }
    return userObj;
  }

  handleChange({ file, fileList }: UploadChangeParam): void {
    const status = file.status;
    if (fileList.length == 0) {
      this.csvRecords = [];
    }
    if (status !== 'uploading') {
      console.log(file, fileList, event);
    }
    if (status === 'done') {
      this.msg.success(`${file.name} Se ha cargado con éxito.`);
      console.log(file);
      this.parser(file.originFileObj);

    } else if (status === 'error') {
      this.msg.error(`${file.name} no ha podido ser cargado.`);
    }
  }

  parser(file: File) {
    setTimeout(() => {
      this.ngxCsvParser.parse(file, { header: this.header, delimiter: ',' })
        .pipe().subscribe((result: Array<any>) => {

          console.log('Result', result);
          this.csvRecords = result;
        }, (error: NgxCSVParserError) => {
          console.log('Error', error);
        });
    }, 100);

  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }

}