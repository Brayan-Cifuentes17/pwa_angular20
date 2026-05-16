import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Paises } from './pages/paises/paises';
import { Pais } from './pages/pais/pais';
import path from 'path';

const routes: Routes = [
  { path: 'paises', component: Paises },
  { path: 'pais/:id', component: Pais },
  { path: '**', component: Paises }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }