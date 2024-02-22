import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { _ } from 'ag-grid-community';
import { NzMessageService } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { CustomersService } from 'src/app/customers/services/customers.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { DashboardService } from 'src/app/shared/services/admin/dashboard.service';
import { MessageCenterService } from 'src/app/shared/services/messageCenter.service';
import { RoutesService } from 'src/app/shared/services/routes.service';

interface Person {
  id: string;
  name: string;
  token: string;
}

@Component({
  selector: 'app-shared-messageCenter',
  templateUrl: './messageCenter.component.html',
  styleUrls: ['./messageCenter.component.css']
})
export class MessageCenterComponent implements OnInit {
  stopSubscription$: Subject<boolean> = new Subject();
  isShowDiv: boolean = false;
  isShowDivGroup: boolean = false;
  isShowDivRoutes: boolean = false;
  filllistRoutes: any[] = [];
  isShowDivCustomer: boolean = false;
  allChecked = false;
  indeterminate = true;
  listOfCustomer: any;
  listOfRoutes: any;
  listOfSelectedRoutes: any;
  isShowUsers: boolean = false;
  listOfUsers: any;
  listofUsersPreview: any[] = [];
  InputMessage: string = "";
  newMessage: string = "";
  listofRoutesByRound: any[] = [];
  IdCustomerLive: string = "";
  IdCustomerName: string = "";
  listofRecordsAfected: any[] = [];
  arrayPreview: any[] = [];
  listOfRound: any[] = [];
  listOfSelectedCustomer: any[] = [];
  accountId$ = new Subject<string>();
  routeId$ = new Subject<string>();
  routes: any[] = [];
  ListofUsersIDs: any[] = [];
  FinalList: any[] = [];


  checkOptionsUnit = [
    { label: 'Unidad', value: 'Unidad', checked: false },
    { label: 'Todas las Unidades', value: 'allUnit', checked: false }
  ];
  checkOptionsRoute = [
    { label: 'De 1 a 10 Rutas', value: 'Route', checked: false },
    { label: 'Todas las Rutas', value: 'allRoutes', checked: false }
  ];

  chekOptionsRound = [
    { label: 'Día', value: 'Día', checked: false },
    { label: 'Tarde', value: 'Tarde', checked: false },
    { label: 'Noche', value: 'Noche', checked: false }
  ];

  constructor(private accountsService: AccountsService,
    private routeService: RoutesService,
    private customerService: CustomersService,
    private afs: AngularFirestore,
    private messageCenterService: MessageCenterService,
    private dashboardService: DashboardService,
    private message: NzMessageService) { }

