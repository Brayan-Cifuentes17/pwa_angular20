import { Routes } from '@angular/router';
import { Paises } from './pages/paises/paises';
import { Pais } from './pages/pais/pais';

export const routes: Routes = [
    { path: 'paises', component: Paises },
    { path: 'pais/:id', component: Pais },
    { path: '**', component: Paises }
];
