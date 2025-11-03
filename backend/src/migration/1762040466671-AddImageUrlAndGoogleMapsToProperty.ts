import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlAndGoogleMapsToProperty1762040466671
  implements MigrationInterface
{
  name = "AddImageUrlAndGoogleMapsToProperty1762040466671";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "property" ADD "imageUrl" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "property" ADD "googleMapsUrl" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "googleMapsUrl"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "imageUrl"`);
  }
}

