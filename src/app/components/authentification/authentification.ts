
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './authentification.html',
  styleUrl: './authentification.css'
})
export class AUTHENTIFICATION {

  errorMessage = '';

  constructor(private router: Router) {}

  seConnecter(email: string, password: string): void {

    this.errorMessage = '';
// vaa changer de reel code


    if (
      email === 'admin@tunisianleague.tn' &&
      password === 'Admin123!'
    ) {
      this.router.navigate(['/admin']);
    }
    else if (
      email === 'responsable@tunisianleague.tn' &&
      password === 'Resp123!'
    ) {
      this.router.navigate(['/responsable']);
    }
    // jusquaa iciiiii 
    else {
      this.errorMessage = 'Email ou mot de passe incorrect.';
    }
  }
}
