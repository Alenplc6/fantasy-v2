// src/entities/Match.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { GameWeekTeam } from './team-game-week';
import { Competition } from './competition';
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

  @OneToOne(() => GameWeekTeam, { eager: true, cascade: true })
  @JoinColumn({ name: 'home_team_id' })
  home_team: GameWeekTeam;

  @OneToOne(() => GameWeekTeam, { eager: true, cascade: true })
  @JoinColumn({ name: 'away_team_id' })
  away_team: GameWeekTeam;

  @Column({ nullable: true })
  periods: string;

  @Column()
  datestart: string;

  @Column()
  dateend: string;

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
  pre_squad: boolean;

  @Column()
  verified: boolean;

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

  @OneToOne(() => Venue, { eager: true, cascade: true })
  @JoinColumn()
  venue: Venue;

  @Column()
  lineupavailable: boolean;

  @Column()
  projectionavailable: boolean;

  @Column()
  eventavailable: boolean;

  @Column()
  commentaryavailable: boolean;
}
