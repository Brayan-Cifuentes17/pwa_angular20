import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'apod',      loadComponent: () => import('./pages/apod/apod').then(m => m.ApodPage) },
  { path: 'mars',      loadComponent: () => import('./pages/mars/mars').then(m => m.MarsPage) },
  { path: 'favorites', loadComponent: () => import('./pages/favorites/favorites').then(m => m.FavoritesPage) },
  { path: 'notes',     loadComponent: () => import('./pages/notes/notes').then(m => m.NotesPage) },
  { path: '**', redirectTo: 'apod' }
];