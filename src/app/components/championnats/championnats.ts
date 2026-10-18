import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChampionnatService } from '../../services/championnat-service';
import { ClubService } from '../../services/club-service';
import { ClubInterface } from '../../interfaces/ClubInterface';


@Component({
  selector: 'app-championnats',
  imports: [FormsModule],
  templateUrl: './championnats.html',
  styleUrl: './championnats.css',
})
export class Championnats implements OnInit {
  private readonly championnatService = inject(ChampionnatService);
  private readonly clubService = inject(ClubService);
  private readonly location = inject(Location);
  private readonly cdr = inject(ChangeDetectorRef);

  championnat = { nom: '', saison: '' };
  clubs: ClubInterface[] = [];
  clubIds: number[] = [];
  message = '';

  ngOnInit() {
    this.clubService.getClubs().subscribe({
      next: (liste) => {
        this.clubs = liste;
        this.cdr.markForCheck();
      },
      error: () => {
        this.message = 'Impossible de charger les clubs.';
        this.cdr.markForCheck();
      },
    });
  }

  basculer(id: number) {
    this.clubIds = this.clubIds.includes(id)
      ? this.clubIds.filter((x) => x !== id)
      : [...this.clubIds, id];
  }

  enregistrerChampionnat() {
    this.message = '';
    const c = this.championnat;

    if (!c.nom.trim()) {
      this.message = 'Le nom du championnat est obligatoire.';
      return;
    }
    if (!/^\d{4}-\d{4}$/.test(c.saison)) {
      this.message = 'La saison doit avoir le format 2026-2027.';
      return;
    }
    if (this.clubIds.length < 2) {
      this.message = 'Choisissez au moins 2 clubs participants.';
      return;
    }

    this.championnatService
      .addChampionnat({ nom: c.nom.trim(), saison: c.saison, clubIds: this.clubIds })
      .subscribe({
        next: (saved) => {
          this.message = `Championnat « ${saved.nom} » ajouté avec succès.`;
          this.championnat = { nom: '', saison: '' };
          this.clubIds = [];
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.message = this.texteErreur(err);
          this.cdr.markForCheck();
        },
      });
  }

  private texteErreur(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Impossible de joindre le serveur.';
    if (err.status === 400) return 'Données invalides : vérifiez les champs.';
    return 'Erreur du serveur (' + err.status + ').';
  }

  retour() {
    this.location.back();
  }
}