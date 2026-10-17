import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-responsable',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './dashboard-responsable.html',
  styleUrl: './dashboard-responsable.css',
})
export class DashboardResponsable {

    constructor(private router: Router) {}
 get pageAccueil(): boolean {
    return this.router.url === '/admin';
  }

  deconnexion(): void {
    this.router.navigate(['/auth']);
  }
}
