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
      this.email = res[2];
      this.mobile = res[3];
      this.money = res[4];
      this.name = res[5];
      this.option = res[6];
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
              fontSize: 20
            },
            {
              text: '收據',
              alignment: 'center',
              fontSize: 20
            },
            {
              text: '聖嘉民__號',
              alignment: 'right',
              fontSize: 20
            },
          ],margin: [ 0, 5, 0, 10]
        },
        {
          text:'茲收到　　' + this.name + '　　君　　(連絡電話:' + this.mobile + ')',
          style: 'content'
        },
        {
          text:'地址：' + this.address,
          style: 'content'
        },
        {
          text:'金額：' + this.money,
          style: 'content'
        },
        {
          text:'□平安燈　' + '數量' + '　盞自　'　+ 'DATE' + '　起，迄　' + 'DATE+365' + '　止。',
          style: 'content'
        },
        {
          text:'奉獻者：',
          style: 'content'
        },
        {
          text:this.name,
          style: 'content2'
        },
        {
          text:'祈禱意向：',
          style: 'content'
        },
        {
          text:this.option,
          style: 'content2'
        },
        {
          text:'□其他：',
          style: 'content'
        },
        {
          text:'還不知道寫啥',
          style: 'content2'
        },
        {
          text:'備註：',
          style: 'content'
        },
        {
          text:'還不知道寫啥',
          style: 'content2'
        },
        {
          columns: [
            {
              text: '主管：',
              fontSize: 16
            },
            {
              text: '經手人：',
              alignment: 'center',
              fontSize: 16
            },
            {
              text: '日期：' + today.toLocaleDateString(),
              alignment: 'right',
              fontSize: 16
            },
          ],margin: [ 15, 5, 0, 10]
        },
        // 'paragraph 1',
        // 'paragraph 2',
        // {
        //   columns: [
        //     'first column is a simple text',
        //     {
        //       stack: [
        //         // second column consists of paragraphs
        //         'paragraph A',
        //         'paragraph B',
        //         'these paragraphs will be rendered one below another inside the column'
        //       ],
        //       fontSize: 15
        //     }
        //   ]
        // },
        // 'This paragraph fills full width, as there are no columns. Next paragraph however consists of three columns',
        // {
        //   columns: [
        //     {
        //       // auto-sized columns have their widths based on their content
        //       width: 'auto',
        //       text: 'First column'
        //     },
        //     {
        //       // star-sized columns fill the remaining space
        //       // if there's more than one star-column, available width is divided equally
        //       width: '*',
        //       text: 'Second column'
        //     },
        //     {
        //       // fixed width
        //       width: 100,
        //       text: 'Third column'
        //     },
        //     {
        //       // % width
        //       width: '20%',
        //       text: 'Fourth column'
        //     }
        //   ],
        //   // optional space between columns
        //   columnGap: 10
        // },
        // 'This paragraph goes below all columns and has full width',
        // 'Bulleted list example:',
        // {
        //   // to treat a paragraph as a bulleted list, set an array of items under the ul key
        //   ul: [
        //     'Item 1',
        //     'Item 2',
        //     'Item 3',
        //     { text: 'Item 4', bold: true },
        //   ]
        // },
        // 'Numbered list example:',
        // {
        //   // for numbered lists set the ol key
        //   ol: [
        //     'Item 1',
        //     'Item 2',
        //     'Item 3'
        //   ]
        // },
        // // this.name,this.mobile,this.email,this.address,this.money,this.option
        // {
        //   layout: 'lightHorizontalLines', // optional
        //   table: {
        //     // headers are automatically repeated if the table spans over multiple pages
        //     // you can declare how many rows should be treated as headers
        //     headerRows: 1,
        //     widths: ['*', '*', '*', '*'],
        //     body: [
        //       ['First', 'Second', 'Third', 'The last one'],
        //       ['Value 1', 'Value 2', 'Value 3', 'Value 4'],
        //       [{ text: 'Bold value', bold: true }, 'Val 2', 'Val 3', 'Val 4'],
        //       ['1', '2', '3', '4'],
        //       ['', '6', '7', '8'],
        //     ]
        //   }
        // }
      ],
      footer: [       
          { 
            text: '電話:03-9898747　傳真:03-9898747　地址:宜蘭縣三星鄉三星路二段103號',
            style:'footer'
          }
          ],
      styles: {
        header: {
          fontSize: 20,
          margin: [0, 15, 0, 0],
          width: '*',
        },
        content: {
          fontSize: 16,
          margin: [15, 5, 0, 5],
          width: '*',
        },
        content2: {
          fontSize: 20,
          margin: [15, 10, 0, 5],
          width: '*',
          color: 'blue'
        },
        footer: {
          fontSize: 16,
          margin:[ 5, 5, 5, 5],
          width:'*',
          alignment:'center'
        }
      },
      defaultStyle: {
        fontSize: 16,
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