  ngOnInit() {
    this.accountsService.getAccounts().pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data }
      }))
    ).subscribe((accounts) => {
      this.listOfCustomer = accounts;
    });

    const routesObservable = this.accountId$.pipe(
      switchMap(accountId => this.afs.collection('customers').doc(accountId)
        .collection('routes', ref => ref.where('active', '==', true))
        .valueChanges({ idField: 'routeId' })
      ));
    // subscribe to changes
    routesObservable.subscribe((routes: any) => {
      this.routes = routes;
    });
  }

  log(value: object[]): void {
    console.log(value);
  }

  updateSingleCheckedRoute() {
    let itemCustomer = this.IdCustomerLive;
    this.filllistRoutes = [];
    this.listOfRoutes = [];
    if (itemCustomer.length > 0) {
      this.accountId$.next(itemCustomer);
    } else {
      this.checkOptionsRoute.forEach(item => {
        item.checked = false;
      });
      this.createMessage('error', 'No has seleccionado un cliente.');
    }
  }

  sendMessage() {

    if (this.InputMessage) {
      if (this.FinalList.length > 0) {
        // Send message to selected users.

        this.FinalList.forEach(eachUserMessage => {
          let userNotificationToken=  eachUserMessage.token || '';
          
         //console.log(userNotificationToken);
          if (userNotificationToken){
            // console.log('token payload created: ', JSON.stringify(eachUserMessage.token));
            const dataMessage = {
              createdAt: new Date(),
              from: 'FyXKSXsUbYNtAbWL7zZ66o2f1M92',
              fromName: 'Bus2U Informa General',
              msg: this.InputMessage,
              requestId: 'suhB7YFAh6PYXCRuJhfD',
             // token: 'dXf-sDaPH4U:APA91bGiTZ1H8jzNXEexZW65A8QUzNOqV77-vKquP6qZ535IyWWQ7m0PUFCI-3g-qXRvrvuo8-VJgkwF317YHegZh6oNUCHlylU1PoA_aM_5bJw44xNUChtV1sO30ge4VSx6MK2InIzr',//eachUserMessage.token,
             // uid: 'RgNnO7ElJgdThoKh8rUvrpb2EhH2',//
              token: eachUserMessage.token,//'dXf-sDaPH4U:APA91bGiTZ1H8jzNXEexZW65A8QUzNOqV77-vKquP6qZ535IyWWQ7m0PUFCI-3g-qXRvrvuo8-VJgkwF317YHegZh6oNUCHlylU1PoA_aM_5bJw44xNUChtV1sO30ge4VSx6MK2InIzr',//eachUserMessage.token,
              uid: eachUserMessage.uid,
              email: eachUserMessage.email,
              title: 'Bus2U Informa General',
              body: this.InputMessage
            }
            const notifMessage = {
              timestamp: new Date(),
              title: 'Bus2U Informa General',
              email: eachUserMessage.email,
              body: this.InputMessage,
              token: eachUserMessage.token,//'dXf-sDaPH4U:APA91bGiTZ1H8jzNXEexZW65A8QUzNOqV77-vKquP6qZ535IyWWQ7m0PUFCI-3g-qXRvrvuo8-VJgkwF317YHegZh6oNUCHlylU1PoA_aM_5bJw44xNUChtV1sO30ge4VSx6MK2InIzr',//eachUserMessage.token,
              uid:  eachUserMessage.uid //'RgNnO7ElJgdThoKh8rUvrpb2EhH2'
            }
            this.dashboardService.setChatMessage(dataMessage); 
            this.dashboardService.setMessage(notifMessage,eachUserMessage.idUser);
            console.log(dataMessage);
          } else {
            console.log ('Null token :' + eachUserMessage.uid + "// " + eachUserMessage.name);
          }
         
        })
        this.createMessage('sucess', "Concluyo el envio");
      } else {
        this.createMessage('warning', 'Se tiene que seleccionar una ruta para envio de mensajes.');
      }
    } else {
      this.createMessage('warning', 'El campo mensaje no puede estar vacío.');
    }
  }

  updateSingleCheckedRound() {
    if (this.chekOptionsRound.every(item => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.chekOptionsRound.every(item => item.checked)) {
      this.allChecked = true;
    } else {
      this.chekOptionsRound.forEach(singlecheck => {
        if (singlecheck.checked) {

          this.arrayListAfterRound(singlecheck.value);
        }
      });
    }
  }

  updateAllChecked() {
    this.indeterminate = false;
    if (this.allChecked) {
      this.chekOptionsRound = this.chekOptionsRound.map(item => ({
        ...item,
        checked: true
      }));
      this.arrayListAfterRound('Día');
      this.arrayListAfterRound('Tarde');
      this.arrayListAfterRound('Noche');
    } else {
      this.chekOptionsRound = this.chekOptionsRound.map(item => ({
        ...item,
        checked: false
      }));
      this.listOfRound = [];
    }
  }

  arrayListAfterRound(round: string) {
    let singleItemChecked = this.checkOptionsRoute.find(res => res.value == 'Route');
    if (singleItemChecked.checked) {
      this.isShowDivRoutes = true;
    }
    const DuplicateRound = this.listOfRound.find(find => find.idRound == round);
    if (!DuplicateRound) {
      this.listOfRound.push({ idRound: round });
    }
  }

  applyFilter() {
    this.changesOverRoutesSelected();
    if (this.arrayPreview.length > 0) {

      this.listofRecordsAfected = [...this.arrayPreview];
      this.isShowUsers = true;

      this.ListofUsersIDs = [];
      console.log(this.listofRecordsAfected);
      this.listofRecordsAfected.forEach(singleRow => {
        this.messageCenterService.getUserByRouteRound(singleRow.round, singleRow.routeId).snapshotChanges().pipe(
          take(1),
          map(actions => {
            if (actions.toString()) {
              return actions.map(a => {
                const data = a.payload.doc.data() as any;
                const id = a.payload.doc.id;
                const path = a.payload.doc.ref.parent.path as any;
                const pathArray = path.split('/');
                const VuserID = pathArray[1];
             //  console.log({id, ...data, VuserID });
                return { id, ...data, VuserID };
              });
            } else {
              return false;
            }
          }),
          tap((userF) => {
            if (userF) {
              this.userFillFinal(userF);
            }
          })
        ).subscribe();
      });
    } else {
      this.createMessage('warning', 'No se ha seleccionado un filtro a agregar, favor de validar.');
    }
  }

  changesOverRoutesSelected() {
    let singleItemChecked = this.checkOptionsRoute.find(res => res.value == 'Route');
    if (singleItemChecked.checked) {
      //singleRoute
      const eachRoute = this.listOfSelectedRoutes;
      const recordArray = _.filter(this.routes, r => {
        return r.routeId == this.listOfSelectedRoutes;
      });
      const record = recordArray[0];
      if (record) {
        if (this.listOfRound.length > 0) {
          this.listOfRound.forEach(sRound => {
            const DuplicateAddRecord = this.listofRecordsAfected.find(duplicate => duplicate.routeId == eachRoute &&
              duplicate.customerId == record.customerId &&
              duplicate.round == sRound.idRound);
            if (!DuplicateAddRecord) {
              this.arrayPreview.push({
                customerName: record.description,
                routeId: eachRoute,
                customerId: record.customerId,
                round: sRound.idRound,
                routeName: record.name
              });
            } 
          });
        } else {
          this.createMessage('warning', 'No se ha seleccionado un turno a elegir, favor de validar');
        }
      }
    } else {
      //all routes selected
      this.routes.forEach (singleRow => {
        if (this.listOfRound.length > 0) {
          this.listOfRound.forEach(sRound => {
            const DuplicateAddRecord = this.listofRecordsAfected.find(duplicate => duplicate.routeId == singleRow.routeId &&
              duplicate.customerId == singleRow.customerId &&
              duplicate.round == sRound.idRound);
            if (!DuplicateAddRecord) {
              this.arrayPreview.push({
                customerName: singleRow.description,
                routeId: singleRow.routeId,
                customerId: singleRow.customerId,
                round: sRound.idRound,
                routeName: singleRow.name
              });
            } else {
              this.createMessage('warning', 'Ya existe un registro con este criterio');
            }
          });
        } else {
          this.createMessage('warning', 'No se ha seleccionado un turno a elegir, favor de validar');
        }
      });
    }
  }

  userFillFinal(responseFill: any) {
    responseFill.forEach(element => {
      // call the token and id per row
      const findUser = this.ListofUsersIDs.find(find => find.idUser == element.VuserID && find.round == element.round);
      if (!findUser) {
        this.ListofUsersIDs.push({
          idUser: element.VuserID,
          routeId: element.routeId,
          customer_id: element.customer_id,
          round: element.round
        });
      }
    });

    console.log('list of users sum: ' + this.ListofUsersIDs.length);
    // step 2 process the token and user 
    this.ListofUsersIDs.forEach(User => {

      this.customerService.getUser(User.idUser).valueChanges().subscribe(item => {
        const findUserToken = this.FinalList.find(find => find.token == item.token && find.uid == item.uid);
        if (!findUserToken) {
          this.FinalList.push({ token: item.token, uid: item.uid, email: item.email , idUser: User.idUser})
        }
      });

    });
    //console.log(this.FinalList);
  }

  ngOnDestroy() {
    this.stopSubscription$.next();
    this.stopSubscription$.complete();

  }

  sendGeneralMessage() {
    //pending phase 2 
  }

  changesOverClient(event: any, customer: any) {

    const customerNameFound = customer.find(cust => cust.id = event);
    this.listOfRound = [];
    this.IdCustomerLive = event;
    this.IdCustomerName = customerNameFound.name;
    this.chekOptionsRound.forEach(item => {
      item.checked = false;
    });
    if (this.listofRecordsAfected.length < 0) {
      this.isShowUsers = false;
    }
    this.listOfUsers = [];
    this.listofUsersPreview = [];
    this.isShowDivRoutes = false;
    this.updateSingleCheckedRoute();

  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }

  Cancel() {
    this.listOfSelectedCustomer = null;
    this.isShowDivRoutes = false;
    this.isShowUsers = false;
    this.listOfUsers = [];
    this.listofUsersPreview = [];
    this.chekOptionsRound.forEach(item => {
      item.checked = false;
    });
    this.arrayPreview = [];
    this.checkOptionsRoute.forEach(item => {
      item.checked = false;
    });
    this.ListofUsersIDs = [];
    this.listOfRound = [];
    this.InputMessage = "";
  }
}
