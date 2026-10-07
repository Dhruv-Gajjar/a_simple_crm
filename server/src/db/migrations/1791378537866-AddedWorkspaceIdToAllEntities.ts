import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedWorkspaceIdToAllEntities1791378537866 implements MigrationInterface {
    name = 'AddedWorkspaceIdToAllEntities1791378537866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" ADD "workspace_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "workspace_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "workspace_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notes" ADD CONSTRAINT "FK_9d730754849395585397c08042e" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_91f14a1a0776b673411970e442d" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_af78b8fc6857fe0a10d1bb1699e" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_af78b8fc6857fe0a10d1bb1699e"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_91f14a1a0776b673411970e442d"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP CONSTRAINT "FK_9d730754849395585397c08042e"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "workspace_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "workspace_id"`);
        await queryRunner.query(`ALTER TABLE "notes" DROP COLUMN "workspace_id"`);
    }

}
