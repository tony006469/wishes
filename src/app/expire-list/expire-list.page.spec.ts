import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExpireListPage } from './expire-list.page';

describe('ExpireListPage', () => {
  let component: ExpireListPage;
  let fixture: ComponentFixture<ExpireListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpireListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExpireListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
