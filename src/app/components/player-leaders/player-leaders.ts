import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChampionnatInterface } from '../../interfaces/ChampionnatInterface';
import { PlayerLeader } from '../../interfaces/PlayerStatistics';
import { ChampionnatService } from '../../services/championnat-service';
import { PlayerStatisticsService } from '../../services/player-statistics-service';
import { rankPlayers } from './player-leaders-ranking';

@Component({
  selector: 'app-player-leaders',
  imports: [FormsModule, RouterLink],
  templateUrl: './player-leaders.html',
  styleUrl: './player-leaders.css'
})
export class PlayerLeaders {
  private readonly championnatService = inject(ChampionnatService);
  private readonly statisticsService = inject(PlayerStatisticsService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly insideManager = inject(Router).url.startsWith('/responsable');

  championnats: ChampionnatInterface[] = [];
  championnatId = 0;
  scorers: PlayerLeader[] = [];
  assistProviders: PlayerLeader[] = [];
  showAllScorers = false;
  showAllAssistProviders = false;
  loadingChampionnats = true;
  loadingStatistics = false;
  loadedStatistics = false;
  error = '';
  private request = 0;

  constructor() {
    this.championnatService.getChampionnats().subscribe({
      next: championships => {
        this.championnats = championships;
        this.loadingChampionnats = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loadingChampionnats = false;
        this.error = 'Impossible de charger les championnats.';
        this.cdr.markForCheck();
      }
    });
  }

  choisirChampionnat(): void {
    const request = ++this.request;
    this.scorers = [];
    this.assistProviders = [];
    this.showAllScorers = false;
    this.showAllAssistProviders = false;
    this.loadedStatistics = false;
    this.loadingStatistics = false;
    this.error = '';
    if (!this.championnatId) return;

    this.loadingStatistics = true;
    this.statisticsService.getByChampionship(Number(this.championnatId)).subscribe({
      next: rows => {
        if (request !== this.request) return;
        this.scorers = rankPlayers(rows, 'goals');
        this.assistProviders = rankPlayers(rows, 'assists');
        this.loadingStatistics = false;
        this.loadedStatistics = true;
        this.cdr.markForCheck();
      },
      error: () => {
        if (request !== this.request) return;
        this.loadingStatistics = false;
        this.error = 'Impossible de charger les statistiques. Réessayez.';
        this.cdr.markForCheck();
      }
    });
  }

  get visibleScorers(): PlayerLeader[] {
    return this.showAllScorers ? this.scorers : this.scorers.filter(player => player.rank <= 10);
  }

  get visibleAssistProviders(): PlayerLeader[] {
    return this.showAllAssistProviders ? this.assistProviders : this.assistProviders.filter(player => player.rank <= 10);
  }
}
