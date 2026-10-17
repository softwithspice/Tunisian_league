import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demande-recrutement',
  imports: [CommonModule],

  templateUrl: './demande-recrutement.html',
  styleUrl: './demande-recrutement.css',
})
export class DemandeRecrutement {

  


  joueurRecrute = '';

  recruter(nom: string) {
    this.joueurRecrute = nom;
  }

}
