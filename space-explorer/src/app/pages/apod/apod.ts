import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NasaService } from '../../services/nasa.service';
import { DbService } from '../../services/db.service';
import { ApodInterface } from '../../interfaces/apod.interface';

@Component({
  selector: 'app-apod',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apod.html',
  styleUrl: './apod.css'
})
export class ApodPage {
  selectedDate = signal('');
  apod = signal<ApodInterface | null>(null);
  loading = signal(false);
  error = signal('');
  savedMsg = signal('');
  today = new Date().toISOString().split('T')[0];

  constructor(private nasa: NasaService, private db: DbService) {
    this.loadToday();
  }

  loadToday() {
    this.search();
  }

  async search() {
    this.loading.set(true);
    this.error.set('');
    this.savedMsg.set('');
    try {
      const date = this.selectedDate() || undefined;
      const result = await this.nasa.getApod(date);
      this.apod.set(result);
    } catch {
      this.error.set('Error al cargar la imagen. Intenta con otra fecha.');
    } finally {
      this.loading.set(false);
    }
  }

  async saveFavorite() {
    const a = this.apod();
    if (!a) return;
    await this.db.addFavorite({
      type: 'apod',
      imageUrl: a.url,
      title: a.title,
      date: a.date,
      savedAt: Date.now()
    });
    this.savedMsg.set('¡Guardado en favoritos!');
    setTimeout(() => this.savedMsg.set(''), 3000);
  }
}