import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Formation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  offense: number;

  @Column({ nullable: true })
  midfield: number;

  @Column({ nullable: true })
  defense: number;

  @Column('text')
  formationAlignment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Getter to parse the JSON string
  get parsedFormationAlignment(): Array<{
    name: string;
    players: Array<{ name: string }>;
  }> {
    try {
      return JSON.parse(this.formationAlignment);
    } catch {
      return this.formationAlignment as any;
    }
  }

  // Setter to stringify the JSON object
  set parsedFormationAlignment(
    value: Array<{ name: string; players: Array<{ name: string }> }>,
  ) {
    this.formationAlignment =
      typeof value === 'string' ? value : JSON.stringify(value);
  }

  // Custom method to transform the entity for JSON output
  toJSON() {
    const { id, name, parsedFormationAlignment, createdAt, updatedAt } = this;
    return {
      id,
      name,
      formationAlignment: parsedFormationAlignment,
      createdAt,
      updatedAt,
    };
  }
}
