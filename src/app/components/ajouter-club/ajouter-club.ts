import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonneesService } from '../../services/donnees';


@Component({
  selector: 'app-ajouter-club',
  imports: [FormsModule],
  templateUrl: './ajouter-club.html',
  styleUrl: './ajouter-club.css',
})
export class AjouterClub {
  protected readonly data = inject(DonneesService);
  private readonly location = inject(Location);

  club = { nom: '', ville: '', stade: '', dateCreation: '' };
  message = '';

  enregistrerClub() {
    if (!this.club.nom.trim() || !this.club.ville.trim()) {
      this.message = 'Le nom et la ville sont obligatoires.';
      return;
    }
    this.data.ajouterClub({ ...this.club, nom: this.club.nom.trim(), ville: this.club.ville.trim() });
    this.message = 'Club ajouté avec succès.';
    this.club = { nom: '', ville: '', stade: '', dateCreation: '' };
  }

  retour() {
    this.location.back();
  }
}