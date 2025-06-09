import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartiesPage } from './parties.page';

const routes: Routes = [
  {
    path: '',
    component: PartiesPage
  },
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then( m => m.CreatePageModule)
  },
  {
    path: ':id',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartiesPageRoutingModule {}
