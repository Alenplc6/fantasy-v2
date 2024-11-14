import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Period {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  p1: { home: number; away: number };

  @Column('json')
  p2: { home: number; away: number };

  @Column('json')
  ft: { home: number; away: number };
}
