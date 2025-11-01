import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedPasswordToUser1762040466670 implements MigrationInterface {
    name = 'AddedPasswordToUser1762040466670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
