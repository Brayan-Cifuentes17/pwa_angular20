import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbService } from '../../services/db.service';
import { Favorite } from '../../interfaces/mars.interface';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class FavoritesPage implements OnInit {
  favorites = signal<Favorite[]>([]);
  filter = signal<'all' | 'apod' | 'mars'>('all');

  constructor(private db: DbService) {}

  async ngOnInit() { await this.load(); }

  async load() {
    const favs = await this.db.getFavorites();
    this.favorites.set(favs.sort((a, b) => b.savedAt - a.savedAt));
  }

  get filtered() {
    const f = this.filter();
    return f === 'all' ? this.favorites() : this.favorites().filter(x => x.type === f);
  }

  async remove(id: number) {
    await this.db.deleteFavorite(id);
    await this.load();
  }

  formatDate(ts: number) {
    return new Date(ts).toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
  }
}