import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonneesService, Poste } from '../../services/donnees';


@Component({
  selector: 'app-joueurs',
  imports: [FormsModule],
  templateUrl: './joueurs.html',
  styleUrl: './joueurs.css',
})
export class Joueurs {
  protected readonly data = inject(DonneesService);
  private readonly location = inject(Location);

  postes: Poste[] = ['GARDIEN', 'DEFENSEUR', 'MILIEU', 'ATTAQUANT'];
  joueur = this.nouveau();
  message = '';

  private nouveau() {
    return {
      nom: '',
      prenom: '',
      dateNaissance: '',
      poste: 'MILIEU' as Poste,
      nationalite: 'Tunisienne',
      clubId: null as number | null,
    };
  }

  enregistrerJoueur() {
    const j = this.joueur;
    if (!j.nom.trim() || !j.prenom.trim() || !j.dateNaissance || !j.nationalite.trim()) {
      this.message = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    this.data.ajouterJoueur({ ...j, nom: j.nom.trim(), prenom: j.prenom.trim(), nationalite: j.nationalite.trim() });
    this.message = 'Joueur ajouté avec succès.';
    this.joueur = this.nouveau();
  }

  retour() {
    this.location.back();
  }
}