import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class ReceiptNumberService {
  constructor() {
  }

  updateSerial(receipt_number) {
    var newSerial = { number: receipt_number }
    firebase.database().ref("number/").update(newSerial)
  }
}