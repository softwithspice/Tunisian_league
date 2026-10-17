import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonneesService } from '../../services/donnees';

@Component({
  selector: 'app-ajouter-compte',
  imports: [FormsModule],
  templateUrl: './ajouter-compte.html',
  styleUrl: './ajouter-compte.css',
})
export class AjouterCompte {
  protected readonly data = inject(DonneesService);
  private readonly location = inject(Location);

  responsable = this.nouveau();
  message = '';

  private nouveau() {
    return { nom: '', prenom: '', email: '', telephone: '', motDePasse: '', clubId: null as number | null };
  }

  /** Un club n'a qu'un responsable (ResponsableClub 1 — 1 Club) : on masque les clubs déjà pris. */
  clubsLibres() {
    const pris = new Set(this.data.responsables.map((r) => r.clubId));
    return this.data.clubs.filter((c) => !pris.has(c.id));
  }

  enregistrerResponsable() {
    const r = this.responsable;
    if (!r.nom.trim() || !r.prenom.trim() || !r.telephone.trim() || r.clubId === null) {
      this.message = 'Veuillez remplir tous les champs et choisir un club.';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(r.email)) {
      this.message = 'Email invalide.';
      return;
    }
    if (r.motDePasse.length < 6) {
      this.message = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }
    this.data.ajouterResponsable({
      nom: r.nom.trim(), prenom: r.prenom.trim(), email: r.email.trim(),
      telephone: r.telephone.trim(), motDePasse: r.motDePasse, clubId: r.clubId,
    });
    this.message = 'Compte créé avec succès.';
    this.responsable = this.nouveau();
  }

  retour() {
    this.location.back();
  }
}