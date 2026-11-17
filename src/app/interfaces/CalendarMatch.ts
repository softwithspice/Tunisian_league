export interface CalendarMatch {
  journee: number;
  clubDomicileId: number;
  clubExterieurId: number;
  clubDomicileNom: string | null;
  clubExterieurNom: string | null;
  dateMatch: string;
  butsDomicile: number | null;
  butsExterieur: number | null;
}