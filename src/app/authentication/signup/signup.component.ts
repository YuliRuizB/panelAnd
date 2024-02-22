import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { TermsComponent } from 'src/app/shared/template/terms/terms.component';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit {

  signUpForm: UntypedFormGroup;
  isLoadingOne = false;

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.signUpForm.controls) {
      this.signUpForm.controls[i].markAsDirty();
      this.signUpForm.controls[i].updateValueAndValidity();
    }

    if (this.signUpForm.valid) {
      this.isLoadingOne = true;
      this.authService.signUp(this.signUpForm.value).then( (result) => {
        this.isLoadingOne = false;
      });
    }
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.signUpForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.signUpForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NzModalService,
    public authService: AuthenticationService
  ) {
  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.pattern('^[A-Za-z0-9 ]+$')]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      fullName: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(50)]],
      phoneNumber: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]+')]],
      studentId: [null, [Validators.required,
      Validators.minLength(7),
      Validators.maxLength(7),
      Validators.pattern('[0-9]+')]],
      agree: [null]
    });
  }

  showModalTerms() {
    this.modalService.create({
      nzTitle: 'Términos y Condiciones de Uso',
      nzContent: TermsComponent
    });
  }
}
