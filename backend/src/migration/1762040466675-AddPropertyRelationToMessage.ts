import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropertyRelationToMessage1762040466675 implements MigrationInterface {
  name = "AddPropertyRelationToMessage1762040466675";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "message"
      ADD COLUMN "propertyId" integer
    `);

    await queryRunner.query(`
      ALTER TABLE "message"
      ADD CONSTRAINT "FK_message_property"
      FOREIGN KEY ("propertyId")
      REFERENCES "property" ("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_message_sender" ON "message" ("senderId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_message_recipient" ON "message" ("recipientId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_message_property" ON "message" ("propertyId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_message_property"`);
    await queryRunner.query(`DROP INDEX "IDX_message_recipient"`);
    await queryRunner.query(`DROP INDEX "IDX_message_sender"`);
    await queryRunner.query(`
      ALTER TABLE "message" DROP CONSTRAINT "FK_message_property"
    `);
    await queryRunner.query(`
      ALTER TABLE "message" DROP COLUMN "propertyId"
    `);
  }
}
