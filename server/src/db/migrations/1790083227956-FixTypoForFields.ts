import { MigrationInterface, QueryRunner } from "typeorm";

export class FixTypoForFields1790083227956 implements MigrationInterface {
    name = 'FixTypoForFields1790083227956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes" RENAME COLUMN "deleated_at" TO "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "deleated_at"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deleated_at"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "total_amount"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "deleated_at"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "soruce"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "amount" numeric(12,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "source" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "last_contacted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "amount" numeric(12,2) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "payment_date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "start_date" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "end_date" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "end_date" SET DEFAULT '2026-09-21 15:02:04.124+00'`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "start_date" SET DEFAULT '2026-09-21 15:02:04.124+00'`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "payment_date" SET DEFAULT '2026-09-21 15:02:04.123+00'`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "amount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "last_contacted_at"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "source"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "soruce" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "deleated_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "total_amount" double precision NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "deleated_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "deleated_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "notes" RENAME COLUMN "deleted_at" TO "deleated_at"`);
    }

}
