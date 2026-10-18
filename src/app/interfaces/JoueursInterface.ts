

export interface JoueurInterface {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  poste: String;
  nationalite: string;
  clubId?: number | null; 
}
