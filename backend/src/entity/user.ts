import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Property } from "./property";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: "enum", enum: ["user", "agent"], default: "user" })
  role: string;

  @OneToMany(() => Property, (property) => property.owner)
  properties: Property[];
}
