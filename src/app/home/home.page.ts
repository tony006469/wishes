import { Component, OnInit } from '@angular/core';
import { Appointment } from '../shared/Appointment';
import { AppointmentService } from './../shared/appointment.service';
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {
  Bookings = [];
  Result = [];
  public searchControl: FormControl;

  constructor(
    private aptService: AppointmentService
  ) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
    this.fetchBookings();
    let bookingRes = this.aptService.getBookingList();
    bookingRes.snapshotChanges().subscribe(res => {
      this.Bookings = [];
      res.reverse().forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.Bookings.push(a as Appointment);
        this.Result = this.Bookings;
      })
    });
    this.setFilteredItems("");
    this.searchControl.valueChanges
      .pipe(debounceTime(1000))
      .subscribe(search => {
        console.log(search)
        this.setFilteredItems(search);
      });
  }

  fetchBookings() {
    this.aptService.getBookingList().valueChanges().subscribe(res => {
      console.log(res)
    })
  }

  deleteBooking(id) {
    console.log(id)
    if (window.confirm('Do you really want to delete?')) {
      this.aptService.deleteBooking(id)
    }
  }

  setFilteredItems(search) {
    if (search===null){
      this.Result = this.Bookings
    }
    else{
    this.Result =  this.Bookings.filter(item => {
      return item.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });
    console.log(this.Result)
  }}
}