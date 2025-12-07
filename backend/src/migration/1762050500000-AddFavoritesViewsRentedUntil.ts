import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFavoritesViewsRentedUntil1762050500000 implements MigrationInterface {
  name = "AddFavoritesViewsRentedUntil1762050500000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" ADD "rentedUntil" date`);
    await queryRunner.query(`ALTER TABLE "property" ADD "viewsCount" integer NOT NULL DEFAULT 0`);
    await queryRunner.query(`
      CREATE TABLE "favorite" (
        "id" SERIAL NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        "propertyId" integer,
        CONSTRAINT "PK_favorite_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_favorite_user_property" UNIQUE ("userId", "propertyId"),
        CONSTRAINT "FK_favorite_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_favorite_property" FOREIGN KEY ("propertyId") REFERENCES "property"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "favorite"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "viewsCount"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "rentedUntil"`);
  }
}


