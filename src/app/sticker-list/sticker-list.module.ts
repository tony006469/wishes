import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StickerListPageRoutingModule } from './sticker-list-routing.module';

import { StickerListPage } from './sticker-list.page';
import {ReactiveFormsModule  } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    StickerListPageRoutingModule,
  ],
  declarations: [StickerListPage]
})
export class StickerListPageModule {}
