import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomersService } from '../../services/customers.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payee',
  templateUrl: './payee.component.html',
  styleUrls: ['./payee.component.css']
})

export class PayeeComponent implements OnInit {

  validateForm: UntypedFormGroup;
  checked = false;
  lastPurchase: any;
  loadingLastPurchase = true;

  formatterPercent = (value: number) => `${value} %`;
  parserPercent = (value: string) => value.replace(' %', '');
  formatterDollar = (value: number) => `$ ${value}`;
  parserDollar = (value: string) => value.replace('$ ', '');

  memberList = [
    {
      name: 'Erin Gonzales',
      avatar: 'assets/images/avatars/thumb-1.jpg'
    },
    {
      name: 'Darryl Day',
      avatar: 'assets/images/avatars/thumb-2.jpg'
    },
    {
      name: 'Marshall Nichols',
      avatar: 'assets/images/avatars/thumb-3.jpg'
    },
    {
      name: 'Virgil Gonzales',
      avatar: 'assets/images/avatars/thumb-4.jpg'
    },
    {
      name: 'Riley Newman',
      avatar: 'assets/images/avatars/thumb-6.jpg'
    },
    {
      name: 'Pamela Wanda',
      avatar: 'assets/images/avatars/thumb-7.jpg'
    }
  ];

  taskList = [
    {
      task: 'Irish skinny, grinder affogato',
      checked: false
    },
    {
      task: 'Let us wax poetic about the beauty of the cheeseburger.',
      checked: false
    },
    {
      task: 'I\'m gonna build me an airport',
      checked: false
    },
    {
      task: 'Efficiently unleash cross-media information',
      checked: true
    },
    {
      task: 'Here\'s the story of a man named Brady',
      checked: true
    },
    {
      task: 'Bugger bag egg\'s old boy willy jolly',
      checked: true
    },
    {
      task: 'Hand-crafted exclusive finest tote bag Ettinger',
      checked: true
    },
    {
      task: 'I\'ll be sure to note that in my log',
      checked: true
    }
  ];

  fileList = [
    {
      name: 'Mockup.zip',
      size: '7 MB',
      type: 'zip'
    },
    {
      name: 'Guideline.doc',
      size: '128 KB',
      type: 'doc'
    },
    {
      name: 'Logo.png',
      size: '128 KB',
      type: 'image'
    }
  ];

  activityList = [
    {
      name: 'Virgil Gonzales',
      avatar: 'assets/images/avatars/thumb-4.jpg',
      date: '10:44 PM',
      action: 'Complete task',
      target: 'Prototype Design',
      actionType: 'completed'
    },
    {
      name: 'Lilian Stone',
      avatar: 'assets/images/avatars/thumb-8.jpg',
      date: '8:34 PM',
      action: 'Attached file',
      target: 'Mockup Zip',
      actionType: 'upload'
    },
    {
      name: 'Erin Gonzales',
      avatar: 'assets/images/avatars/thumb-1.jpg',
      date: '8:34 PM',
      action: 'Commented',
      target: '\'This is not our work!\'',
      actionType: 'comment'
    },
    {
      name: 'Riley Newman',
      avatar: 'assets/images/avatars/thumb-6.jpg',
      date: '8:34 PM',
      action: 'Commented',
      target: '\'Hi, please done this before tommorow\'',
      actionType: 'comment'
    },
    {
      name: 'Pamela Wanda',
      avatar: 'assets/images/avatars/thumb-7.jpg',
      date: '8:34 PM',
      action: 'Removed',
      target: 'a file',
      actionType: 'removed'
    },
    {
      name: 'Marshall Nichols',
      avatar: 'assets/images/avatars/thumb-3.jpg',
      date: '5:21 PM',
      action: 'Create',
      target: 'this project',
      actionType: 'created'
    }
  ];

  commentList = [
    {
      name: 'Lillian Stone',
      img: 'assets/images/avatars/thumb-8.jpg',
      date: '28th Jul 2018',
      // tslint:disable-next-line: max-line-length
      review: 'The palatable sensation we lovingly refer to as The Cheeseburger has a distinguished and illustrious history. It was born from humble roots, only to rise to well-seasoned greatness.'
    },
    {
      name: 'Victor Terry',
      img: 'assets/images/avatars/thumb-9.jpg',
      date: '28th Jul 2018',
      // tslint:disable-next-line: max-line-length
      review: 'The palatable sensation we lovingly refer to as The Cheeseburger has a distinguished and illustrious history. It was born from humble roots, only to rise to well-seasoned greatness.'
    },
    {
      name: 'Wilma Young',
      img: 'assets/images/avatars/thumb-10.jpg',
      date: '28th Jul 2018',
      // tslint:disable-next-line: max-line-length
      review: 'The palatable sensation we lovingly refer to as The Cheeseburger has a distinguished and illustrious history. It was born from humble roots, only to rise to well-seasoned greatness.'
    }
  ];
  sub: any;
  id: any;
  user: any;
  routes: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.customersService.getUser(this.id).valueChanges().subscribe(item => {
        console.log(item);
        this.user = item;
        this.getLastPurchase(this.user.paymentId); // Shall change this name to purchaseId
      });
    });

    this.customersService.getRoutes().snapshotChanges().pipe(
      map(actions => actions.map( (a: any) => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe( (routes: any) => {
      this.routes = routes;
    });

    this.validateForm = this.fb.group({
      route: [null, [Validators.required]],
      round: [null, [Validators.required]],
      month: [8],
      paymentAmount: [1299, [Validators.required]]
    });
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  getLastPurchase(purchaseId) {
    this.customersService.getLastPurchase(purchaseId).valueChanges().subscribe( purchase => {
      this.lastPurchase = purchase;
      this.loadingLastPurchase = false;
    });
  }

}
