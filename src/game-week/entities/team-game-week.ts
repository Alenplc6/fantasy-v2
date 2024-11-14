// src/entities/Team.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
