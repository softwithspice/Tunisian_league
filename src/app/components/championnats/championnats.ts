import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonneesService } from '../../services/donnees';

@Component({
  selector: 'app-championnats',
  imports: [FormsModule],
  templateUrl: './championnats.html',
  styleUrl: './championnats.css',
})
export class Championnats {
  protected readonly data = inject(DonneesService);
  private readonly location = inject(Location);

  championnat = { nom: '', saison: '', clubIds: [] as number[] };
  message = '';

  basculer(id: number) {
    const l = this.championnat.clubIds;
    this.championnat.clubIds = l.includes(id) ? l.filter((x) => x !== id) : [...l, id];
  }

  noms(ids: number[]) {
    return ids.map((id) => this.data.nomClub(id)).join(', ') || '—';
  }

  enregistrerChampionnat() {
    const c = this.championnat;
    if (!c.nom.trim()) {
      this.message = 'Le nom du championnat est obligatoire.';
      return;
    }
    if (!/^\d{4}-\d{4}$/.test(c.saison)) {
      this.message = 'La saison doit avoir le format 2026-2027.';
      return;
    }
    this.data.ajouterChampionnat({ nom: c.nom.trim(), saison: c.saison, clubIds: c.clubIds });
    this.message = 'Championnat ajouté avec succès.';
    this.championnat = { nom: '', saison: '', clubIds: [] };
  }

  retour() {
    this.location.back();
  }
}