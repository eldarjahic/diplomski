import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Message } from "./message";

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

  @Column({ type: "varchar", nullable: true })
  neighborhood: string | null;

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

  @Column({ type: "int", nullable: true })
  parking: number | null;

  @Column({ type: "boolean", default: false })
  furnished: boolean;

  @Column({ type: "boolean", default: false })
  balcony: boolean;

  @Column({ type: "boolean", default: false })
  elevator: boolean;

  @Column({ type: "boolean", default: false })
  heating: boolean;

  // Status helpers
  @Column({ type: "date", nullable: true })
  rentedUntil: Date | null;

  @Column({ type: "int", default: 0 })
  viewsCount: number;

  // Rent-specific and extended attributes
  @Column({ type: "date", nullable: true })
  availableFrom: Date | null;

  @Column({ type: "int", nullable: true })
  leaseTermMonths: number | null;

  @Column({ type: "int", nullable: true })
  depositAmount: number | null;

  @Column({ type: "boolean", default: false })
  utilitiesIncluded: boolean;

  @Column({ type: "boolean", default: false })
  petFriendly: boolean;

  @Column({ type: "boolean", default: false })
  smokingAllowed: boolean;

  @Column({ type: "int", nullable: true })
  floor: number | null;

  @Column({ type: "int", nullable: true })
  totalFloors: number | null;

  @Column({ type: "int", nullable: true })
  yearBuilt: number | null;

  @Column({ type: "varchar", nullable: true })
  energyClass: string | null;

  @Column({ type: "varchar", nullable: true })
  heatingType: string | null;

  @Column({ type: "varchar", nullable: true })
  parkingType: string | null;

  @Column({ type: "boolean", default: false })
  airConditioning: boolean;

  @Column({ type: "boolean", default: false })
  garden: boolean;

  @Column({ type: "boolean", default: false })
  storage: boolean;

  // Images
  @Column({ type: "varchar", nullable: true })
  imageUrl: string | null; // Main image URL

  @Column("jsonb", { nullable: true })
  images: string[] | null; // Additional images array

  // Google Maps
  @Column({ type: "varchar", nullable: true })
  googleMapsUrl: string | null; // Google Maps location URL/tag

  // Contact info
  @Column({ type: "varchar", nullable: true })
  phone: string | null;

  // Relations
  @ManyToOne(() => User, (user) => user.properties)
  owner: User;

  @OneToMany(() => Message, (message) => message.property)
  messages: Message[];

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
