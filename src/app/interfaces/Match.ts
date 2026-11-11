export interface Match {
  id?: number;
  championnatId: number;
  journee: number;
  clubDomicileId: number;
  clubExterieurId: number;
  clubDomicileNom?: string | null;
  clubExterieurNom?: string | null;
  dateMatch: string;
  butsDomicile?: number | null;
  butsExterieur?: number | null;
}
