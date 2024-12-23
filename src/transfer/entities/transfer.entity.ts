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
import { User } from '../../user/entities';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  gameWeek: number;

  @ManyToOne(() => Player, { nullable: false })
  @JoinColumn({ name: 'player_in_id' })
  playerInId: Player;

  @ManyToOne(() => Player, { nullable: false })
  @JoinColumn({ name: 'player_out_id' })
  playerOutId: Player;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'enum',
    enum: ['free', 'wildcard', 'freehit', 'penalty'],
    nullable: false,
  })
  transferType: string;

  @CreateDateColumn()
  transferDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
