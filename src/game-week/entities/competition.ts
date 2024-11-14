// src/entities/Competition.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Competition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cid: string;

  @Column()
  cname: string;

  @Column()
  startdate: string;

  @Column()
  enddate: string;

  @Column()
  startdatetimestamp: string;

  @Column()
  endtdatetimestamp: string;

  @Column()
  year: string;

  @Column()
  category: string;

  @Column()
  tournament_id: string;

  @Column()
  category_id: string;

  @Column()
  ioc: string;

  @Column()
  status: string;

  @Column()
  status_str: string;

  @Column()
  logo: string;
}
