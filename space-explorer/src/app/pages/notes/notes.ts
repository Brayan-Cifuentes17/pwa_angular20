import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { Favorite, Note } from '../../interfaces/mars.interface';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.html',
  styleUrl: './notes.css'
})
export class NotesPage implements OnInit {
  favorites = signal<Favorite[]>([]);
  selectedFav = signal<Favorite | null>(null);
  notes = signal<Note[]>([]);
  newNoteText = signal('');
  editingNote = signal<Note | null>(null);

  constructor(private db: DbService) {}

  async ngOnInit() {
    const favs = await this.db.getFavorites();
    this.favorites.set(favs);
    if (favs.length) this.selectFav(favs[0]);
  }

  async selectFav(fav: Favorite) {
    this.selectedFav.set(fav);
    this.newNoteText.set('');
    this.editingNote.set(null);
    const notes = await this.db.getNotesByFavorite(fav.id!);
    this.notes.set(notes.sort((a, b) => b.createdAt - a.createdAt));
  }

  async addNote() {
    const text = this.newNoteText().trim();
    const fav = this.selectedFav();
    if (!text || !fav) return;
    await this.db.addNote({ favoriteId: fav.id!, text, createdAt: Date.now(), updatedAt: Date.now() });
    this.newNoteText.set('');
    await this.selectFav(fav);
  }

  startEdit(note: Note) { this.editingNote.set({ ...note }); }

  async saveEdit() {
    const note = this.editingNote();
    if (!note) return;
    await this.db.updateNote({ ...note, updatedAt: Date.now() });
    this.editingNote.set(null);
    await this.selectFav(this.selectedFav()!);
  }

  async deleteNote(id: number) {
    await this.db.deleteNote(id);
    await this.selectFav(this.selectedFav()!);
  }

  formatDate(ts: number) {
    return new Date(ts).toLocaleString('es-CO', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' });
  }
}