import { Component, OnInit, inject, signal } from '@angular/core';
import { RecrutementService } from '../../services/recrutement-service';
import { JoueurInterface } from '../../interfaces/JoueursInterface';
import { DemandeRecrutementInterface } from '../../interfaces/Demande_recrutement';

@Component({
  selector: 'app-demande-recrutement',
  templateUrl: './demande-recrutement.html',
  styleUrl: './demande-recrutement.css',
})
export class DemandeRecrutement implements OnInit {
  private recrutementService = inject(RecrutementService);


  joueurs = signal<JoueurInterface[]>([]);
  mesDemandes = signal<DemandeRecrutementInterface[]>([]);
  joueurRecrute = signal('');
  chargement = signal(true);
  erreur = signal('');

  ngOnInit(): void {
    this.recrutementService.getJoueurs().subscribe({
      next: (data) => {
        this.joueurs.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les joueurs.');
        this.chargement.set(false);
      },
    });

    this.chargerMesDemandes();
  }

  chargerMesDemandes(): void {
   this.recrutementService.getMesDemandes().subscribe({
      next: (data) => this.mesDemandes.set(data),
      error: () => this.erreur.set('Impossible de charger vos demandes.'),
    });
  }

  recruter(joueur: JoueurInterface): void {
    if (joueur.id === undefined) {
      this.erreur.set('Joueur invalide : identifiant manquant.');
      return;
    }

    this.erreur.set('');
    this.joueurRecrute.set('');

  this.recrutementService.envoyerDemande(joueur.id).subscribe({
  next: () => {
    this.joueurRecrute.set(joueur.nom);
    this.chargerMesDemandes();
  },
  error: (err) => {
    console.log('Erreur recrutement :', err);
    console.log('Réponse serveur :', err.error);

    this.erreur.set(
      err.status === 409
        ? 'Ce joueur appartient déjà à votre club.'
        : "Échec de l'envoi de la demande."
    );
  },
});
  }

  calculerAge(dateNaissance: string): number {
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