
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-authentification',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './authentification.html',
  styleUrl: './authentification.css'
})
export class AUTHENTIFICATION {
  private authService = inject(AuthService);
private router = inject(Router);
 errorMessage="";
seConnecter(email: string, password: string) {

  this.authService.login(email, password).subscribe({next: (response) => {

  console.log('Connexion réussie !');
  console.log(response);

  sessionStorage.setItem('token', response.token);

  if (response.role === 'ADMIN') {
    this.router.navigate(['/admin']);
  }

  else if (response.motDePasseProvisoire) {
    this.router.navigate(['/changer-mot-de-passe']);
  }

  else {
    sessionStorage.setItem('clubId', String(response.clubId));
  

    this.router.navigate(['/responsable']);
  }

},


    error: (error) => {
      this.errorMessage = 'Email ou mot de passe incorrect';
    }

  });

}





}
