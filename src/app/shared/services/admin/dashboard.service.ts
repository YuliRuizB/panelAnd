import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { NzNotificationService } from 'ng-zorro-antd';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {

  documentPath = 'admin/dashboard';
  dashboardItems: any;

  constructor(
    private afs: AngularFirestore,
    private notification: NzNotificationService,
    private aff: AngularFireFunctions
  ) {
    this.dashboardItems = this.afs.doc<any>(this.documentPath).valueChanges();
  }

  getDashboardItems() {
    return this.dashboardItems;
  }

  sendtoDeviceMessage(infoToSend:any) {
    console.log('function');
       const sendFCMNotification =  this.aff.httpsCallable('sendToDeviseMessage');
       sendFCMNotification(infoToSend).toPromise().then((respone:any) => {
        console.log(respone);
      });
  }

  setChatMessage(data:object) {
    console.log(data);
    const key = this.afs.createId();
    //console.log('key '+ key );
    const sendChatMessage = this.afs.collection('chatMessages').doc(key);
    return sendChatMessage.set(data);
  }
  setMessage(data:object,idUser:string) {
    console.log(data);
   const key = this.afs.createId();
    //console.log('key '+ key );
    const sendMessage = this.afs.collection('users').doc(idUser).collection('messages').doc(key);
    return sendMessage.set(data);
  }

  getUserChatMessages(userId:string, limit?: number){
    console.log('userChatMessages:'+userId);
    return this.afs.collection('chatMessages', (ref) => 
    ref
    .where('uid', '==', userId)
   // .limit(limit).orderBy('createdAt')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data() as any;
        return { id, ...data }
      }))
    )
  }
}
