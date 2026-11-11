import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ChampionnatService } from '../../services/championnat-service';
import { ClubService } from '../../services/club-service';
import { ChampionnatInterface } from '../../interfaces/ChampionnatInterface';
import { ClubInterface } from '../../interfaces/ClubInterface';

@Component({ selector: 'app-journee', imports: [FormsModule], templateUrl: './journee.html', styleUrl: './journee.css' })
export class Journee {
  private service = inject(ChampionnatService);
  private cdr = inject(ChangeDetectorRef);
  championnats: ChampionnatInterface[] = [];
  clubs: ClubInterface[] = [];
  championnatId = 0;
  journee = 1;
  matches = [{ domicile: 0, exterieur: 0, date: '' }];
  loading = true;
  saving = false;
  message = '';

  constructor() {
    forkJoin({ championnats: this.service.getChampionnats(), clubs: inject(ClubService).getClubs() }).subscribe({
      next: data => { this.championnats = data.championnats; this.clubs = data.clubs; this.loading = false; this.cdr.markForCheck(); },
      error: () => { this.message = 'Impossible de charger les données. Rechargez la page.'; this.loading = false; this.cdr.markForCheck(); }
    });
  }
  changerChampionnat(): void { this.matches = [{ domicile: 0, exterieur: 0, date: '' }]; this.message = ''; }
  ajouter(): void { this.matches.push({ domicile: 0, exterieur: 0, date: '' }); }
  enregistrer(): void {
    const ids = this.clubs.map(c => c.id);
    const participants = this.matches.flatMap(m => [Number(m.domicile), Number(m.exterieur)]);
    if (!this.championnats.some(c => c.id === Number(this.championnatId)) || !Number.isInteger(Number(this.journee)) || Number(this.journee) < 1 || !this.matches.length ||
        this.matches.some(m => !m.date || !ids.includes(Number(m.domicile)) || !ids.includes(Number(m.exterieur))) || new Set(participants).size !== participants.length) {
      this.message = 'Vérifiez la journée, les dates et les clubs : chaque club ne peut jouer qu’une fois.'; return;
    }
    this.saving = true; this.message = '';
    this.service.saisirJournee(this.matches.map(m => ({ championnatId: Number(this.championnatId), journee: Number(this.journee), clubDomicileId: Number(m.domicile), clubExterieurId: Number(m.exterieur), dateMatch: m.date }))).subscribe({
      next: () => { this.saving = false; this.message = 'Journée enregistrée.'; this.matches = [{ domicile: 0, exterieur: 0, date: '' }]; this.cdr.markForCheck(); },
      error: () => { this.saving = false; this.message = 'Enregistrement impossible. Vérifiez les données et réessayez.'; this.cdr.markForCheck(); }
    });
  }
}
