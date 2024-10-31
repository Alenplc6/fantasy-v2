import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Player } from '../../player/entities/player.entity';
import { User } from './user.entity';

@Entity()
export class TeamPlayer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['goalKeeper', 'defense', 'midFielder', 'offense'],
    default: 'defense',
  })
  position: string;

  @Column({ default: false })
  isCapitan: boolean;

  @Column({ default: false })
  isOnTheBench: boolean;

  @Column({ name: 'player_id', nullable: false })
  playerId: number;

  // One-to-one relationship with Player
  @ManyToOne(() => Player, { eager: true })
  @JoinColumn({ name: 'player_id', referencedColumnName: 'id' }) // Foreign key column in PlayerUserRelation table
  player: Player;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  // One-to-one relationship with User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // Foreign key column in PlayerUserRelation table
  user: User;

  @Column({ nullable: false })
  pid: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
