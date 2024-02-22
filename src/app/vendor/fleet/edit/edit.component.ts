import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import { Subscription, Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UploadFile } from 'ng-zorro-antd';
import { map, takeWhile, debounceTime, finalize, takeUntil, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { IVehicle } from 'src/app/shared/interfaces/vehicle.type';
import { VehiclesService } from 'src/app/shared/services/vehicles.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { DriversService } from 'src/app/shared/services/drivers.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class VehicleEditComponent implements OnInit, OnDestroy {

  objectForm: UntypedFormGroup;
  objectSubscription: Subscription;
  recordId: any;
  vendorId: any;
  driversList: any = [];
  selectedIndex: number = 0;
  record: any = {};
  avatarUrl: string = "http://themenate.com/applicator/dist/assets/images/avatars/thumb-13.jpg";
  selectedCountry: any;
  selectedLanguage: any;
  autosave: boolean = true;
  uploading: boolean = false;
  bucketPath: string = 'vendors/';

  // Upload Task 
  task: AngularFireUploadTask;
  // Progress in percentage
  uploadPercent: Observable<number>;
  uploadvalue: number = 0;
  downloadURL: Observable<string>;
  // Snapshot of uploading file
  snapshot: Observable<any>;
  // Uploaded File URL
  UploadedFileURL: Observable<string>;
  //Uploaded Image List
  images: Observable<any[]>;
  user: any;
  stopSubscriptions$: Subject<boolean> = new Subject();

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private vehicleService: VehiclesService,
    private bucketStorage: AngularFireStorage,
    private authService: AuthenticationService,
    private driversService: DriversService
  ) {
  }

  ngOnInit() {
    this.authService.user.pipe(
      takeUntil(this.stopSubscriptions$)
    ).subscribe(user => {
      this.user = user;
    });

    this.objectSubscription = this.route.params.pipe(
      takeUntil(this.stopSubscriptions$)
    ).subscribe(params => {
      this.recordId = params['vehicleid']; // (+) converts string 'id' to a number
      this.vendorId = params['accountid']; 
      this.bucketPath += this.recordId;
      this.getSubscriptions(this.vendorId);
    });
    this.createForm();

    // this.autoSave();
  }

  ngOnDestroy(): void {
    this.stopSubscriptions$.next();
    this.stopSubscriptions$.complete();
    this.autosave = false;
  }

  autoSave() {
    this.objectForm.statusChanges.pipe(
      debounceTime(2000),
      takeWhile(() => this.autosave)
    ).subscribe((values) => {
      if (this.objectForm.valid) {
        console.log('update values', values);
        this.vehicleService.updateVehicle(this.vendorId, this.recordId, this.objectForm.value);
      }
    })
  }

  createForm() {
    this.objectForm = this.fb.group({
      active: ['', [Validators.required]],
      name: ['', [Validators.required]],
      ac: [false],
      avatar: [''],
      carMaker: [''],
      chassis: [''],
      deviceId: [''],
      doors: ['', [Validators.required]],
      driver: [''],
      driverId: [''],
      emissions: [''],
      engineType: [''],
      fuelTankCapacity: [''],
      fuelType: [''],
      horsePower: [''],
      insuranceAgent: [''],
      insuranceValidFrom: [''],
      insuranceValidTo: [''],
      insuranceId: [''],
      insuranceAgentPhone: [''],
      lastService: [''],
      licensePlate: ['', [Validators.required]],
      model: [''],
      seats: ['', [Validators.required]],
      type: [''],
      vendor: [''],
      year: [''],
    })
  }

  patchForm(record: IVehicle) {
    this.objectForm.patchValue({
      active: record.active || false,
      ac: record.ac || false,
      name: record.name,
      avatar: record.avatar || '',
      carMaker: record.carMaker || '',
      chassis: record.chassis || '',
      deviceId: record.deviceId || '',
      disabled: record.disabled || false,
      doors: record.doors || 1,
      driver: record.driver || '',
      driverId: record.driverId || '',
      emissions: record.emissions || '',
      engineType: record.engineType || '',
      fuelTankCapacity: record.fuelTankCapacity || '',
      fuelType: record.fuelType || '',
      horsePower: record.horsePower || '',
      insuranceAgent: record.insuranceAgent || '',
      insuranceValidFrom: record.insuranceValidFrom || '',
      insuranceValidTo: record.insuranceValidTo || '',
      insuranceId: record.insuranceId || '',
      insuranceAgentPhone: record.insuranceAgentPhone || '',
      lastService: record.lastService || '',
      licensePlate: record.licensePlate || '',
      model: record.model || '',
      seats: record.seats || '',
      type: record.type || '',
      vendor: record.vendor || '',
      year: record.year || ''
    });
  }

  getSubscriptions(vendorId: string) {
    this.vehicleService.getVehicle(vendorId, this.recordId).pipe(
      takeUntil(this.stopSubscriptions$),
      map(a => {
        const id = a.payload.id;
        const data = a.payload.data() as any;
        return { id: id, ...data }
      })
    ).subscribe((vehicle: IVehicle) => {
      this.record = vehicle;
      this.patchForm(vehicle);
      console.log(this.record);
    })
    this.driversService.getDrivers(vendorId).pipe(
      takeUntil(this.stopSubscriptions$),
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id: id, ...data }
      }))
    ).subscribe((drivers: any) => {
      this.driversList = drivers;
      console.log(drivers);
    })
  }

  submitForm(): void {
    for (const i in this.objectForm.controls) {
      this.objectForm.controls[i].markAsDirty();
      this.objectForm.controls[i].updateValueAndValidity();
    }

    if(this.objectForm.valid) {
      this.vehicleService.updateVehicle(this.vendorId, this.recordId, this.objectForm.value);
    } else {
      
    }
  }

  private getBase64(img: File, callback: (img: {}) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file: File) => {
    return false;
  }

  handleChange(info: { file: UploadFile }): void {
    this.getBase64(info.file.originFileObj, (img: string) => {
      this.avatarUrl = img;
      console.log(img);
      const fileRef = this.bucketStorage.ref(this.bucketPath);

      this.task = this.bucketStorage.ref(this.bucketPath).putString(img, 'data_url');

      // observe percentage changes
      this.uploadPercent = this.task.percentageChanges();
      this.uploadPercent.pipe(
        map(a => {
          return Number((a / 100).toFixed(2));
        })
      ).subscribe((value) => {
        this.uploading = value != 0;
        this.uploadvalue = value;
      })

      // get notified when the download URL is available
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.uploading = false;
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(async (url) => {
            this.updatePhotoURL(url);
          });
        })
      ).subscribe();

    });
  }

  async updatePhotoURL(url) {
    
    console.log("started updatePhotoURL with url: ", url);
    this.objectForm.controls['avatar'].patchValue(url);
    this.vehicleService.updateVehicleAvatar(this.vendorId, this.recordId, url);
  }

}
