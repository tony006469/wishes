import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StickerListPage } from './sticker-list.page';

describe('StickerListPage', () => {
  let component: StickerListPage;
  let fixture: ComponentFixture<StickerListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StickerListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StickerListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
