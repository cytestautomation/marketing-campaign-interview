import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'marketing-campaigns',
    pathMatch: 'full',
  },
  {
    path: 'marketing-campaigns',
    loadChildren: () =>
      import('./marketing-campaigns/marketing-campaigns.module').then(
        (module) => module.MarketingCampaignsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
