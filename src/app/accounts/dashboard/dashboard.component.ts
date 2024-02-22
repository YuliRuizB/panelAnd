import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { map } from 'rxjs/operators';
import { SummarizeService } from 'src/app/shared/services/summarize.service';
import { Subscription } from 'rxjs';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { UntypedFormBuilder, UntypedFormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  selectedRecord = false;
  accountsSubscription: Subscription;
  accountsList: any = [];
  summarizedSubscription: Subscription;
  summarized: any = [];
  userSubscription: Subscription;
  user: any;
  loading = true;
  isVisible = false;
  isDeleteVisible = false;
  isOkLoading = false;
  validateForm: UntypedFormGroup;

  constructor(
    private accountsService: AccountsService, 
    private authService: AuthenticationService,
    private summarizedService: SummarizeService,
    private message: NzMessageService,
    public modalService: NzModalService,
    private fb: UntypedFormBuilder
    ) { }

  ngOnInit() {
    this.userSubscription = this.authService.getUser().subscribe( (user) => {
      console.log(user);
      this.user = user;
    });
    this.getSubscriptions();

    this.validateForm = this.fb.group({
      name: [null, [Validators.minLength(5), Validators.maxLength(40), Validators.required]],
      address: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      website: [null, [Validators.required]],
      active: [false],
      canShowDevices: [true],
      showFromHour: [5],
      showToHour: [20]
    });
    
  }

  ngOnDestroy() {
    this.accountsSubscription.unsubscribe();
    this.summarizedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  submitForm(): void {
    this.isOkLoading = true;
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    
    const submitForm = this.accountsService.setAccount(this.validateForm.value);
    submitForm.then( (result) => {
      console.log(result);
      this.isVisible = false;
      this.isOkLoading = false;
    }).catch( err => console.log(err));

  }

  toggleAccountActive(accountId: string, active: boolean) {
    this.accountsService.toggleAccountActive(accountId, active);
  }

  deleteAccount(account: any) {
    this.isOkLoading = true;
    const deleteAccount = this.accountsService.deleteAccount(account.id);
    deleteAccount.then( (result) => {
      console.log(result);
      this.isOkLoading = false;
    }).catch( err => console.log(err));
  }

  getSubscriptions() {
    this.loading = true;
    this.accountsSubscription = this.accountsService.getAccounts().pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id: id, ...data }
      }))
    ).subscribe( (accounts) => {
      this.accountsList = accounts;
      this.loading = false;
      // this.createBasicMessage(accounts.length);
    });
    this.summarizedSubscription = this.summarizedService.getSummarized().subscribe( (summarized) => {
      this.summarized = summarized[0];
      console.log(summarized);
      this.loading = false;
    });
  }

  deleteAccountModal(account: any) {
    this.modalService.warning({
      nzTitle: '¿Está seguro?',
      nzContent: 'Eliminará toda la información de ' + account.name,
      nzCancelText: 'Cancelar',
      nzOkText: 'Eliminar',
      nzOkType: 'danger',
      nzOkLoading: this.isOkLoading,
      nzOnOk: () => {
        this.deleteAccount(account);
      },
      nzOnCancel: () => console.log('cancel')
    }); 
  }

  createBasicMessage(recordCount: number): void {
    this.message.success(`Se encontraron ${recordCount} registros.`, {
      nzDuration: 3000
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

}
