import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SanctionInterface } from '../interfaces/SanctionInterface';


@Injectable({ providedIn: 'root' })
export class SanctionService {
  private readonly http = inject(HttpClient);


  private readonly url = 'http://localhost:8080/sanction';

  addSanction(sanction: SanctionInterface): Observable<SanctionInterface> {
    return this.http.post<SanctionInterface>(this.url, sanction);
  }
}