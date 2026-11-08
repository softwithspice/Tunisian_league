import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { JoueurInterface } from '../../interfaces/JoueursInterface';
import { JoueurService } from '../../services/joueur-service';

@Component({
  selector: 'app-afficher-joueurs',
  imports: [],
  templateUrl: './afficher-joueurs.html',
  styleUrl: './afficher-joueurs.css',
})
export class AfficherJoueurs implements OnInit {

  private joueurService = inject(JoueurService);
private cdr = inject(ChangeDetectorRef);
  joueurs: JoueurInterface[] = [];
  erreur = '';
  chargement = false;

  ngOnInit(): void {
    this.chargerEffectif();
  }

  chargerEffectif(): void {
    this.chargement = true;
    this.erreur = '';

    this.joueurService.getMonEffectif().subscribe({
      next: (data) => {
  this.joueurs = [...data];
  this.chargement = false;

  this.cdr.detectChanges();

  console.log('Effectif du club :', this.joueurs);
},
      error: (err) => {
        console.error('Erreur chargement effectif :', err);
        this.erreur = 'Impossible de charger votre effectif.';
        this.chargement = false;
      }
    });
  }
}