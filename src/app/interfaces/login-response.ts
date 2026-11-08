export interface LoginResponse {
   
  token: string;
  id: number | null;
  nom: string | null;
  prenom: string | null;
  email: string;
  clubId: number | null;
  motDePasseProvisoire: boolean;
  role: 'ADMIN' | 'RESPONSABLE_CLUB';

}
