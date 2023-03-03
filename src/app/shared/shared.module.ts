import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { SharedModule as NgPrimeSharedModule } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    TranslateModule.forChild(),
    TooltipModule,
    DialogModule,
    FileUploadModule,
    InputNumberModule,
    NgPrimeSharedModule,
    TableModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    CalendarModule,
  ],
  exports: [
    ToastModule,
    TranslateModule,
    TooltipModule,
    DialogModule,
    ReactiveFormsModule,
    InputNumberModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    ButtonModule,
    CardModule,
    CalendarModule,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [MessageService, ConfirmationService],
    };
  }
}
