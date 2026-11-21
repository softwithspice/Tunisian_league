import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ChampionnatInterface } from '../../interfaces/ChampionnatInterface';
import { CalendarMatch } from '../../interfaces/CalendarMatch';
import { MatchDetails, MatchEventType, MatchEventView } from '../../interfaces/MatchDetails';
import { JoueurInterface } from '../../interfaces/JoueursInterface';
import { ChampionnatService } from '../../services/championnat-service';
import { ClubService } from '../../services/club-service';
import { MatchService } from '../../services/match-service';

interface EventDraft {
  clubId: number;
  joueurId: number;
  type: MatchEventType;
  minute: number | null;
  passeurId: number | null;
}

interface PlayerOption { id: number; label: string }

@Component({
  selector: 'app-saisie-resultat',
  imports: [FormsModule],
  templateUrl: './saisie-resultat.html',
  styleUrl: './saisie-resultat.css'
})
export class SaisieResultat {
  private readonly championnatsService = inject(ChampionnatService);
  private readonly matchesService = inject(MatchService);
  private readonly clubsService = inject(ClubService);
  private readonly cdr = inject(ChangeDetectorRef);

  championnats: ChampionnatInterface[] = [];
  journees: number[] = [];
  matches: CalendarMatch[] = [];
  championnatId = 0;
  journee = 0;
  matchId = 0;
  page = 0;
  hasNext = false;
  details: MatchDetails | null = null;
  butsDomicile: number | null = null;
  butsExterieur: number | null = null;
  evenements: EventDraft[] = [];
  playersByClub: Record<number, PlayerOption[]> = {};
  loadingChampionnats = true;
  loadingJournees = false;
  loadingMatches = false;
  loadingDetails = false;
  playersReady = false;
  saving = false;
  error = '';
  notice = '';
  private selectionVersion = 0;

  readonly eventTypes: { value: MatchEventType; label: string }[] = [
    { value: 'BUT', label: 'But' },
    { value: 'BUT_CONTRE_SON_CAMP', label: 'But contre son camp' },
    { value: 'CARTON_JAUNE', label: 'Carton jaune' },
    { value: 'CARTON_ROUGE', label: 'Carton rouge' }
  ];

  constructor() {
    this.championnatsService.getChampionnats().subscribe({
      next: data => { this.championnats = data; this.loadingChampionnats = false; this.cdr.markForCheck(); },
      error: () => { this.loadingChampionnats = false; this.error = 'Impossible de charger les championnats.'; this.cdr.markForCheck(); }
    });
  }

  changerChampionnat(): void {
    const version = ++this.selectionVersion;
    this.journee = 0;
    this.journees = [];
    this.loadingJournees = false;
    this.resetMatches();
    this.clearMessages();
    if (!this.championnatId) return;
    this.loadingJournees = true;
    this.championnatsService.getMatchdays(Number(this.championnatId)).subscribe({
      next: days => { if (version !== this.selectionVersion) return; this.journees = days; this.loadingJournees = false; this.cdr.markForCheck(); },
      error: () => { if (version !== this.selectionVersion) return; this.loadingJournees = false; this.error = 'Impossible de charger les journées.'; this.cdr.markForCheck(); }
    });
  }

  changerJournee(): void {
    ++this.selectionVersion;
    this.resetMatches();
    this.clearMessages();
    if (this.journee) this.chargerMatches(0);
  }

  chargerMatches(page: number): void {
    if (!this.championnatId || !this.journee || page < 0) return;
    const version = ++this.selectionVersion;
    this.resetDetails();
    this.clearMessages();
    this.loadingMatches = true;
    this.championnatsService.getMatches(Number(this.championnatId), page, Number(this.journee)).subscribe({
      next: data => {
        if (version !== this.selectionVersion) return;
        this.matches = data.content;
        this.page = data.page;
        this.hasNext = data.hasNext;
        this.loadingMatches = false;
        this.cdr.markForCheck();
      },
      error: () => { if (version !== this.selectionVersion) return; this.loadingMatches = false; this.error = 'Impossible de charger les matchs.'; this.cdr.markForCheck(); }
    });
  }

  changerMatch(): void {
    const version = ++this.selectionVersion;
    const matchId = Number(this.matchId);
    this.resetDetails();
    this.matchId = matchId;
    this.clearMessages();
    if (!matchId) return;
    this.loadingDetails = true;
    this.matchesService.getMatchDetails(matchId).subscribe({
      next: details => {
        if (version !== this.selectionVersion) return;
        this.details = details;
        this.butsDomicile = details.butsDomicile;
        this.butsExterieur = details.butsExterieur;
        this.evenements = details.evenements.map(event => ({
          clubId: event.clubId, joueurId: event.joueurId, type: event.type,
          minute: event.minute, passeurId: event.passeurId ?? null
        }));
        const home = details.clubDomicileId;
        const away = details.clubExterieurId;
        if (home == null || away == null) {
          this.loadingDetails = false;
          this.error = 'Les clubs de ce match sont incomplets.';
          this.cdr.markForCheck();
          return;
        }
        forkJoin({ home: this.clubsService.getJoueursByClub(home), away: this.clubsService.getJoueursByClub(away) }).subscribe({
          next: players => {
            if (version !== this.selectionVersion) return;
            this.playersByClub = {
              [home]: this.playerOptions(players.home, details.evenements, home),
              [away]: this.playerOptions(players.away, details.evenements, away)
            };
            this.playersReady = true;
            this.loadingDetails = false;
            this.cdr.markForCheck();
          },
          error: () => {
            if (version !== this.selectionVersion) return;
            this.loadingDetails = false;
            this.error = 'Impossible de charger les joueurs. Réessayez en sélectionnant le match.';
            this.cdr.markForCheck();
          }
        });
        this.cdr.markForCheck();
      },
      error: () => { if (version !== this.selectionVersion) return; this.loadingDetails = false; this.error = 'Impossible de charger le détail du match.'; this.cdr.markForCheck(); }
    });
  }

