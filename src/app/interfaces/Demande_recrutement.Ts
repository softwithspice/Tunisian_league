export type StatutDemande = 'EN_ATTENTE' | 'ACCEPTEE' | 'REFUSEE';

export interface DemandeRecrutementInterface {
  id: number;
  dateDemande: string;
  statut: StatutDemande;
  dateTraitement?: string;
  joueurId: number;
  responsableId: number;
}