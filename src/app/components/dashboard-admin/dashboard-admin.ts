
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdmin {

  constructor(private router: Router) {}

  get pageAccueil(): boolean {
    return this.router.url === '/admin';
  }

  deconnexion(): void {
    this.router.navigate(['/auth']);
  }
}
