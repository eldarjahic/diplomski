import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMessagesTable1762040466674 implements MigrationInterface {
  name = "CreateMessagesTable1762040466674";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "message" (
        "id" SERIAL NOT NULL,
        "subject" character varying(255),
        "body" text NOT NULL,
        "isRead" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "senderId" integer NOT NULL,
        "recipientId" integer NOT NULL,
        "propertyId" integer,
        CONSTRAINT "PK_message_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "message"
      ADD CONSTRAINT "FK_message_sender"
      FOREIGN KEY ("senderId")
      REFERENCES "user" ("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "message"
      ADD CONSTRAINT "FK_message_recipient"
      FOREIGN KEY ("recipientId")
      REFERENCES "user" ("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "message"
      ADD CONSTRAINT "FK_message_property"
      FOREIGN KEY ("propertyId")
      REFERENCES "property" ("id")
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_message_property"`);
    await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_message_recipient"`);
    await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_message_sender"`);
    await queryRunner.query(`DROP TABLE "message"`);
  }
}
