import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePropertyImagesToJson1762040466672
  implements MigrationInterface
{
  name = "UpdatePropertyImagesToJson1762040466672";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "images"`);
    await queryRunner.query(
      `ALTER TABLE "property" ADD "images" jsonb`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "images"`);
    await queryRunner.query(
      `ALTER TABLE "property" ADD "images" text`
    );
  }
}
