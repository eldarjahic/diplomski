import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn } from "typeorm";
import { User } from "./user";
import { Property } from "./property";

@Entity()
@Unique(["user", "property"])
export class Favorite {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Property, (property) => property.id, { onDelete: "CASCADE" })
  property: Property;

  @CreateDateColumn()
  createdAt: Date;
}


