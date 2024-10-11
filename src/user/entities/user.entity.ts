import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
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

  @Column({ nullable: true })
  formation: string;

  @Column({ default: 0 })
  TotalPoints: number;

  @Column({ default: false })
  isTeamCreated: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
