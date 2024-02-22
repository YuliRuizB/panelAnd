import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-shared-stoppoints-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class SharedStopPointsEditComponent implements OnInit, OnDestroy {

  @Input() stopPoint: any;
  validateForm: UntypedFormGroup;
  
  constructor(private fb: UntypedFormBuilder, private modal: NzModalRef) { }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }


  ngOnInit() {
    
    this.validateForm = this.fb.group({
      active: [this.stopPoint.active],
      name: [this.stopPoint.name, [Validators.required]],
      description: [this.stopPoint.description, [Validators.required]],
      latitude: [this.stopPoint.geopoint.latitude, [Validators.required]],
      longitude: [this.stopPoint.geopoint.longitude, [Validators.required]],
      imageUrl: [this.stopPoint.imageUrl, [Validators.required]],
      kmzUrl: [this.stopPoint.kmzUrl, [Validators.required]],
      order: [this.stopPoint.order, [Validators.required]],
      round1: [this.stopPoint.round1, [Validators.required]],
      round2: [this.stopPoint.round2, [Validators.required]],
      round3: [this.stopPoint.round3, [Validators.required]],
      round1MinutesSinceStart: [this.stopPoint.round1MinutesSinceStart, [Validators.required]],
      round2MinutesSinceStart: [this.stopPoint.round2MinutesSinceStart, [Validators.required]],
      round3MinutesSinceStart: [this.stopPoint.round3MinutesSinceStart, [Validators.required]]
    });
  }

  ngOnDestroy() {

  }

  destroyModal(): void {
    this.modal.destroy({ data: this.validateForm.value });
  }

}
