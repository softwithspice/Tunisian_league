import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClubService } from '../../services/club-service';
import { ClubInterface } from '../../interfaces/ClubInterface';

@Component({
  selector: 'app-acceuil',
  imports: [RouterLink],
  templateUrl: './acceuil.html',
  styleUrl: './acceuil.css',
})
export class Acceuil implements OnInit {
  private readonly clubService = inject(ClubService);

  //liste des clubs pour acceder a leurs joueurs
  clubs = signal<ClubInterface[]>([]);
  chargement = signal(true);
  erreur = signal('');

  ngOnInit(): void {
    this.clubService.getClubs().subscribe({
      next: (liste) => {
        this.clubs.set(liste);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les clubs.');
        this.chargement.set(false);
      },
    });
  }
}
