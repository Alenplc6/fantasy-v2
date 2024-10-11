import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GameWeek {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: false })
  mid: number;

  @Column({ nullable: true })
  home: string;

  @Column({ nullable: true })
  away: string;

  @Column({ nullable: true })
  startTime: Date;

  @Column({ default: false })
  isGameEnded: boolean;
}
