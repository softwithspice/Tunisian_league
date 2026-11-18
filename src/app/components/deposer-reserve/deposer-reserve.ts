import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReserveService } from '../../services/reserve-service';
import { Match } from '../../interfaces/Match';

@Component({
  selector: 'app-deposer-reserve',
  imports: [FormsModule],
  templateUrl: './deposer-reserve.html',
  styleUrl: './deposer-reserve.css'
})
export class DeposerReserve implements OnInit {

  private reserveService = inject(ReserveService);

  matches = signal<Match[]>([]);
  matchId: number | null = null;
  motif = '';

  message = signal('');
  erreur = signal('');

  ngOnInit(): void {
    this.reserveService.getMesMatches().subscribe({
      next: (data) => {
        this.matches.set(data);
      },
      error: () => {
        this.erreur.set('Impossible de charger les matchs.');
      }
    });
  }

  deposerReserve(): void {
    this.message.set('');
    this.erreur.set('');

    if (!this.matchId || !this.motif.trim()) {
      this.erreur.set('Veuillez remplir tous les champs.');
      return;
    }

    this.reserveService.deposerReserve(
      this.matchId, this.motif
    ).subscribe({
      next: () => {
        this.message.set('Réserve déposée avec succès.');
        this.matchId = null;
        this.motif = '';
      },
      error: (err) => {
        if (err.status === 409) {
          this.erreur.set('Une réserve existe déjà pour ce match.');
        } else {
          this.erreur.set('Impossible de déposer la réserve.');
        }
      }
    });
  }
}