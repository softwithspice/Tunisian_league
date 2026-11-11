import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChampionnatService } from '../../services/championnat-service';
import { ChampionnatInterface } from '../../interfaces/ChampionnatInterface';
import { CalendarMatch } from '../../interfaces/CalendarMatch';

@Component({ selector: 'app-calendrier', imports: [FormsModule, RouterLink, DatePipe], templateUrl: './calendrier.html', styleUrl: './calendrier.css' })
export class Calendrier {
  private service = inject(ChampionnatService);
  private cdr = inject(ChangeDetectorRef);
  championnats: ChampionnatInterface[] = [];
  championnatId = 0;
  groupes: { journee: string; matches: CalendarMatch[] }[] = [];
  loading = true;
  erreur = '';
  page = 0;
  hasNext = false;
  private request = 0;
  constructor() {
    this.service.getChampionnats().subscribe({
      next: data => { this.championnats = data; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.loading = false; this.erreur = 'Impossible de charger le calendrier. Rechargez la page.'; this.cdr.markForCheck(); }
    });
  }
  choisir(page = 0): void {
    const request = ++this.request;
    this.groupes = []; this.erreur = '';
    if (page === 0) { this.page = 0; this.hasNext = false; }
    if (!this.championnatId) { this.loading = false; return; }
    this.loading = true;
    this.service.getMatches(this.championnatId, page).subscribe({
      next: data => { if (request !== this.request) return; const groupes = new Map<string, CalendarMatch[]>(); for (const match of data.content) { const key = String(match.journee); if (!groupes.has(key)) groupes.set(key, []); groupes.get(key)!.push(match); } this.groupes = Array.from(groupes, ([journee, matches]) => ({ journee, matches })); this.page = data.page; this.hasNext = data.hasNext; this.loading = false; this.cdr.markForCheck(); },
      error: () => { if (request !== this.request) return; this.loading = false; this.erreur = 'Impossible de charger les matchs. Sélectionnez à nouveau le championnat.'; this.cdr.markForCheck(); }
    });
  }
}
