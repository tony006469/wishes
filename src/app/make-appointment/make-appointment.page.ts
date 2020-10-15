import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { AppointmentService } from './../shared/appointment.service';

@Component({
  selector: 'app-make-appointment',
  templateUrl: './make-appointment.page.html',
  styleUrls: ['./make-appointment.page.scss'],
})
export class MakeAppointmentPage implements OnInit {
  bookingForm: FormGroup;

  constructor(
    private aptService: AppointmentService,
    private router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.bookingForm = this.fb.group({
      name: [''],
      email: [''],
      mobile: [''],
      address_number: [''],
      address: [''],
      money: [''],
      create_date:[''],
      expired_date:[''],
      option: [''],
      other:['']
    })
  }

  formSubmit() {
    var during_date = Math.ceil(this.bookingForm.controls['money'].value)
    var nowDate = new Date()
    // TODO: need to caculate during date
    console.log(this.bookingForm.value)
    this.bookingForm.controls['create_date'].setValue(nowDate.toLocaleDateString())
    this.bookingForm.controls['expired_date'].setValue(nowDate.toLocaleDateString())

    if (!this.bookingForm.valid) {
      return false;
    } else {
      this.aptService.createBooking(this.bookingForm.value).then(res => {
        console.log(res)
        this.bookingForm.reset();
        this.router.navigate(['/home']);
      })
        .catch(error => console.log(error));
    }
  }
}