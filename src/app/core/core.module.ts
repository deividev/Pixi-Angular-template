import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {UiModule} from '../ui/ui.module';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    UiModule
  ],
  exports: [HttpClientModule, UiModule]
})
export class CoreModule { }
