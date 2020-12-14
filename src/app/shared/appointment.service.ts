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

  // Create
  createBooking(apt: Appointment) {    
    return this.bookingListRef.push({
      serial_number: apt.serial_number,
      name: apt.name,
      email: apt.email,
      mobile: apt.mobile,
      address_number: apt.address_number,
      address: apt.address,
      money: apt.money,
      option: apt.option,
      create_date:apt.create_date,
      expired_date:apt.expired_date,
      other:apt.other,
      printed: false,
      order:this.order_number
    })
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
  updateBooking(id, apt: Appointment) {
    return this.bookingRef.update({
      serial_number: apt.serial_number,
      name: apt.name,
      email: apt.email,
      mobile: apt.mobile,
      address_number: apt.address_number,
      address: apt.address,
      money: apt.money,
      option: apt.option,
      create_date:apt.create_date,
      expired_date:apt.expired_date,
      other:apt.other
    })
  }

  // Delete
  deleteBooking(id: string) {
    this.bookingRef = this.db.object('/appointment/' + id);
    this.bookingRef.remove();
  }

  // Update sticker print state
  updatePrintState(id, apt: Appointment) {
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