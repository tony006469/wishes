import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AppointmentService } from './../shared/appointment.service';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './edit-appointment.page.html',
  styleUrls: ['./edit-appointment.page.scss'],
})
export class EditAppointmentPage implements OnInit {
  updateBookingForm: FormGroup;
  id: any;

  constructor(
    private aptService: AppointmentService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.aptService.getBooking(this.id).valueChanges().subscribe(res => {
      this.updateBookingForm.setValue(res);
    });
  }

  ngOnInit() {
    this.updateBookingForm = this.fb.group({
      serial_number: [''],
      name: [''],
      email: [''],
      mobile: [''],
      address_number: [''],
      address: [''],
      money: [''],
      option: [''],
      other:[''],
      create_date:[''],
      expired_date:[''],
      order:[''],
      printed:[''],
    })
    console.log(this.updateBookingForm.value)
  }

  updateForm() {
    var createDate = this.updateBookingForm.controls['create_date'].value
    var expireDate = this.updateBookingForm.controls['expired_date'].value
    var startDate = formatDate(createDate, 'yyyy/MM/dd', 'en-US')
    var endDate = formatDate(expireDate, 'yyyy/MM/dd', 'en-US')
    this.updateBookingForm.controls['create_date'].setValue(startDate)
    this.updateBookingForm.controls['expired_date'].setValue(endDate)

    if (!this.updateBookingForm.valid) {
      return false;
    } else {
      this.aptService.updateBooking(this.id, this.updateBookingForm.value)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch(error => console.log(error));
    }    
  }
}
