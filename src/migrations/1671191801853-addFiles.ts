import { MigrationInterface, QueryRunner } from "typeorm";

export class addFiles1671191801853 implements MigrationInterface {
    name = 'addFiles1671191801853'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "path" character varying NOT NULL, "public" boolean NOT NULL, "userId" integer, "folderId" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_24dfe39188240d442f380dd8c04" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_24dfe39188240d442f380dd8c04"`);
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}
