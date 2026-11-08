import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClubService } from '../../services/club-service';
import { ClubInterface } from '../../interfaces/ClubInterface';
import { JoueurInterface } from '../../interfaces/JoueursInterface';

@Component({
  selector: 'app-club-joueurs',
  imports: [RouterLink],
  templateUrl: './club-joueurs.html',
  styleUrl: './club-joueurs.css',
})
export class ClubJoueurs implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly clubService = inject(ClubService);

  club = signal<ClubInterface | null>(null);
  joueurs = signal<JoueurInterface[]>([]);
  chargement = signal(true);
  erreur = signal('');

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const clubId = Number(params.get('clubId'));

      if (!Number.isInteger(clubId) || clubId <= 0) {
        this.erreur.set('Club introuvable.');
        this.chargement.set(false);
        return;
      }

      this.charger(clubId);
    });
  }

  private charger(clubId: number): void {
    this.chargement.set(true);
    this.erreur.set('');

    this.clubService.getClubs().subscribe({
      next: (clubs) => this.club.set(clubs.find((c) => c.id === clubId) ?? null),
      error: () => this.club.set(null), // le nom du club est facultatif : l'erreur est geree plus bas
    });

    this.clubService.getJoueursByClub(clubId).subscribe({
      next: (liste) => {
        this.joueurs.set(liste);
        this.chargement.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.erreur.set(
          err.status === 404
            ? 'Club introuvable.'
            : err.status === 0
              ? 'Impossible de joindre le serveur.'
              : 'Erreur du serveur (' + err.status + ').'
        );
        this.chargement.set(false);
      },
    });
  }

  calculerAge(dateNaissance: string): number | null {
    if (!dateNaissance) return null;
    const naissance = new Date(dateNaissance);
    const aujourdhui = new Date();
    let age = aujourdhui.getFullYear() - naissance.getFullYear();
    const moisDiff = aujourdhui.getMonth() - naissance.getMonth();
    if (moisDiff < 0 || (moisDiff === 0 && aujourdhui.getDate() < naissance.getDate())) {
      age--;
    }
    return age;
  }
}
