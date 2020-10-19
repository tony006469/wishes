import { Appointment } from '../shared/Appointment';
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from './../shared/appointment.service';
import { NodeWithI18n } from '@angular/compiler';
import { getLocaleDateTimeFormat } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-expire-list',
  templateUrl: './expire-list.page.html',
  styleUrls: ['./expire-list.page.scss'],
})
export class ExpireListPage implements OnInit {

  Outbookings = [];

  constructor(
    private aptService: AppointmentService
  ) { }

  ngOnInit() {

    let bookingRes = this.aptService.getBookingList();

    bookingRes.snapshotChanges().subscribe(res => {
      this.Outbookings = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
      
        let expire_date = moment(a['expired_date']);
        let now_date = moment()
        var diff_date = expire_date.diff(now_date, 'month')
        console.log(diff_date)
         if (diff_date <= 35){
          this.Outbookings.push( a as Appointment);
         };
      })
    })
  }
}
