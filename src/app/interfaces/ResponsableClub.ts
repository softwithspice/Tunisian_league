export interface ResponsableClubInterface {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  motDePasse?: string;
  telephone: string;
  clubId: number;
}
