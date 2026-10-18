import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClubService } from '../../services/club-service';

// import { ClubInterface } from '../../interfaces/club'; // pour la liste (plus tard)

@Component({
  selector: 'app-ajouter-club',
  imports: [FormsModule],
  templateUrl: './ajouter-club.html',
  styleUrl: './ajouter-club.css',
})
export class AjouterClub {
  private readonly clubService = inject(ClubService);
  private readonly location = inject(Location);
  private readonly cdr = inject(ChangeDetectorRef);

  club = { nom: '', ville: '', stade: '', dateCreation: '' };
  message = '';

  // --- Liste des clubs (plus tard) ---
  // clubs: ClubInterface[] = [];
  //
  // ngOnInit() { this.chargerClubs(); }
  //
  // chargerClubs() {
  //   this.clubService.getClubs().subscribe({
  //     next: (liste) => (this.clubs = liste),
  //     error: (err) => (this.message = this.texteErreur(err)),
  //   });
  // }

  enregistrerClub() {
    if (!this.club.nom.trim() || !this.club.ville.trim()) {
      this.message = 'Le nom et la ville sont obligatoires.';
      return;
    }

    this.clubService
      .addClub({
        nom: this.club.nom.trim(),
        ville: this.club.ville.trim(),
        stade: this.club.stade.trim() || undefined,
        dateCreation: this.club.dateCreation || undefined
       
      })
      .subscribe({
        next: (saved) => {
          this.message = `Club « ${saved.nom} » ajouté avec succès.`;
          this.club = { nom: '', ville: '', stade: '', dateCreation: '' };
           this.cdr.markForCheck();
          // this.chargerClubs(); // quand la liste sera affichée
        },
        error: (err) => {this.message = this.texteErreur(err);
       this.cdr.markForCheck();},
      });
  }

  private texteErreur(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Impossible de joindre le serveur.';
    if (err.status === 400) return 'Données invalides : vérifiez le nom et la ville.';
    return 'Erreur du serveur (' + err.status + ').';
  }

  retour() {
    this.location.back();
  }
}