import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUsernameToUser1762040466673 implements MigrationInterface {
  name = "AddUsernameToUser1762040466673";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_user_username" ON "user" ("username") WHERE "username" IS NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_user_username"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
  }
}
