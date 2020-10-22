import { Injectable } from '@angular/core';
import { Appointment } from '../shared/Appointment';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})

export class AppointmentService {
  bookingListRef: AngularFireList<any>;
  bookingRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) { }

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
      other:apt.other
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
    this.bookingListRef = this.db.list('/appointment');
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
}