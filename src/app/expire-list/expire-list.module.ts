import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExpireListPageRoutingModule } from './expire-list-routing.module';

import { ExpireListPage } from './expire-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExpireListPageRoutingModule
  ],
  declarations: [ExpireListPage]
})
export class ExpireListPageModule {}
