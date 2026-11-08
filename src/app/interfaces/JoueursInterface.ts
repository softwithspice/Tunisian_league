

export interface JoueurInterface {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  poste: string;
  nationalite: string;
  clubId?: number | null; 
}
