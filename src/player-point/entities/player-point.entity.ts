import { FantasyPoint } from 'src/fantasy-point/entities/fantasy-point.entity';
import { Player } from 'src/player/entities/player.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PlayerPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'player_id', nullable: false })
  playerId: number;

  // One-to-one relationship with Player
  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id', referencedColumnName: 'id' }) // Foreign key column in PlayerUserRelation table
  player: Player;

  @Column({ name: 'user_id', nullable: false })
  userId: number;

  // One-to-one relationship with User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // Foreign key column in PlayerUserRelation table
  user: User;

  @Column({ name: 'fantasy_point_id', nullable: false })
  fantasyPointId: number;

  // One-to-one relationship with User
  @ManyToOne(() => FantasyPoint)
  @JoinColumn({ name: 'fantasy_point_id', referencedColumnName: 'id' }) // Foreign key column in PlayerUserRelation table
  fantasyPoint: FantasyPoint;

  @Column({ default: 0 })
  point: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
