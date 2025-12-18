import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropertyRelationToMessage1762040466675
  implements MigrationInterface
{
  name = "AddPropertyRelationToMessage1762040466675";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Column and FK are already created in CreateMessagesTable1762040466674.
    // Here we only ensure helpful indexes exist.
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_message_sender" ON "message" ("senderId")`
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_message_recipient" ON "message" ("recipientId")`
    );

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_message_property" ON "message" ("propertyId")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_message_property"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_message_recipient"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_message_sender"`);
  }
}
