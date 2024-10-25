import { Formation } from 'src/formation/entities/formation.entity';
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
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  fullName: string;

  @Column({
    type: 'enum',
    enum: ['Male', 'Female'],
    default: 'Male',
  })
  gender: string;

  @Column({ nullable: false })
  phone: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user', 'guest'],
    default: 'user',
  })
  role: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  teamName: string;

  @Column({ nullable: true })
  coachName: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Formation, { eager: true, cascade: true, nullable: true })
  @JoinColumn({ name: 'formation_id' })
  formation: Formation;

  @Column({ default: 0 })
  TotalPoints: number;

  @Column({ default: false })
  isTeamCreated: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
