import { TestBed } from '@angular/core/testing';

import { ReceiptNumberService } from './receipt-number.service';

describe('ReceiptNumberService', () => {
  let service: ReceiptNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
