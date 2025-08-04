import { Injectable } from '@angular/core';
import { Appointment } from '../shared/Appointment';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {
  bookingListRef: AngularFireList<any>;
  bookingRef: AngularFireObject<any>;
  order_number:any;  

  constructor(private db: AngularFireDatabase) { 
    firebase.database().ref("number/order").on('value', (snapshot) => {
      this.order_number = snapshot.val();
    });
  }

  private sanitizeAppointmentData(apt: any): any {
    const requiredFields = {
      serial_number: '',
      name: '',
      email: '',
      mobile: '',
      address_number: '',
      address: '',
      money: '',
      create_date: '',
      expired_date: '',
      option: '',
      other: '',
      printed: false,
      order: this.order_number
    };


    let optionValue: string[] | string = '';
    if (apt.option) {
      if (Array.isArray(apt.option)) {
        optionValue = apt.option;
      } else if (typeof apt.option === 'string' && apt.option.trim() !== '') {
        optionValue = [apt.option];
      }
    }

    const sanitizedData = {
      ...requiredFields,
      ...apt,
      option: optionValue
    };

    Object.keys(sanitizedData).forEach(key => {
      if (key !== 'option' && typeof sanitizedData[key] === 'string' && (sanitizedData[key] === null || sanitizedData[key] === undefined)) {
        sanitizedData[key] = '';
      }
    });
    return sanitizedData;
  }

  // Create
  createBooking(apt: Appointment) {    
    const sanitizedData = this.sanitizeAppointmentData(apt);
    return this.bookingListRef.push(sanitizedData);
  }
  // Get Single
  getprint(id: string) {
    this.bookingListRef = this.db.list('/appointment/' + id);
    return this.bookingListRef;
  }
  // Get Single
  getBooking(id: string) {
    this.bookingRef = this.db.object('/appointment/' + id);
    return this.bookingRef;
  }

  // Get List
  getBookingList() {
    this.bookingListRef = this.db.list('/appointment', ref => {
      return ref.orderByChild("order")
    })
    return this.bookingListRef;
  }

  getExpireBookingList(){
    this.bookingListRef = this.db.list('/appointment', ref => {
      return ref.orderByChild("expired_date").limitToFirst(1000)
    })
    return this.bookingListRef
  }

  // Update
  updateBooking(id: string, apt: Appointment) {
    const sanitizedData = this.sanitizeAppointmentData(apt);
    delete sanitizedData.order;
    return this.bookingRef.update(sanitizedData);
  }

  // Delete
  deleteBooking(id: string) {
    this.bookingRef = this.db.object('/appointment/' + id);
    this.bookingRef.remove();
  }

  // Update sticker print state
  updatePrintState(id: string, apt: Appointment) {
    this.bookingRef = this.db.object('/appointment/' + id);
    return this.bookingRef.update({
      printed: true
    })
  }

  updateOrder(order_number) {
    var newOrder = { order: order_number }
    firebase.database().ref("number/").update(newOrder)
  }
}