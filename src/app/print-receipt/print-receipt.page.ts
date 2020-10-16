import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AppointmentService } from './../shared/appointment.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../../assets/fonts/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


import { jsPDF } from 'jspdf';
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
  create_date: any;
  expired_date: any;
  constructor(
    private aptService: AppointmentService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.aptService.getprint(this.id).valueChanges().subscribe(res => {
      this.address = res[0];
      this.address_number = res[1];
      this.create_date = res[2]
      this.email = res[3];
      this.expired_date = res[4];
      this.mobile = res[5];
      this.money = res[6];
      this.name = res[7];
      this.option = res[8];
      console.log(res);
    });
  }

  generatePdf() {
    var today = new Date();
    const documentDefinition = {
      header: [
        {
          text: '財團法人天主教靈醫會 (聖嘉民朝聖地)',
          alignment: 'center',
          style: 'header'
        }
      ],
      content: [
        {
          columns: [
            {
              text: '          ',
              fontSize: 22
            },
            {
              text: '收據',
              alignment: 'center',
              fontSize: 22
            },
            {
              text: '聖嘉民__號',
              alignment: 'right',
              fontSize: 22
            },
          ], margin: [0, 5, 0, 10]
        },
        {
          text: '_________________________________________________________',
          style: 'line'
        },
        {
          text: '茲收到　　' + this.name + '　　君　　(連絡電話:' + this.mobile + ')',
          style: 'content'
        },
        {
          text: '地址：' + this.address,
          style: 'content'
        },
        {
          text: '金額：新台幣　　拾　　萬　　仟　　佰　　拾　　元整',
          style: 'content'
        },
        {
          text: '_________________________________________________________',
          style: 'line'
        },
        {
          text: '□平安燈　' + '' + '　盞自　' + this.create_date + '　起，迄　' + this.expired_date + '　止。',
          fontSize: 18,
          margin: [15, 5, 0, 5],
          width: '*'
        },
        {
          text: '奉獻者：',
          style: 'title'
        },
        {
          text: this.name,
          style: 'content2'
        },
        {
          text: '祈禱意向：',
          style: 'title'
        },
        {
          text: this.option,
          style: 'content2'
        },
        {
          text: '□其他：',
          style: 'title'
        },
        {
          text: '還不知道寫啥',
          style: 'content2'
        },
        {
          text: '_________________________________________________________',
          style: 'line'
        },
        {
          text: '備註：',
          fontSize: 18,
          margin: [15, 5, 0, 5],
          width: '*'
        },
        {
          text: '還不知道寫啥',
          style: 'content2'
        },
        {
          text: '_________________________________________________________',
          style: 'line'
        },
        {
          columns: [
            {
              text: '主管：',
              fontSize: 18
            },
            {
              text: '經手人：',
              alignment: 'center',
              fontSize: 18
            },
            {
              text: '日期：' + today.toLocaleDateString(),
              alignment: 'right',
              fontSize: 18
            },
          ], margin: [15, 40, 0, 15]
        },
      ],
      footer: [
        {
          text: '電話:03-9898747　傳真:03-9898747　地址:宜蘭縣三星鄉三星路二段103號',
          style: 'footer'
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          margin: [0, 15, 0, 0],
          width: '*',
        },
        content: {
          fontSize: 18,
          margin: [15, 5, 0, 5],
          width: '*',
        },
        content2: {
          fontSize: 22,
          margin: [15, 10, 45, 15],
          width: '*',
          color: 'blue'
        },
        title: {
          fontSize: 18,
          margin: [15, 45, 0, 5],
          width: '*'
        },
        line: {
          fontSize: 18,
          margin: [0, 0, 0, 0],
        },
        footer: {
          fontSize: 16,
          margin: [5, 5, 5, 5],
          width: '*',
          alignment: 'center'
        }
      },
      defaultStyle: {
        fontSize: 18,
        margin: [0, 15, 0, 0],
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



  exportPdf() {
    const div = document.getElementById('capture');
    const options = { background: 'white', height: 845, width: 595 };
    domtoimage.toPng(div, options).then((dataUrl) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(dataUrl, 'PNG', 0, 0, 210, 340);
      doc.save('pdfDocument.pdf');
    }
    )
  }


  exportPdf2() {
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
      }
    }

    domtoimage.toPng(div, options).then((dataUrl) => {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.addImage(dataUrl, 'PNG', 0, 0, 210, 340);
      doc.save('pdfDocument.pdf');
    }
    )
  }


  ngOnInit() {
  }

}
