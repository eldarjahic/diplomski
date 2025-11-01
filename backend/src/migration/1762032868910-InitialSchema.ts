import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1762032868910 implements MigrationInterface {
    name = 'InitialSchema1762032868910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."property_type_enum" AS ENUM('house', 'apartment', 'studio', 'land', 'commercial')`);
        await queryRunner.query(`CREATE TYPE "public"."property_listingtype_enum" AS ENUM('rent', 'buy')`);
        await queryRunner.query(`CREATE TYPE "public"."property_status_enum" AS ENUM('available', 'sold', 'rented', 'pending')`);
        await queryRunner.query(`CREATE TABLE "property" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "type" "public"."property_type_enum" NOT NULL, "listingType" "public"."property_listingtype_enum" NOT NULL, "status" "public"."property_status_enum" NOT NULL, "city" character varying NOT NULL, "address" character varying NOT NULL, "neighborhood" character varying, "latitude" numeric(10,8), "longitude" numeric(11,8), "price" integer NOT NULL, "area" integer NOT NULL, "bedrooms" integer NOT NULL, "bathrooms" integer NOT NULL, "parking" integer, "furnished" boolean NOT NULL DEFAULT false, "balcony" boolean NOT NULL DEFAULT false, "elevator" boolean NOT NULL DEFAULT false, "heating" boolean NOT NULL DEFAULT false, "images" text, "phone" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" integer, CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'agent')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "property" ADD CONSTRAINT "FK_917755242ab5b0a0b08a63016d9" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property" DROP CONSTRAINT "FK_917755242ab5b0a0b08a63016d9"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "property"`);
        await queryRunner.query(`DROP TYPE "public"."property_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."property_listingtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."property_type_enum"`);
    }

}
