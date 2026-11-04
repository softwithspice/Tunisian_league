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

  private readonly responsableId = 1;

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
    this.recrutementService.getMesDemandes(this.responsableId).subscribe({
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

    const demande: DemandeRecrutementInterface = {
      joueurId: joueur.id,
      responsableId: this.responsableId,
      dateDemande: new Date().toISOString().slice(0, 10),
      statuDemande: 'EN_ATTENTE',
    };

    this.recrutementService.envoyerDemande(demande).subscribe({
      next: () => {
        this.joueurRecrute.set(joueur.nom);
        this.chargerMesDemandes(); // la nouvelle demande apparaît dans « Mes demandes »
      },
      error: (err) => {
        console.log('Payload envoyé :', JSON.stringify(demande));
        console.log('Réponse serveur :', err.error);
        this.erreur.set("Échec de l'envoi de la demande.");
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