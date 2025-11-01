import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  // Property type and status
  @Column({
    type: "enum",
    enum: ["house", "apartment", "studio", "land", "commercial"],
  })
  type: string;

  @Column({ type: "enum", enum: ["rent", "buy"] })
  listingType: string; // 'rent' or 'buy'

  @Column({ type: "enum", enum: ["available", "sold", "rented", "pending"] })
  status: string;

  // Location
  @Column()
  city: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  neighborhood: string;

  @Column("decimal", { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column("decimal", { precision: 11, scale: 8, nullable: true })
  longitude: number;

  // Property details
  @Column()
  price: number;

  @Column()
  area: number; // in square meters

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column({ nullable: true })
  parking: number;

  @Column({ type: "boolean", default: false })
  furnished: boolean;

  @Column({ type: "boolean", default: false })
  balcony: boolean;

  @Column({ type: "boolean", default: false })
  elevator: boolean;

  @Column({ type: "boolean", default: false })
  heating: boolean;

  // Images
  @Column("simple-array", { nullable: true })
  images: string[];

  // Contact info
  @Column({ nullable: true })
  phone: string;

  // Relations
  @ManyToOne(() => User, (user) => user.properties)
  owner: User;

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
