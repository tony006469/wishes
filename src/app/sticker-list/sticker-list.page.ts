import { Component, OnInit } from '@angular/core';
import { Appointment } from '../shared/Appointment';
import { AppointmentService } from './../shared/appointment.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators} from "@angular/forms";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../../assets/fonts/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


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
    var docDefinition = {
      // a string or { width: number, height: number }
      pageSize: 'A4',
      // by default we use portrait, you can change it to landscape if you wish
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      //pageMargins: [ 40, 60, 40, 60 ],
      defaultStyle: {
        font: 'kaiu'
      }
      
    };

    console.log(this.checkBookings);
    var content = [];
      this.checkBookings.forEach(item =>{
        let text =  "\n" + item.name + "\n"  +  "奉獻祈禱意向\n" + item.option + "\n" + item.other + "\n" + item.create_date + "-" + item.expired_date ;
        let jobj = {
          width: "auto",
          text: text
        }
        content.push(jobj)
      })
      console.log(content)
      docDefinition["content"] = content
      pdfMake.fonts = {
        kaiu: {
          normal: 'kaiu.ttf',
          bold: 'kaiu.ttf',
          italics: 'kaiu.ttf',
          bolditalics: 'kaiu.ttf'
        }
      };
      pdfMake.createPdf(docDefinition).open();
  }
}