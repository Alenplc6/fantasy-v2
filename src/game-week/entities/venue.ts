// src/entities/Venue.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  founded: string;

  @Column()
  capacity: string;

  @Column()
  googlecoords: string;
}
