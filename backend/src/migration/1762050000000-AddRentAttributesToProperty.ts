import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRentAttributesToProperty1762050000000 implements MigrationInterface {
  name = "AddRentAttributesToProperty1762050000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" ADD "availableFrom" date`);
    await queryRunner.query(`ALTER TABLE "property" ADD "leaseTermMonths" integer`);
    await queryRunner.query(`ALTER TABLE "property" ADD "depositAmount" integer`);
    await queryRunner.query(`ALTER TABLE "property" ADD "utilitiesIncluded" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "property" ADD "petFriendly" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "property" ADD "smokingAllowed" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "property" ADD "floor" integer`);
    await queryRunner.query(`ALTER TABLE "property" ADD "totalFloors" integer`);
    await queryRunner.query(`ALTER TABLE "property" ADD "yearBuilt" integer`);
    await queryRunner.query(`ALTER TABLE "property" ADD "energyClass" character varying`);
    await queryRunner.query(`ALTER TABLE "property" ADD "heatingType" character varying`);
    await queryRunner.query(`ALTER TABLE "property" ADD "parkingType" character varying`);
    await queryRunner.query(`ALTER TABLE "property" ADD "airConditioning" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "property" ADD "garden" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "property" ADD "storage" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "storage"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "garden"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "airConditioning"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "parkingType"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "heatingType"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "energyClass"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "yearBuilt"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "totalFloors"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "floor"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "smokingAllowed"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "petFriendly"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "utilitiesIncluded"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "depositAmount"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "leaseTermMonths"`);
    await queryRunner.query(`ALTER TABLE "property" DROP COLUMN "availableFrom"`);
  }
}


