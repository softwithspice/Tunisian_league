import { CalendarMatch } from './CalendarMatch';

export type MatchEventType = 'BUT' | 'BUT_CONTRE_SON_CAMP' | 'CARTON_JAUNE' | 'CARTON_ROUGE';

export interface MatchEventInput {
  joueurId: number;
  clubId: number;
  type: MatchEventType;
  minute: number;
  passeurId?: number | null;
}

export interface MatchEventView extends MatchEventInput {
  joueurNom: string | null;
  joueurPrenom: string | null;
  clubNom: string | null;
  passeurNom: string | null;
  passeurPrenom: string | null;
}

export interface MatchDetails extends CalendarMatch {
  championnatId: number;
  evenements: MatchEventView[];
}

export interface MatchResultUpdate {
  butsDomicile: number;
  butsExterieur: number;
  /** When supplied, this replaces every stored event for the match. */
  evenements?: MatchEventInput[];
}