  ajouterEvenement(): void {
    if (!this.details?.clubDomicileId) return;
    this.evenements.push({ clubId: this.details.clubDomicileId, joueurId: 0, type: 'BUT', minute: null, passeurId: null });
    this.clearMessages();
  }

  changerClub(event: EventDraft): void { event.joueurId = 0; event.passeurId = null; }
  changerType(event: EventDraft): void { if (event.type !== 'BUT') event.passeurId = null; }
  joueursDuClub(clubId: number): PlayerOption[] { return this.playersByClub[clubId] ?? []; }

  enregistrer(): void {
    if (!this.details || !this.playersReady || this.loadingDetails || this.saving) return;
    this.clearMessages();
    const homeScore = Number(this.butsDomicile);
    const awayScore = Number(this.butsExterieur);
    if (this.butsDomicile === null || this.butsExterieur === null ||
        !Number.isInteger(homeScore) || !Number.isInteger(awayScore) || homeScore < 0 || awayScore < 0) {
      this.error = 'Saisissez deux scores entiers et positifs ou nuls.';
      return;
    }
    let homeGoals = 0;
    let awayGoals = 0;
    for (const event of this.evenements) {
      const players = this.joueursDuClub(Number(event.clubId));
      const playerId = Number(event.joueurId);
      const passerId = event.passeurId == null || Number(event.passeurId) === 0 ? null : Number(event.passeurId);
      if (!this.isMatchClub(Number(event.clubId)) || !Number.isInteger(event.minute) || event.minute! < 0 ||
          !players.some(player => player.id === playerId) ||
          (passerId !== null && (event.type !== 'BUT' || passerId === playerId || !players.some(player => player.id === passerId)))) {
        this.error = 'Vérifiez le club, le joueur, la minute et le passeur de chaque événement.';
        return;
      }
      if (event.type === 'BUT' || event.type === 'BUT_CONTRE_SON_CAMP') {
        const homeClub = Number(event.clubId) === this.details.clubDomicileId;
        if (homeClub !== (event.type === 'BUT_CONTRE_SON_CAMP')) homeGoals++;
        else awayGoals++;
      }
    }
    if (homeGoals !== homeScore || awayGoals !== awayScore) {
      this.error = 'Les événements de but doivent correspondre au score final.';
      return;
    }
    this.saving = true;
    const matchId = this.details.id;
    const version = this.selectionVersion;
    this.matchesService.updateResult(matchId, {
      butsDomicile: homeScore, butsExterieur: awayScore,
      evenements: this.evenements.map(event => ({
        clubId: Number(event.clubId), joueurId: Number(event.joueurId),
        type: event.type, minute: Number(event.minute),
        passeurId: event.passeurId == null || Number(event.passeurId) === 0 ? null : Number(event.passeurId)
      }))
    }).subscribe({
      next: () => {
        if (version !== this.selectionVersion) return;
        this.saving = false;
        this.details = { ...this.details!, butsDomicile: homeScore, butsExterieur: awayScore };
        this.matches = this.matches.map(match => match.id === matchId ? { ...match, butsDomicile: homeScore, butsExterieur: awayScore } : match);
        this.notice = 'Résultat enregistré. Le classement et les statistiques sont en cours de mise à jour.';
        this.cdr.markForCheck();
      },
      error: err => {
        if (version !== this.selectionVersion) return;
        this.saving = false;
        this.error = err.status === 400 && typeof err.error?.detail === 'string'
          ? err.error.detail : err.status === 403 ? 'Accès administrateur requis.' : 'Enregistrement impossible. Réessayez.';
        this.cdr.markForCheck();
      }
    });
  }

  private playerOptions(players: JoueurInterface[], events: MatchEventView[], clubId: number): PlayerOption[] {
    const options = new Map<number, PlayerOption>();
    for (const player of players) if (player.id != null) options.set(player.id, { id: player.id, label: `${player.prenom} ${player.nom}` });
    for (const event of events.filter(item => item.clubId === clubId)) {
      if (!options.has(event.joueurId)) options.set(event.joueurId, {
        id: event.joueurId, label: `${event.joueurPrenom ?? ''} ${event.joueurNom ?? ''}`.trim() || `Joueur #${event.joueurId}`
      });
      if (event.passeurId != null && !options.has(event.passeurId)) options.set(event.passeurId, {
        id: event.passeurId, label: `${event.passeurPrenom ?? ''} ${event.passeurNom ?? ''}`.trim() || `Joueur #${event.passeurId}`
      });
    }
    return [...options.values()].sort((a, b) => a.label.localeCompare(b.label));
  }

  private isMatchClub(clubId: number): boolean {
    return clubId === this.details?.clubDomicileId || clubId === this.details?.clubExterieurId;
  }
  private clearMessages(): void { this.error = ''; this.notice = ''; }
  private resetDetails(): void {
    this.matchId = 0;
    this.details = null;
    this.butsDomicile = null;
    this.butsExterieur = null;
    this.evenements = [];
    this.playersByClub = {};
    this.playersReady = false;
    this.loadingDetails = false;
  }
  private resetMatches(): void {
    this.resetDetails();
    this.matches = [];
    this.page = 0;
    this.hasNext = false;
    this.loadingMatches = false;
  }
}
