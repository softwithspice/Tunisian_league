export type StatutDemande = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export interface DemandeRecrutementInterface {
  id?: number;
  dateDemande: string;
  statuDemande: StatutDemande;
  dateTraitement?: string;
  joueurId: number;
  responsableId: number;
  nomClubDemandeur?: string;
  nomJoueur?: string;
  clubActuelJoueur?: string | null; 

}