import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonneesService, TypeSanction } from '../../services/donnees';

@Component({
  selector: 'app-sanctions',
  imports: [FormsModule],
  templateUrl: './sanctions.html',
  styleUrl: './sanctions.css',
})
export class Sanctions {
  protected readonly data = inject(DonneesService);
  private readonly location = inject(Location);

  types: TypeSanction[] = ['AVERTISSEMENT', 'SUSPENSION', 'AMENDE'];
  sanction = this.nouvelle();
  message = '';

  private nouvelle() {
    return {
      cible: 'JOUEUR' as 'JOUEUR' | 'CLUB',
      cibleId: null as number | null,
      type: 'SUSPENSION' as TypeSanction,
      date: new Date().toISOString().slice(0, 10),
      motif: '',
      duree: 0,
    };
  }

  cible(joueurId: number | null, clubId: number | null) {
    return joueurId !== null ? 'Joueur : ' + this.data.nomJoueur(joueurId) : 'Club : ' + this.data.nomClub(clubId);
  }

  enregistrerSanction() {
    const s = this.sanction;
    if (s.cibleId === null || !s.motif.trim() || !s.date) {
      this.message = 'Choisissez le joueur ou le club, la date et le motif.';
      return;
    }
    this.data.ajouterSanction({
      type: s.type,
      motif: s.motif.trim(),
      date: s.date,
      duree: s.duree ?? 0,
      joueurId: s.cible === 'JOUEUR' ? s.cibleId : null,
      clubId: s.cible === 'CLUB' ? s.cibleId : null,
    });
    this.message = 'Sanction ajoutée avec succès.';
    this.sanction = this.nouvelle();
  }

  retour() {
    this.location.back();
  }
}