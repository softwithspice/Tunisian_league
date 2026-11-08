import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SanctionService } from '../../services/sanction-service';
import { SanctionInterface } from '../../interfaces/SanctionInterface';

@Component({
  selector: 'app-mes-sanctions',
  templateUrl: './mes-sanctions.html',
  styleUrl: './mes-sanctions.css',
})
export class MesSanctions implements OnInit {
  private readonly sanctionService = inject(SanctionService);

  sanctions = signal<SanctionInterface[]>([]);
  chargement = signal(true);
  erreur = signal('');

  nbSuspensions = computed(() => this.sanctions().filter((s) => s.typeSanction === 'SUSPENSION').length);
  nbAvertissements = computed(() => this.sanctions().filter((s) => s.typeSanction === 'AVERTISSEMENT').length);

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement.set(true);
    this.erreur.set('');

    this.sanctionService.getMesSanctions().subscribe({
      next: (liste) => {
        this.sanctions.set(liste);
        this.chargement.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.erreur.set(
          err.status === 0
            ? 'Impossible de joindre le serveur.'
            : err.status === 401 || err.status === 403
              ? "Vous n'avez pas accès à cette page."
              : 'Impossible de charger les sanctions (' + err.status + ').'
        );
        this.chargement.set(false);
      },
    });
  }

  cible(s: SanctionInterface): string {
    return s.idJoueur != null ? `Joueur #${s.idJoueur}` : 'Club';
  }
}
