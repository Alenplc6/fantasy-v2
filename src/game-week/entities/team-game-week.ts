// src/entities/Team.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class GameWeekTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tid: string;

  @Column()
  tname: string;

  @Column()
  logo: string;

  @Column()
  fullname: string;

  @Column()
  abbr: string;
}
