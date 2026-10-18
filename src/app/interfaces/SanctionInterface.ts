export interface SanctionInterface {
  id?: number;
  typeSanction: string;
  motif: string;
  dateSanction: string; 
  duree: number;
  idJoueur?: number | null; 
  idClub?: number | null;  
}