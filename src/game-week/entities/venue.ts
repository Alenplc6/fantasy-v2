// src/entities/Venue.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueid: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  founded: string;

  @Column()
  capacity: string;

  @Column({ nullable: true })
  googlecoords: string;
}
