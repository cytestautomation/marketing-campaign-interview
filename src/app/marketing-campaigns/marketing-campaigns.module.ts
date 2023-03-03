import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingCampaignsRoutingModule } from './marketing-campaigns-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CampaignFormComponent } from './components/campaign-form/campaign-form.component';

@NgModule({
  declarations: [CampaignFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MarketingCampaignsRoutingModule,
  ],
})
export class MarketingCampaignsModule {}
