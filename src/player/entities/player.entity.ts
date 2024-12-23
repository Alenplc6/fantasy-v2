import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  pid: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({ default: Date() })
  birthDateTimeStamp: string;

  @Column({ nullable: false })
  birthDate: Date;

  @Column({ nullable: false })
  positionType: string;

  @Column({ nullable: false })
  positionName: string;

  @Column({ nullable: true })
  teamName: string;

  @Column({ nullable: false })
  height: string;

  @Column({ nullable: false })
  weight: string;

  @Column({ nullable: false })
  foot: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  facebook: string;

  @Column({ nullable: false })
  fantasy_player_rating: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
