import { Component, OnInit, inject, signal } from '@angular/core';
import { RecrutementService } from '../../services/recrutement-service';
import { DemandeRecrutementInterface } from '../../interfaces/Demande_recrutement';

@Component({
  selector: 'app-gerer-demandes',
  imports: [],
  templateUrl: './gerer-demandes.html',
  styleUrl: './gerer-demandes.css',
})
export class GererDemandes  implements OnInit {
  private readonly recrutementService = inject(RecrutementService);

  demandes = signal<DemandeRecrutementInterface[]>([]);
  chargement = signal(true);
  erreur = signal('');
  message = signal('');
  enCours = signal<number | null>(null); // id de la demande en cours de traitement

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.recrutementService.getDemandes().subscribe({
      next: (data) => {
        this.demandes.set(data);
        this.chargement.set(false);
      },
      error: () => {
        this.erreur.set('Impossible de charger les demandes.');
        this.chargement.set(false);
      },
    });
  }

  accepter(d: DemandeRecrutementInterface): void {
    this.traiter(d, true);
  }

  refuser(d: DemandeRecrutementInterface): void {
    this.traiter(d, false);
  }

  private traiter(d: DemandeRecrutementInterface, accepter: boolean): void {
    if (d.id === undefined) {
      this.erreur.set('Demande invalide : identifiant manquant.');
      return;
    }

    this.erreur.set('');
    this.message.set('');
    this.enCours.set(d.id);

    const appel = accepter
      ? this.recrutementService.accepterDemande(d.id)
      : this.recrutementService.refuserDemande(d.id);

    appel.subscribe({
      next: () => {
        this.message.set(
          accepter
            ? `Demande acceptée : ${d.nomJoueur} rejoint ${d.nomClubDemandeur}.`
            : `Demande refusée pour ${d.nomJoueur}.`,
        );
        this.enCours.set(null);
        this.charger(); // recharge : statuts et clubs actuels ont pu changer
      },
      error: (err) => {
        this.erreur.set(
          err.status === 409
            ? 'Cette demande a déjà été traitée.'
            : 'Échec du traitement de la demande.',
        );
        this.enCours.set(null);
        this.charger();
      },
    });
  }
}