import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Property } from "./property";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.sentMessages, { nullable: false })
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages, { nullable: false })
  recipient: User;

  @ManyToOne(() => Property, (property) => property.messages, { nullable: true, onDelete: "SET NULL" })
  property: Property | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  subject: string | null;

  @Column({ type: "text" })
  body: string;

  @Column({ type: "boolean", default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
