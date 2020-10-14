import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AppointmentService } from './../shared/appointment.service';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


import {jsPDF} from 'jspdf';
import domtoimage from 'dom-to-image';

@Component({
  selector: 'app-print-receipt',
  templateUrl: './print-receipt.page.html',
  styleUrls: ['./print-receipt.page.scss'],
})
export class PrintReceiptPage implements OnInit {
  id: any;
  address: any;
  address_number: any;
  email: any;
  mobile: any;
  money: any;
  name: any;
  option: any;
  constructor(
    private aptService: AppointmentService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.aptService.getprint(this.id).valueChanges().subscribe(res => {
      this.address=res[0];
      this.address_number=res[1];
      this.email=res[2];
      this.mobile=res[3];
      this.money=res[4];
      this.name=res[5];
      this.option=res[6];
      console.log(res);
    });
  }

  generatePdf(){
    const documentDefinition = { 
      content: [this.name,this.mobile,this.email,this.address,this.money,this.option],
      defaultStyle: {
        font: 'kaiu'
      } 
    };

    pdfMake.fonts = {
      kaiu: {
          normal: 'kaiu.ttf',
          bold: 'kaiu.ttf',
          italics: 'kaiu.ttf',
          bolditalics: 'kaiu.ttf'
      }
    };
    pdfMake.createPdf(documentDefinition).open();
  }



  exportPdf(){
    const div = document.getElementById('capture');
    const options = { background: 'white', height: 845, width: 595 };
    domtoimage.toPng(div, options).then((dataUrl) => {
        const doc = new jsPDF('p', 'mm', 'a4');
        doc.addImage(dataUrl, 'PNG', 0, 0, 210, 340);
        doc.save('pdfDocument.pdf');
    }
  )}


  exportPdf2(){
    const div = document.getElementById('capture');
    const scale = 750 / div.offsetWidth;
    const options = {
      background: 'white',
      height: div.offsetHeight * scale,
      width: div.offsetWidth * scale,
      style: {
        transform: "scale(" + scale + ")",
        transformOrigin: "top left",
        width: div.offsetWidth + "px",
        height: div.offsetHeight + "px" 
      }}

    domtoimage.toPng(div, options).then((dataUrl) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.addImage(dataUrl, 'PNG', 0, 0, 210, 340);
    doc.save('pdfDocument.pdf');
    }
  )}


  ngOnInit() {
  }
  
}
