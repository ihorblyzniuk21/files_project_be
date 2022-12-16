import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFolder1671178500441 implements MigrationInterface {
    name = 'AddFolder1671178500441'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "folders" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "folders" ADD CONSTRAINT "FK_5caa05c855e82b975c8c438cf68" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "folders" DROP CONSTRAINT "FK_5caa05c855e82b975c8c438cf68"`);
        await queryRunner.query(`DROP TABLE "folders"`);
    }

}
