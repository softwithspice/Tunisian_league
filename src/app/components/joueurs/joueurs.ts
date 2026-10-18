import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JoueurService } from '../../services/joueur-service';

@Component({
  selector: 'app-joueurs',
  imports: [FormsModule],
  templateUrl: './joueurs.html',
  styleUrl: './joueurs.css',
})
export class Joueurs {
  private readonly joueurService = inject(JoueurService);
  private readonly location = inject(Location);
  private readonly cdr = inject(ChangeDetectorRef);

  postes = ['GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT'];

  joueur = { nom: '', prenom: '', dateNaissance: '', poste: 'MILIEU', nationalite: 'Tunisienne' };
  message = '';

  enregistrerJoueur() {
    this.message = '';
    const j = this.joueur;

    if (!j.nom.trim() || !j.prenom.trim() || !j.dateNaissance || !j.nationalite.trim()) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }

    this.joueurService
      .addJoueur({
        nom: j.nom.trim(),
        prenom: j.prenom.trim(),
        dateNaissance: j.dateNaissance,
        poste: j.poste,
        nationalite: j.nationalite.trim(),
      })
      .subscribe({
        next: (saved) => {
          this.message = `Joueur « ${saved.prenom} ${saved.nom} » ajouté avec succès.`;
          this.joueur = { nom: '', prenom: '', dateNaissance: '', poste: 'MILIEU', nationalite: 'Tunisienne' };
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.message = this.texteErreur(err);
          this.cdr.markForCheck();
        },
      });
  }

  private texteErreur(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Impossible de joindre le serveur.';
    if (err.status === 400) return 'Données invalides : vérifiez les champs.';
    return 'Erreur du serveur (' + err.status + ').';
  }

  retour() {
    this.location.back();
  }
}