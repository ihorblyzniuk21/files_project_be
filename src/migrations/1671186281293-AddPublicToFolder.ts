import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublicToFolder1671186281293 implements MigrationInterface {
    name = 'AddPublicToFolder1671186281293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folders" ADD "public" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folders" DROP COLUMN "public"`);
    }

}
