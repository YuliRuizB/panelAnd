import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AccountsService } from 'src/app/shared/services/accounts.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class RouteEditComponent implements OnInit, OnDestroy {

  objectSubscription: Subscription;
  accountsList: any[] = [];
  stopSubscription$: Subject<any> = new Subject();
  accountId: any;
  routeId: any;
  routeElement: any = {};
  objectForm: UntypedFormGroup;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private routesService: RoutesService,
    private fb: UntypedFormBuilder
    ) { }

  ngOnInit() {
    this.objectSubscription = this.route.params.pipe(
      takeUntil(this.stopSubscription$)
    ).subscribe(params => {
      this.accountId = params['accountId']; // (+) converts string 'id' to a number
      this.routeId = params['routeId']; // (+) converts string 'id' to a number
      console.log(params);
      this.getSubscriptions();
      this.createForm();
    });
  }

  ngOnDestroy() {
    this.stopSubscription$.next();
    this.stopSubscription$.complete();
  }

  createForm() {
    this.objectForm = this.fb.group({
      active: [false, [ Validators.required ]],
      name: ['', [ Validators.required ]],
      description: [''],
      imageUrl: [''],
      kmzUrl: [''],
      routeId: ['', [ Validators.required ]],
      customerId: ['']
    })
  }

  patchForm(data) {
    this.objectForm.patchValue({
      active: data.active,
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      kmzUrl: data.kmzUrl,
      routeId: data.routeId,
      customerId: this.accountId
    });
  }

  saveForm() {
    
  }

  getSubscriptions() {
    this.routesService.getRoute(this.accountId, this.routeId).pipe(
      takeUntil(this.stopSubscription$),
      map(a => {
        const id = a.payload.id;
        const data = a.payload.data() as any;
        return { id, ...data }
      })
    )
    .subscribe( route => {
      console.log(route);
      this.patchForm(route);
      this.routeElement = route;
    })

    this.accountsService.getAccounts().pipe(
      takeUntil(this.stopSubscription$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data }
      }))
    )
    .subscribe( accounts => {
      console.log(accounts);
      this.accountsList = accounts;
    })
  }

  onCustomerChange(event) {

  }

}
