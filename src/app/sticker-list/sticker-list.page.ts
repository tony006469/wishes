import { Component, OnInit } from '@angular/core';
import { Appointment } from '../shared/Appointment';
import { AppointmentService } from './../shared/appointment.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators} from "@angular/forms";


@Component({
  selector: 'app-sticker-list',
  templateUrl: './sticker-list.page.html',
  styleUrls: ['./sticker-list.page.scss'],
})
export class StickerListPage implements OnInit {
  stickerForm: FormGroup
  Bookings = [];
  checkBookings = [ ];
  selectedArray :any = [];
  constructor(
    public fb: FormBuilder,
    private aptService: AppointmentService
  ) { }

  ngOnInit() {
    // initial stickerForm
    this.stickerForm = this.fb.group({
      serial_number: [''],
      name: [''],
      email: [''],
      mobile: [''],
      address: [''],
      create_date:[''],
      expired_date:[''],
      option: [''],
      other:[''],
      check: ['false', Validators.required]
    })
    

    let bookingRes = this.aptService.getBookingList();
    bookingRes.snapshotChanges().subscribe(res => {
      this.Bookings = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.Bookings.push(a as Appointment);
      })
    })
  }

  formSubmit(event, checkbox : String){
    if ( event.target.checked ) {
      this.checkBookings.push(checkbox);
    } else {
      let index = this.removeCheckedFromArray(checkbox);
      this.checkBookings.splice(index,1);
    }
    

  }
  //Removes checkbox from array when you uncheck it
  removeCheckedFromArray(checkbox : String) {
    return this.checkBookings.findIndex((category)=>{
      return category === checkbox;
    })
  }
  getCheckedBoxes() {
    //Do whatever
    console.log(this.checkBookings);
  }
}
