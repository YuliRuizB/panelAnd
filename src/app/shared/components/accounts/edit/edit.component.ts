import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-shared-account-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class SharedAccountEditComponent implements OnInit, OnDestroy {

  @Input('accountId') accountId: string;
  objectForm: UntypedFormGroup;
  stopSubscription$: Subject<boolean> = new Subject();
  loading: boolean = true;
  record;

  constructor(
    private accountsService: AccountsService,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
    this.getSubscription();
  }

  createForm() {
    this.objectForm = this.fb.group({
      active: [false, [Validators.required]],
      imageUrl: [''],
      address: [''],
      paymentResponsible: [1, [Validators.required]], // 0: Account, 1: User
      name: ['', [Validators.required]],
      socialName: [''],
      rfc: [''],
      addressNumber: [''],
      address2: [''],
      address3: [''],
      zip: [''],
      city: [''],
      state: [''],
      forceStopPoints: [true],
      forceRoute: [true],
      forceRound: [true],
      website: [''],
      phoneNumber: [''],
      primaryContact: ['']
    })
  }

  patchForm(record: any) {
    this.objectForm.patchValue({
      active: record.active || false,
      imageUrl: record.avatar || '',
      address: record.address || '',
      addressNumber: record.addressNumber || '',
      name: record.name || '',
      paymentResponsible: record.paymentResponsible || 1,
      socialName:record.socialName || '',
      rfc:record.rfc || '',
      address2:record.address2 || '',
      address3:record.address3 || '',
      zip:record.zip || '',
      city:record.city || '',
      state:record.state || '',
      forceStopPoints:record.forceStopPoints || true,
      forceRoute:record.forceRoute || true,
      forceRound:record.forceRound || true,
      website: record.website || '',
      phoneNumber: record.phoneNumber || '',
      primaryContact: record.primaryContact || ''
    });

  }

  ngOnDestroy() {
    this.stopSubscription$.next();
    this.stopSubscription$.complete();
  }

  getSubscription() {

    this.accountsService.getAccount(this.accountId).pipe(
      takeUntil(this.stopSubscription$),
      map(a => {
        const id = a.payload.id;
        const data = a.payload.data() as any;
        return { id, ...data }
      }),
      tap(record => {
        console.log(record);
        this.patchForm(record);
        this.record = record;
        this.loading = false;
        return record;
      })
    ).subscribe();
  }

  handleChange(event) {

  }

  onSubmit() {
    this.accountsService.updateAccount(this.accountId, this.objectForm.value).then(() => {
      console.log('ok')
    }, err => {
      console.log('err: ', err)
    }).catch((err) => console.log(err))
  }



}
