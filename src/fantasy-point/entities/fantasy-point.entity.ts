import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity() // You can change the table name here if needed
export class FantasyPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  mid: number;

  @Column({ nullable: false })
  pid: number;

  @Column({ nullable: true })
  pname: string;

  @Column({ nullable: true })
  minutesplayed: number;

  @Column({ nullable: true })
  assist: number;

  @Column({ nullable: true })
  passes: number;

  @Column({ nullable: true })
  shotsontarget: number;

  @Column({ nullable: true })
  yellowcard: number;

  @Column({ nullable: true })
  redcard: number;

  @Column({ nullable: true })
  owngoal: number;

  @Column({ nullable: true })
  penaltymissed: number;

  @Column({ nullable: true })
  tacklesuccessful: number;

  @Column({ nullable: true })
  penaltysaved: number;

  @Column({ nullable: true })
  shotssaved: number;

  @Column({ nullable: true })
  goalscored: number;

  @Column({ nullable: true })
  goalsconceded: number;

  @Column({ nullable: true })
  cleansheet: number;

  @Column({ nullable: true })
  chancecreated: number;

  @Column({ nullable: true })
  starting11: number;

  @Column({ nullable: true })
  substitute: number;

  @Column({ nullable: true })
  blockedshot: number;

  @Column({ nullable: true })
  interceptionwon: number;

  @Column({ nullable: true })
  clearance: number;
}
