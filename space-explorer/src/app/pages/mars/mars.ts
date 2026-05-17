import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NasaService } from '../../services/nasa.service';
import { DbService } from '../../services/db.service';
import { NeoObject } from '../../interfaces/mars.interface';

@Component({
  selector: 'app-mars',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mars.html',
  styleUrl: './mars.css'
})
export class MarsPage {
  startDate = signal(this.getToday(-7));
  endDate = signal(this.getToday(0));
  neos = signal<NeoObject[]>([]);
  loading = signal(false);
  error = signal('');
  savedIds = signal<Set<string>>(new Set());
  totalCount = signal(0);
  filterHazardous = signal(false);

  constructor(private nasa: NasaService, private db: DbService) {}

  getToday(offsetDays: number): string {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split('T')[0];
  }

  get filtered() {
    return this.filterHazardous()
      ? this.neos().filter(n => n.is_potentially_hazardous_asteroid)
      : this.neos();
  }

  async search() {
    this.loading.set(true);
    this.error.set('');

    const start = new Date(this.startDate());
    const end = new Date(this.endDate());
    const diffTime = end.getTime() - start.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      this.error.set('La API de la NASA solo permite consultar un máximo de 7 días. Por favor, reduce el rango de fechas.');
      this.loading.set(false);
      return;
    }

    if (diffDays < 0) {
      this.error.set('La fecha final no puede ser anterior a la fecha inicial.');
      this.loading.set(false);
      return;
    }

    try {
      const res = await this.nasa.getNeoFeed(this.startDate(), this.endDate());
      const all: NeoObject[] = [];
      Object.values(res.near_earth_objects).forEach(day => all.push(...day));
      all.sort((a, b) =>
        parseFloat(b.close_approach_data[0]?.relative_velocity.kilometers_per_hour || '0') -
        parseFloat(a.close_approach_data[0]?.relative_velocity.kilometers_per_hour || '0')
      );
      this.neos.set(all);
      this.totalCount.set(res.element_count);
    } catch {
      this.error.set('Error al consultar la API de asteroides. Verifica tu conexión o el formato de las fechas.');
    } finally {
      this.loading.set(false);
    }
  }

  async saveFav(neo: NeoObject) {
    await this.db.addFavorite({
      type: 'neo',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/200px-FullMoon2010.jpg',
      title: neo.name,
      date: neo.close_approach_data[0]?.close_approach_date || '',
      savedAt: Date.now()
    });
    this.savedIds.update(s => new Set([...s, neo.id]));
  }

  isSaved(id: string) { return this.savedIds().has(id); }

  formatKm(val: string | undefined) {
    if (!val) return 'N/A';
    return parseFloat(val).toLocaleString('es-CO', { maximumFractionDigits: 0 });
  }

  formatDiam(neo: NeoObject) {
    const d = neo.estimated_diameter?.kilometers;
    if (!d) return 'N/A';
    return `${d.estimated_diameter_min.toFixed(3)} – ${d.estimated_diameter_max.toFixed(3)} km`;
  }
}