import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { AppointmentService } from './../shared/appointment.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../../assets/fonts/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import { ReceiptNumberService } from 'src/app/service/receipt-number.service';
import * as firebase from 'firebase';

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
  other: any;
  create_date: any;
  expired_date: any;
  receipt_number: any;
  serial_number: any;
  order: any;
  printed: any;
  constructor(
    private receiptnumberService: ReceiptNumberService,
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
      this.order = res[9];
      this.other = res[10];
      this.printed = res[11];
      this.serial_number = res[12];
      console.log(res);
    });
  }

  ngOnInit() {
    firebase.database().ref("number/number").on('value', (snapshot) => {
      this.receipt_number = snapshot.val();
    });
  }

  strip(str, remove) {
    while (str.length > 0 && remove.indexOf(str.charAt(0)) != -1) {
      str = str.substr(1);
    }
    while (str.length > 0 && remove.indexOf(str.charAt(str.length - 1)) != -1) {
      str = str.substr(0, str.length - 1);
    }
    return str;
  }

  generatePdf() {
    this.option = Object.values(this.option).join()
    this.option = this.strip(this.option, ",")
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
              text: '聖嘉民' + this.receipt_number + '號',
              // alignment: 'right',
              fontSize: 20
            },
          ], margin: [0, 5, 0, 10]
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              [{ text: "\n" + '茲收到　　' + this.name + '　　君　　(連絡電話:' + this.mobile + ')' + "\n" + "\n" + '地址：' + this.address + "\n" + "\n" + "\n" + "\n" }]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              [{ text: "\n" + '金額：　新台幣　' + this.money + '　元整' + "\n" + "\n" + '點燈日期自　' + this.create_date + '　起，迄　' + this.expired_date + '　止。' + "\n" + "\n" + '奉獻者：' + this.name + "\n" + "\n" + '燈號：' + this.serial_number + "\n" + "\n" + '祈禱意向：' + this.option + "\n" + "\n" + "\n" + "\n" + '其他：' + this.other + "\n" + "\n" + "\n" + "\n" }]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              [{ text: "\n" + '備註：' + "\n" + "\n" + "\n" + "\n" + "\n" + "\n" }]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            heights: [70],
            widths: ['*'],
            body: [[
              {
                columns:
                  [
                    {
                      text: '本堂神父:',
                      fontSize:15
                    },
                    {
                      image: 'data:image/png;base64,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',
                      width: 50,
                      height: 50,
                    },
                    {
                      text: "\u200B"
                    },
                    {
                      text: '經手人:',
                      fontSize:15
                    },
                    {
                      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALMAAACzCAYAAAG1Ex1lAAAACXBIWXMAAC4jAAAuIwF4pT92AAAACXRFWHRDb21tZW50AACJKo0GAAAVoUlEQVR4nO1dzZUjKRKewx7mKAf2vbzsXSbIBJmQJpQJMqFMkAkyId/b2dfXOocZc51DbWcXlBAZARFBQP40h69bJZFk8PERQACZf8B//v3XT/yogT/mfz4/P/+wxs98P9HMf353dv+fiAvvwecHO/P5yxjIhQ8qfdZy/yP1vcMblSZl+SmVefxb6vNL5hglDkOClkmS+cOB5NJn7is++G2m6l3NeWh5mJFILfFn7MZRid6SmbvMzlhmVMW5vwfkO5qWUrTNHCta8Plb/7GKWC00lTliWSzD+G+6EeUyR5STVwtDclQr5tHy8/+P6O/3nOXB329JWlKcuzQXxKB7TGlSigy3S/p9TuYTt0Kx7+s3opwCtPCZ2w8ratAxI1kxqUoKPi9c8yJjjqwiPZNpVbUeZIwOgDCLB/f/Wy5zn7EZFZh3nH1O3LCwjN+ozN3neGhxjm9IckxVGkLFnVJQfMHL2I6hiks241QmGM+5NO1annnGvsaDv29Y0Qml0C0P4e0t8dsQ/X2OG1X4Y6jPRybjR/h/jooHZjElwdx3KBW+BWLWaisvzHDhiFItku02Ux6O46yKtEq5zOKMkxxTxSpFtYFLLRzb6Nj/Bd99Sm6W6pPMjJboTJJH9D05SKlqNPNmD8yXS/PlGI0GE7RapPoL5PNZbTR1kTD91XcpiDTENUkarfWfVD6BPBYGuP/fY9bVmk4Y4A29SuUhJGaRP2r0z7/HUu8ASNCY02ghmGiYMN0CXvu5NJsymlswcUNk6JE1801JrcjoxIXokgDx3SNsUAkvc+G405TRfuZydgb6QP5NajSn9qQNP2m0BdOI4UPw96Ln82RVlUfsIjNGn2ODMKO18qCq7Z5i2kIWOakkjc4YwjYaYzpoJ5Mz7BFBrmnGzVVGE4UQ5aM22hK7NFpTyF9G7wz/Vc9EVmT6Rzd6M0ZT7k3T6iXfFzNdy2j4WjexMxrcvgImkmNozGh4ztJTwEIYSaMthpGYYfGCUrbAKnlEBWHfBKsRh0HrALJGlzLN0LRIGlyjF1srpNUZXTsh342cAkqMXgzYNUZTNRN/BsbyjllDzEmESpMqgJppSbVlDL75a3/+fyohhDQaafGLLXWMzKfw+4jJuRD3TC2jMxiu0eq5XEqniJ4/gwLZyAPc1EgjEYbRb2HhILH6yzYaXM/mPl80xkdGvoQdJI075z3OUSZTQkKD0Oj3OD+qRlhGE6W+UzcQMJQz5hbWqNToS86AKH3swi5Ko7k+v93MBXjD1w9GmoNOt7aGYxmd8J2XzO9JAnJpmA0/a/RFkrmQgM/c70R+tNEMxljr5vC6/++EuNgbPDdvlTEtNRoyYVuskMj1HoNWHj74/YuJqBsWGZ2TgKRtiBti9PspuiYbaI/biLKW9fKgCiq5bjWjnSzuidae9BwZ+WA7cUyMlgyukkwDspdUbXTsqsKGCJnpkVRmSCHiXWpFDTG7wyuUTQmyRnvmAkyIe+Majc56cjWakhxl9KJKCGPYe+lizcJrWCJe+MzdWzfK0xitlcOqRhsWXm90qcHNjbaCkrADzVy2jG+jd4avs/UbMOToeBK9tlSPik50J9qkcNJxQfEgqgnREB0DFKQ1L2DoGyXpd0F0VMDsfm+HoWLBsuTB6zaUMfrtzEF1oiv2zqPEDsK27xbDILgIqygauUG4aqra0WJc4fEqrnmZqxENRpEjy0ID7zTS3f0/L3Ozj3B5ATUl2thlkA+nUdjlXUdy0TesEAVEB1R37zq4AsilQ74fU9c0UbSxkjFodygOSF7f8WIB0Q/sN45LqkX0r0NnzgBqCBR2RFd4xqPDg2shVC4EXvsKlBB43Sv1EX3GbFkcEkrBnGhFbYrzBuJZjki6t7iwGNFxugog+wMx0ZEKWmAi7Bix9FjTZ7TKK/LdPBIZovTqrZMaokNDJOtvpN+Fp0t5Dyoyu0XMXTt5e6LvcxMWkrTI5gc3T1OiFZmHFVPc2QnunSP6u8UAzzc/Smw3JRqQWRdmFOEizMbQ8T1SlWAAbsvjEy01gnHzGzOvWXWjFdHKinsvya8G0ayRQoHKuCORIqIh2ndtkJ+4MzwFPkukMoFRsQsSxSFcHr613ArsMCFZRXRHJ3rT6ERvlWhYjodFow/Qxa6T64/MQqqGkIGvZw3jLIkWjzVLr+d2iLA8p+w3VIb5hAGtEcnj4X47I/aGQTCRCIqIVtZsWHD2FD6TRrvCc8XuVUkE2yUaCs+/InZPyuus7i8iWh1YaUV0gTIlGJoRzUUB0drVjNhG73dfFifiSilVbW2iP1wBhiANubFEQl5p6wmJLK1MrjiqEK28oYRottrgdUPMO6fluesW64kgX9zIjjw0RJt1hlS+CG4Su6LW9r0wQIkEITrOJxzV+CGjx6WWokVEw3JsS/pogixxQImwmYz6cV2HgQ3lREPiSRxcoq0RqM8y0M/u+M2I1tzYmmihPbklKva2AgIXE6IhePSQwyQlqyLR6qUwjuuI0sfxnuy9xYo2IKaJ61jDPfyuRN/gdRfVFbsfGE7zt0b00KJgAnvOjSq+LdFbw2EVvUWUdqad6A2hE70C0f+rOSTq+IW/ZqL/dqruqIN/Wq1I/NbwJP9rbR92RMy8dpI7yftHJ7mTfAyYkwyyo7lDxYLNC6vsje+VbbEjORyuWKYtsaVW+k7ya/43Rlq/deB+GJLh9Rx20VZbhi3cvRRVKrsGyYsNJkS6qUHBWCRTwgDmo3s4vryI5FrTz1Ykt7JXTTLIXqC2OZIN7Z1qkoyddrVAtvkVEHYBfMOO33DJav4K++pORqwViuQv3VQY76u417DraCRzSPUbCgd3TfWO15RkMHz2Gxg+rSBHorP76j5rTlpJZpNFowtLgslOqgbJgpZAohXJ4nOCFkb/ViS7DJKbp2uRKCRvYKbjHJ/7aE6ypLANCca2yI5c+1L2BumnJiQD46mwK5FMNfFbIu1b8F3oBmflnlLpq5AMzHdhruGfkbzOkDiERLkUyt1IXEspyVUJ1pJMVD5JBqSf5OVHThes7EK7VCSHQzd/kPEKeJTKF3yC5Wkj9BiCgYpD++LDQlPwW/iZOhJBHZEIr036aRXJwoJ7tVSJG2OtK/r7jKVp2QI3TTIoHh4Fz+c0Nyc5YZ+MZKBneXfnAu6gP2UkMfyWSk+QPMHTvbEWGIjK9FE7Vh+iIbl6k2OSjKV/IL9T58MXnR68xsjR9646iGIsIpLj2muAm6RFEYRQJPuOa8pUHuZupEfvRCSfghuhJ41SikukwU6ZXhh5k02eQTL6O0SjBuwaCcFikhWZY+ocLe/BuHeSZMlvmyM5UsQpJntNkuG10+SOj6dNkRwROhHf/+qlVyK5esdcjWRA4stImjth8FCJ5HHXJMPX6i85Js5cRxlucr4uyC/1vOgbpvRMfixiVSSDfFU4q0xBXu9cMjgkF1ZaVZJNm1CQr2h22Ipk+BpW3iAKlYIuPMAmmUPGXVmgxehjAyRTNozVSM7c2MqPUp2ipoX467RPQC+2QUWyu+DmVP3O8bsGZN9LSCqwAQuETU1I3gtAeJyByMMPSR8lgjosyVtCJ7mTfAx0kjvJx0AneYskc2dmAW6F1xdNdqDw0Wml420xyYBv6GBPhaHgZY0FBXzT5gFGz5KTkpyc9hIIV5BVlcQhCKI1R0fQHFINY9zh7iUsBDp/f3N5DRHJN3g+t9mXY/5/tCYZW63+PoshaX5M4lhpC1pIuJNzUObxmSu/lOQzZqCw6WhInrh5alsHISCrVrYLknNHd30z/nUWj8qHeT+/O+gUEJ+sZFOSo4JvhmRGPnfO/ZDrvAspDTQdk2SITgFgCudcH2GE2kH7vZCs9a2WftiK5PegdrFN3agxtUkG/ot0SyCt9OozvviVGa2V7Fdx4tMAJ4uWuQmSWys5uv6au5ZLcklFWJA8K2UMfv/uKHLXNyDZX09uBwvSkPGR0AW1Jrlqxwev2wTute7FqUiJMKxJvlQmOYw5jIJ8P4DX+cWvmsN26atcoiXJJa9bWxgHzxlWvBmcU4hRSgxFMiiCWHsiuaQQVNwhrKyXaBxyX09y3ArCPOIhK8tl7oFk7tt5xTvqU/ZI8jAlGV7Dgdn5PCCvhUuQvNjbXFKwIN9k3AISE6fI5pKTsrooXI5crGnmlBMRXPWVcxKSGXn4g0Wo+5CSjC7lOIVTuz5PUVozlWZsHZz/nFuIuDNT4mZBMtWRsDsta5LhNca9NgYLkqXLPItZlCXJIA8GYaeasN9Vy1kJO032J3vMncyFm4cByaJmm2udiTTZcXjmHkUki6fWFZWcrFwrewA5VMS4RkVyyR4EU5+cuVe4qjGT4ycRt4y7SIHdSlQkGxW8Osmc5l2CTvInq+8owaWT/PkybvfbBN6AeGxvI3uOR/LW7OkkH5Tkt60QfFiSt4ZOcluSq739t5PsYuSV7/F7k9yoIjvJneQDoJO8AskdFdFJbkTyP2sb0dFhgL9nMf8IvvgTvvx1R8ceMOvVa/dHLOY+oOvYDZygu5g79o8u5o7DoIu54zDoYu44DDYtZlhu7V+c+lHmGx5wmXd/D2tXhMD2oQYnRP7VlvMrcbNNMQN98OdWmC910LLJ6SsDXjDbR6O8Fw/qXru8Qvs3K2bsCegzSp8DRQXZh7Uro8D+4hd5EnyPa5dXWIZtitkZhx0sK3lkKnr4Ye1KEJahRgPHeL6vXVZFOdYTM7w+/ALDFZYnGv3jvaRYnBlz4uZeX/RkPkPOsOFXycObuMvDtVE8zFtNzIhIt45qjztrLeaNiXjfYoZtHfxnoaFY594i7qEu8Owh7oh9k/89ke+JaAgafAD/rajmB4A3JWZ3Yx92m2B57JHdrQPtZUhPCs+HrYe4IiIyDXsl7MGGQFY4Ae+xK03KWpnH7U4AmQWgvPwmhgUM++O4cZUeJSPoYW0ejLjct5hdIZJiRrxwatI5Y2xZwU7Q8fDh4b7z9pxdukWcXHivWNS7iK8zy7aumIH5AK+VUBy/rcBXHEaziDFTC0k1YR4dWlXMYDchqYXNjSMRzkpjzGtNxs17hLXFnBovxrPe2YNjM3zKs2vj0cmowNogyjoV5KfpGedoxhWWjzWbcY/qjRqrH0vMRgVAV/VgJxNAYVk5UY+LME803k+knYc4mjcesfI34Gf3Yt51NENQTulCB2vZn7gWFSzloRX1c6/EUVsxJzzpXtB8HA35hx+TvyvFjJYR8mFE6mWqTThsKmbY3xI2q8IqC5mz4BG/vfd7kpjJG+3VMtdQgqYawGKSX5GrpmJeW4ilaBqqQ+4/OwPM02nfGaMeAsDXymL2vjkOgX5G9gxR+K6pmIObDsb5xZWyufiwsDzo+Nj9xhYzkXZX2LyYK1T+IcRMidjBv7SUJeZMXnuBaO96MzEDvnfZxypL3+ItEjPw9z+Htv4KS8FyDHszEHBuLhGOibFdc5iYNRNtv2xeirlMpSu7g4LLumKGujvCNgEhH9Ku/xpdj62aisfMSB53oqF9e0kQOB1gjsfhy8ldHEqdWj0xwzG6uhxEQoLXlyLnsPBOFmIGPJSHCgnyvQYVk24WkmslZs0EJF7GvgE+NPHAQldvwe/YUMGjRMRFx/AhHbNdeDBjMcfX3xJpqUUpcaOrKeTqYo4IqbEWn1tMmAk12Z3lxLeoNKO8R98AGWmLxIw5GGb9YfxOiWvitB81uIvuub9oBsi6anNhr1x2tZgJ3kSLQBwOiV7n3oCb/YjZkUStiIWb8Tlj9XHt8ig5KBFzybDKCnP9zZPJ0dq5bF7MwDuIOSjEX+ShVuQDs107PNkEDilmJ755HMzdw8FeHAH5ZHRuBFvcnK9qiAVijifkD0H9cHDZvJiB9y7qEgxKu07A99aUyB/wjKyo7GgtZndtlYl4dA/UaTTixlbMUHeL5ywks3EW1F/QMffsJWJuJCjMazfZXlBDzJpIQw5jAyJqNcJLAzHfGopVU79NGpu5mI0EPXfjq53DMxR2K898aciNZlW3SV1WEbOw4HO3NI+zNhkDhmiz+9peCLGl+mIEYoNkAthsCFRVzEcFrPhkUKTXW8UJQH4SfV/Bpi7mjmOgi7njMOhi7jgMupg7DoMu5o7DoIu54zBoImb42kC0yTjyUQBfS/PvwNzkb3xvv/dmXJmDzR2b0gI7odzy/s0XCXLlbHRvVl0cQcwt99AOTKKPKGZ0pbXBfanjVIcUc4lnxPbRYiAPlkJ6V5w/LHsB3bMhqLKpKxK+hmOWe4VzIPeOQPvN/NPWxUxt2LmXVLpRgyoew2P5VuCqJqjHC6xhi5q7VmKmuqGWm0/MPWhCzOp9uwIBzZ47fgzDlbge68myjgT4b8DCepEzvL7L8E7Y8d2zWtRFdTETFd7FXK+spp5Owe1t5fJ3MSvzxXqdtcV8ac2x6x2aDRsztlQXMzaR6GKW32+Vcawxip4C1cV8ADHDsR4+Wc2DryVma6RCTEcQ830DIizFvZaIjybmYQUxY/lWHTPDM3phdsoF8IjEZk57/05izoqHErNBuTBvOTWuvPj+F0UeNysxA95bNduTs5aYm52+rihmVeMyLltxuQAfj6vKQdR1s6dCrSXm1SeAhXlSp85NygXPV2ZcU54N8EOlI6Rfz3CJ8mCN/eF5St0vvPhFkXA7AMoJExYrsquIuVlM0lrMkF4dKx2Hxyeva+Etum9SzInGa4ouZmMxE/ZyMFXiyhqY182JubZNxdy1EjNm/JbFjHXdHAxG9obRBb8Pww85FlEMWC6mWLysZyEueE54/Z6Qa1hmWA4zTATaxcwQcyyKIL2mqzcRshHHGjEvegQDO5pzUlXMSGtVExXle408GDnxSoiZrHSmoB9riziwdx7Hzz3KqLzeSsxDqi4a8NB+P7Pg+ovr0nJdf0qY6kUT12i+Z+1rClbJfxzJoCIJ6MKJEe6gf2C5KERYW8zJ8aprySMULtdqbOCIeUURDvC6L9gLQs3RTjFuScwtKiC30XzTYoby1/IeFZOCy2qvgUjFY0vxa4bPtGOzYi7k4AOCRwtAwfgdFGNm+JpX+N5DGwEi61dZjmpilhbAryqZimzjYs71XDMnyVXAWo3KIM8r6IaPQ8E9q4mZ6j6b7cvYupidfaODuhIL749Gbirez88HQljtAKw6Zj5ZGqu0YdNiVpRnjvBYd+vV0YibYz9r7khihrbP1LDE1MXcxRyXpSiE6RDGemduqOFgaTzZN7yq5/66mHcq5kr8VFmlXakshxfzpYs5yQ8q5j3yc3gxu0IuutC1bdoKuph3CDfcuK1tx9aQEPOwtm2KsvweYu4gBYCJufmLMo3K0sX8uwOWK5G7G2K4cnQxdxwDXcwdh0EXc8dh0MXccRjkxPynS9DRsQfMen0R89/wOrPt6Ngj/vk/AtGFtAsELYkAAAAASUVORK5CYII=',
                      width: 50,
                      height: 50,
                    },
                    {
                      text: "\u200B"
                    },
                    {
                      text: '日期：',
                      fontSize:15
                    },
                    {
                      text: today.toLocaleDateString(),
                      fontSize:15
                    },
                  ]
              }
            ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              [{ text: '電話:03-9898747　 傳真:03-9898747   地址:266 宜蘭縣三星鄉三星路二段103號' + "\n", fontSize: 14 }]
            ]
          }
        },
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
    this.receipt_number++;
    this.receiptnumberService.updateSerial(this.receipt_number);
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

}
