import { Component, OnInit, OnDestroy, Input, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomersService } from 'src/app/customers/services/customers.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from 'src/app/shared/interfaces/product.type';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/shared/services/products.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-shared-products-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class SharedProductsListComponent implements OnInit, OnDestroy {

  @Input() accountId: string = '';

  view: string = 'cardView';
  sub: Subscription;
  productsList: Product[] = [];
  validateForm: UntypedFormGroup;

  constructor(
    private usersService: CustomersService,
    private afs: AngularFirestore,
    private modalService: NzModalService,
    public messageService: NzMessageService,
    private productsService: ProductsService,
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
    this.validateForm = this.fb.group({
      active: [false, [Validators.required]],
      category: [null, [Validators.required]],
      date_created: [new Date(), [Validators.required]],
      description: [null, [Validators.required]],
      isTaskIn: [true, [Validators.required]],
      isTaskOut: [true, [Validators.required]],
      name: [null, [Validators.required]],
      price: [0, [Validators.required]],
      timesSold: [0, [Validators.required]],
      type: [null, [Validators.required]],
      rangeDatePicker: [null],
      validFrom: [new Date(), [Validators.required]],
      validTo: [new Date(), [Validators.required]]
    });
  }

  resetForm() {
    this.validateForm.reset({
      active: false,
      date_created: new Date(),
      isTaskIn: true,
      isTaskOut: true,
      price: 0,
      timesSold: 0,
      validFrom: new Date(),
      validTo: new Date()
    });
  }

  mapDateValues(event: any) {
    if (event.length > 1) {
      this.validateForm.controls['validFrom'].patchValue(new Date(event[0]));
      this.validateForm.controls['validTo'].patchValue(new Date(event[1]));
    }
    console.log(this.validateForm.value);
    console.log(this.validateForm.valid);

  }

  submitForm() {
    if (this.validateForm.valid) {
      this.productsService.setProduct(this.accountId, this.validateForm.value).then(() => {
        this.resetForm();
        this.modalService.closeAll();
        this.messageService.success(`Todo salió bien.`, {
          nzPauseOnHover: true,
          nzDuration: 3000
        });
      })
    }
  }

  toggleActivateProduct(product: Product) {
    this.productsService.toggleProductActive(this.accountId, product.id, product.active);
  }

  getSubscriptions() {
    this.sub = this.usersService.getAccountProducts(this.accountId).pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as Product;
        return { id:id, ...data }
      }))
    ).subscribe((products: Product[]) => {
      this.productsList = products;
      console.log(this.productsList)
    });
  }
  
  deleteProduct(product:Product) {
    this.productsService.deleteProduct(this.accountId, product.id).then(() => {
      this.messageService.success(`El ${product.type} ${product.name} ha sido eliminado.`, {
        nzPauseOnHover: true,
        nzDuration: 3000
      });
    })
  }

  showNewModal(newContent: TemplateRef<{}>) {
    const modal = this.modalService.create({
      nzTitle: 'Nuevo Producto / Servicio',
      nzContent: newContent,
      nzFooter: [{
        label: 'Crear',
        type: 'primary',
        onClick: () => this.modalService.confirm(
          {
            nzTitle: '¿Está seguro?',
            nzOnOk: () => {
              this.submitForm();
            }
          }
        )
      },
      ],
      nzWidth: 800
    });
  }

}
