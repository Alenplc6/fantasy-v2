import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Coach {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  clubName: string;

  @Column()
  profileIMage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
