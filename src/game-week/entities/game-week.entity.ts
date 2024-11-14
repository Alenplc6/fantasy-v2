// src/entities/Match.ts
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Competition } from './competition';
import { GameWeekTeam } from './team-game-week';
import { Venue } from './venue';

@Entity()
export class GameWeek {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mid: string;

  @Column()
  round: string;

  @Column()
  match_number: string;

  @Column('json')
  result: {
    home: string;
    away: string;
    winner: string;
  };

  @ManyToOne(() => GameWeekTeam, { eager: true, cascade: true })
  @JoinColumn({ name: 'home_team_id' })
  home_team: GameWeekTeam;

  @ManyToOne(() => GameWeekTeam, { eager: true, cascade: true })
  @JoinColumn({ name: 'away_team_id' })
  away_team: GameWeekTeam;

  @Column('json', {
    nullable: true,
  })
  periods: {
    p1: { home: number; away: number };
    p2: { home: number; away: number };
    ft: { home: number; away: number };
  };

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP', nullable: true })
  datestart: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP', nullable: true })
  dateend: Date;

  @Column()
  timestampstart: string;

  @Column()
  timestampend: string;

  @Column()
  injurytime: string;

  @Column()
  time: string;

  @Column()
  status_str: string;

  @Column()
  status: string;

  @Column()
  gamestate_str: string;

  @Column()
  gamestate: string;

  @Column()
  pre_squad: string;

  @Column()
  verified: string;

  @Column({ nullable: true })
  periodlength: string;

  @Column({ nullable: true })
  numberofperiods: string;

  @Column({ nullable: true })
  attendance: string;

  @Column({ nullable: true })
  overtimelength: string;

  @OneToOne(() => Competition, { eager: true, cascade: true })
  @JoinColumn()
  competition: Competition;

  @ManyToOne(() => Venue, { eager: true, cascade: true })
  @JoinColumn()
  venue: Venue;

  @Column()
  lineupavailable: string;

  @Column()
  projectionavailable: string;

  @Column()
  eventavailable: string;

  @Column()
  commentaryavailable: string;

  @BeforeInsert()
  setDefaultPeriods() {
    if (!this.periods) {
      this.periods = {
        p1: { home: 0, away: 0 },
        p2: { home: 0, away: 0 },
        ft: { home: 0, away: 0 },
      };
    }
  }
}
