import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { AppointmentService } from './../shared/appointment.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-make-appointment',
  templateUrl: './make-appointment.page.html',
  styleUrls: ['./make-appointment.page.scss'],
})
export class MakeAppointmentPage implements OnInit {
  bookingForm: FormGroup;
  disable: Boolean

  constructor(
    private aptService: AppointmentService,
    private router: Router,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.disable = false;
    this.bookingForm = this.fb.group({
      serial_number: [''],
      name: [''],
      email: [''],
      mobile: [''],
      address_number: [''],
      address: [''],
      money: [''],
      create_date: [''],
      expired_date: [''],
      option: [''],
      other: ['']
    })
  }

  formSubmit() {
    // var during_date = Math.ceil(this.bookingForm.controls['money'].value/1000)
    // var nowDate = new Date()    
    // var expireDate = new Date(nowDate)
    // expireDate.setFullYear(expireDate.getFullYear()+during_date)
    // expireDate.setDate(expireDate.getDate()-1)    
    // var endDate = formatDate(expireDate, 'yyyy/MM/dd', 'en-US')
    // console.log(during_date)
    // console.log(nowDate.toLocaleDateString())
    // console.log(endDate)
    // this.bookingForm.controls['create_date'].setValue(nowDate.toLocaleDateString())
    // this.bookingForm.controls['expired_date'].setValue(endDate)       
    var createDate = this.bookingForm.controls['create_date'].value
    var expireDate = this.bookingForm.controls['expired_date'].value
    var startDate = formatDate(createDate, 'yyyy/MM/dd', 'en-US')
    var endDate = formatDate(expireDate, 'yyyy/MM/dd', 'en-US')
    this.bookingForm.controls['create_date'].setValue(startDate)
    this.bookingForm.controls['expired_date'].setValue(endDate)
    if (!this.bookingForm.valid) {
      return false;
    } else {
      if (!this.disable) {
        this.disable = true
        this.aptService.createBooking(this.bookingForm.value).then(res => {
          console.log(res)
          this.bookingForm.reset();
          this.aptService.order_number--;
          this.aptService.updateOrder(this.aptService.order_number);
          this.router.navigate(['/home']);
        })
          .catch(error => console.log(error));
        this.disable = false
      }
    }
  }
}