import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changer-mot-de-passe',
  imports: [FormsModule],
  templateUrl: './changer-mot-de-passe.html',
  styleUrl: './changer-mot-de-passe.css',
})
export class ChangerMotDePasse {

  private authService = inject(AuthService);
  private router = inject(Router);

  nouveauMotDePasse = '';
  confirmationMotDePasse = '';

  errorMessage = '';

  changerMotDePasse() {

    this.errorMessage = '';

    if (this.nouveauMotDePasse.length < 8) {
      this.errorMessage =
        'Le mot de passe doit contenir au moins 8 caractères';
      return;
    }

    if (this.nouveauMotDePasse !== this.confirmationMotDePasse) {
      this.errorMessage =
        'Les mots de passe ne correspondent pas';
      return;
    }

    this.authService.changerMotDePasse(
      this.nouveauMotDePasse,
      this.confirmationMotDePasse
    ).subscribe({

      next: () => {

        console.log('Mot de passe modifié avec succès !');

        this.router.navigate(['/responsable']);

      },

      error: (error) => {

        this.errorMessage =
          error.error?.message || 'Erreur lors du changement du mot de passe';

      }

    });

  }


}
