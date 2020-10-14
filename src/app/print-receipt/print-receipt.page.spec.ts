import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrintReceiptPage } from './print-receipt.page';

describe('PrintReceiptPage', () => {
  let component: PrintReceiptPage;
  let fixture: ComponentFixture<PrintReceiptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintReceiptPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrintReceiptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
