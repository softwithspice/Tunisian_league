import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResponsableClubService } from '../../services/responsable-club';
import { ClubService } from '../../services/club-service';
import { ClubInterface } from '../../interfaces/ClubInterface';


@Component({
  selector: 'app-ajouter-compte',
  imports: [FormsModule],
  templateUrl: './ajouter-compte.html',
  styleUrl: './ajouter-compte.css',
})
export class AjouterCompte implements OnInit {
  private readonly responsableService = inject(ResponsableClubService);
  private readonly clubService = inject(ClubService);
  private readonly location = inject(Location);
  private readonly cdr = inject(ChangeDetectorRef);

  responsable = this.nouveau();
  clubs: ClubInterface[] = [];
  message = '';

  private nouveau() {
    return {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      clubId: null as number | null,
    };
  }

  ngOnInit() {
    this.clubService.getClubs().subscribe({
      next: (liste) => {
        this.clubs = liste;
        this.cdr.markForCheck();
      },
      error: () => {
        this.message = 'Impossible de charger les clubs.';
        this.cdr.markForCheck();
      },
    });
  }

  enregistrerResponsable() {
    this.message = '';
    const r = this.responsable;

    if (!r.nom.trim() || !r.prenom.trim() || !r.telephone.trim()) {
      this.message = 'Veuillez remplir tous les champs.';
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(r.email)) {
      this.message = 'Email invalide.';
      return;
    }
    if (r.clubId === null) {
      this.message = 'Veuillez choisir un club.';
      return;
    }
    

    const nomComplet = `${r.prenom.trim()} ${r.nom.trim()}`;

    this.responsableService
      .addResponsable({
        nom: r.nom.trim(),
        prenom: r.prenom.trim(),
        email: r.email.trim(),
        telephone: r.telephone.trim(),
        clubId: r.clubId,
      })
      .subscribe({
        next: () => {
          this.message = `Compte de « ${nomComplet} » créé avec succès.`;
          this.responsable = this.nouveau();
          this.cdr.markForCheck();
        },
       error: (err: HttpErrorResponse) => {
  console.log('HTTP STATUS:', err.status);
  console.log('ERROR BODY:', err.error);

  this.message = this.texteErreur(err);
  this.cdr.markForCheck();
}
      });
  }

  private texteErreur(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Impossible de joindre le serveur.';
    if (err.status === 400) return 'Données invalides : vérifiez les champs.';
    if (err.status === 409) return 'Email déjà utilisé, ou ce club a déjà un responsable.';
    return 'Erreur du serveur (' + err.status + ').';
  }

  retour() {
    this.location.back();
  }
}