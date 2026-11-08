import { Component, inject, OnInit, signal } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { ClubService } from '../../services/club-service';

@Component({
  selector: 'app-dashboard-responsable',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-responsable.html',
  styleUrl: './dashboard-responsable.css',
})
export class DashboardResponsable implements OnInit {

  private router = inject(Router);
  private clubService = inject(ClubService);

  nomClub = signal('Chargement...');

  ngOnInit(): void {
    this.clubService.getMonClub().subscribe({
      next: (data) => {
        console.log('Données reçues :', data);

        this.nomClub.set(data.nom);
        console.log('Nom du club :', this.nomClub());
      },
      error: (err) => {
        console.error('Erreur récupération du club :', err);
        this.nomClub.set('Club indisponible');
      }
    });
  }

  get pageAccueil(): boolean {
    return this.router.url === '/responsable';
  }

  deconnexion(): void {
    sessionStorage.clear();
    this.router.navigate(['/auth']);
  }
}