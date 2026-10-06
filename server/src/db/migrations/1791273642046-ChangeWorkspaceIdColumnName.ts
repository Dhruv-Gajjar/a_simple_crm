import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeWorkspaceIdColumnName1791273642046 implements MigrationInterface {
    name = 'ChangeWorkspaceIdColumnName1791273642046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace_members" ADD CONSTRAINT "UQ_4896b609c71ca5ad20ad662077b" UNIQUE ("workspace_id", "user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "workspace_members" DROP CONSTRAINT "UQ_4896b609c71ca5ad20ad662077b"`);
    }

}
