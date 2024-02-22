import { Component, OnInit, Input } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'app-shared-stoppoints-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class SharedStopPointsNewComponent implements OnInit {

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
      active: [false, [ Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      latitude: [1, [Validators.required]],
      longitude: [1, [Validators.required]],
      imageUrl: [''],
      kmzUrl: [''],
      order: [0, [Validators.required]],
      round1: ['', [Validators.required]],
      round2: ['', [Validators.required]],
      round3: ['', [Validators.required]],
      round1MinutesSinceStart: ['', [Validators.required]],
      round2MinutesSinceStart: ['', [Validators.required]],
      round3MinutesSinceStart: ['', [Validators.required]]
    });
  }

  ngOnDestroy() {

  }

  destroyModal(): void {
    this.modal.destroy({ data: this.validateForm.value });
  }

}
