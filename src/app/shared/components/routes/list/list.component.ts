import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { RoutesService } from 'src/app/shared/services/routes.service';
import { IRoute, IStopPoint } from '../../../interfaces/route.type';
@Component({
  selector: 'app-shared-routes-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class SharedRoutesListComponent implements OnInit, OnDestroy {

  @Input() accountId: string = '';

  sub: Subscription;
  tabs: Array<{ name: string; content: string }> = [];
  nzTabPosition = 'top';
  selectedIndex = 0;
  routesList: IRoute[] = [];
  stopPointsList: IStopPoint[] = [];
  objectForm: UntypedFormGroup;

  constructor(
    private modalService: NzModalService,
    public messageService: NzMessageService,
    public routesService: RoutesService,
    private fb: UntypedFormBuilder) {

  }

  ngOnInit() {
    this.createForm();
    this.getSubscriptions();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  createForm() {
    this.objectForm = this.fb.group({
      active: [false, [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: [''],
      kmzUrl: [''],
      name: ['', [Validators.minLength(5), Validators.maxLength(20), Validators.required]],
      routeId: [''],
      customerId: ['', [Validators.required]],
      customerName: ['']
    });
  }

  resetForm() {
    this.objectForm.reset({
      active: false,
      description: '',
      imageUrl: '',
      kmzUrl: '',
      name: '',
      routeId: '',
      customerId: '',
      customerName: ''
    });
  }

  addNewRoute(newProjectContent: TemplateRef<{}>) {
    const modal = this.modalService.create({
      nzTitle: 'Nueva Ruta',
      nzContent: newProjectContent,
      nzFooter: [
        {
          label: 'Crear Ruta',
          type: 'primary',
          onClick: () => this.modalService.confirm({
            nzTitle: '¿Está la información completa?',
            nzOnOk: () => {
              this.objectForm.get('customerId').setValue(this.accountId);
              console.log(this.objectForm.value)
              console.log(this.objectForm.valid)
              if (this.objectForm.valid) {
                console.log(this.objectForm.value);
                this.routesService.setRoute(this.accountId, this.objectForm.value)
                  .then(() => {
                    this.modalService.closeAll();
                  }).catch(err => console.log(err));
              }
            }
          }
          )
        },
      ],
      nzWidth: 500
    })
  }

  getSubscriptions() {
    console.log(this.accountId);
    this.sub = this.routesService.getRoutes(this.accountId).pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as IRoute;
        return { id:id, ...data }
      }))
    ).subscribe((routes: IRoute[]) => {
      this.routesList = routes;
      console.log(this.routesList);
      routes.forEach( (route) => {
        this.tabs.push({
          name: route.name,
          content: `Content of tab ${route.name}`
        });
      })
    });
  }

}
