import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('team')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  tid: string;

  @Column({ type: 'varchar', length: 255 })
  tname: string;

  @Column({ type: 'varchar', length: 255 })
  fullname: string;

  @Column({ type: 'varchar', length: 255 })
  abbr: string;

  @Column({ type: 'varchar', default: false })
  iscountry: string;

  @Column({ type: 'varchar', default: false })
  isclub: string;

  @Column({ type: 'varchar', length: 4 })
  founded: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twitter: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  hashtag: string;

  @Column({ type: 'varchar', length: 255 })
  teamlogo: string;

  @Column({ type: 'varchar', length: 255 })
  team_url: string;

  @Column({ type: 'varchar', length: 255 })
  team_matches_url: string;
}
