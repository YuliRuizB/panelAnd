import { Component, OnInit, TemplateRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { VendorService } from 'src/app/shared/services/vendor.service';
import { map } from 'rxjs/operators';
import { IVendor } from 'src/app/shared/interfaces/vendor.type';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  view: string = 'cardView';
  newProject: boolean = false;
  vendorList: IVendor[] = [];
  objectForm: UntypedFormGroup;

  constructor(private modalService: NzModalService, private vendorService: VendorService, private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.getSubscriptions();
    this.createForm();
  }

  createForm() {
    this.objectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      legalName: ['', [Validators.required, Validators.minLength(10)]],
      primaryContact: ['', [Validators.required]],
      primaryEmail: ['', [Validators.email, Validators.required]],
      primaryPhone: ['', [Validators.required]],
      active: [false],
      deleted: [false],
      status: ['In Progress'],
      website: ['', [Validators.required]]
    });
  }

  getSubscriptions() {
    this.vendorService.getVendors().pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id: id, ...data }
      }))
    ).subscribe((vendors) => {
      console.log(vendors);
      this.vendorList = vendors;
    })
  }

  showNewProject(newProjectContent: TemplateRef<{}>) {
    const modal = this.modalService.create({
      nzTitle: 'Nuevo Transportista',
      nzContent: newProjectContent,
      nzFooter: [
        {
          label: 'Crear Transportista',
          type: 'primary',
          disabled: () => {
            return !this.objectForm.valid;
          },
          onClick: () => this.modalService.confirm(
            {
              nzTitle: '¿Está seguro de crearlo?',
              nzOnOk: () => {
                this.modalService.closeAll();
                this.submitForm();
              }
            }
          )
        },
      ],
      nzWidth: 800
    })
  }

  modalConfirmDelete(objectId: string) {
    this.modalService.confirm(
      {
        nzTitle: '¿Está seguro de eliminarlo?',
        nzOnOk: () => {
          this.modalService.closeAll();
          this.vendorService.deleteVendor(objectId);
        }
      }
    )
  }

  submitForm() {
    if(this.objectForm.valid) {
      this.vendorService.createVendor(this.objectForm.value);
    }
  }

}
