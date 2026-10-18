import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SanctionService } from '../../services/sanction-service';
import { JoueurService } from '../../services/joueur-service';
import { ClubService } from '../../services/club-service';
import { JoueurInterface } from '../../interfaces/JoueursInterface';
import { ClubInterface } from '../../interfaces/ClubInterface';


@Component({
  selector: 'app-sanctions',
  imports: [FormsModule],
  templateUrl: './sanctions.html',
  styleUrl: './sanctions.css',
})
export class Sanctions implements OnInit {
  private readonly sanctionService = inject(SanctionService);
  private readonly joueurService = inject(JoueurService);
  private readonly clubService = inject(ClubService);
  private readonly location = inject(Location);
  private readonly cdr = inject(ChangeDetectorRef);

  types = ['AVERTISSEMENT', 'SUSPENSION'];
  joueurs: JoueurInterface[] = [];
  clubs: ClubInterface[] = [];
  sanction = this.nouvelle();
  message = '';

  private nouvelle() {
    return {
      cible: 'JOUEUR' as 'JOUEUR' | 'CLUB',
      cibleId: null as number | null,
      type: 'SUSPENSION',
      date: new Date().toISOString().slice(0, 10),
      motif: '',
      duree: 0,
    };
  }

  ngOnInit() {
    this.joueurService.getJoueurs().subscribe({
      next: (liste) => {
        this.joueurs = liste;
        this.cdr.markForCheck();
      },
      error: () => {
        this.message = 'Impossible de charger les joueurs.';
        this.cdr.markForCheck();
      },
    });

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

  enregistrerSanction() {
    this.message = '';
    const s = this.sanction;

    if (s.cibleId === null || !s.motif.trim() || !s.date) {
      this.message = 'Choisissez le joueur ou le club, la date et le motif.';
      return;
    }

   const payload = {
  typeSanction: s.type,
  motif: s.motif.trim(),
  dateSanction: s.date,
  duree: s.duree ?? 0,
  idJoueur: s.cible === 'JOUEUR' ? s.cibleId : undefined,
  idClub: s.cible === 'CLUB' ? s.cibleId : undefined,
};
console.log('Payload envoyé :', payload);

this.sanctionService.addSanction(payload).subscribe({
  next: () => {
    this.message = 'Sanction ajoutée avec succès.';
    this.sanction = this.nouvelle();
    this.cdr.markForCheck();
  },
  error: (err) => {
    console.log('Réponse du back :', err.error);
    this.message = 'Erreur ' + err.status + ' : ' + JSON.stringify(err.error);
    this.cdr.markForCheck();
  },
});
 
   
  }

  private texteErreur(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Impossible de joindre le serveur.';
    if (err.status === 400) return 'Données invalides : vérifiez les champs.';
    if (err.status === 404) return 'Joueur ou club introuvable.';
    return 'Erreur du serveur (' + err.status + ').';
  }

  retour() {
    this.location.back();
  }
}