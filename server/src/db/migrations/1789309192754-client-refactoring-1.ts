import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientRefactoring11789309192754 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" DELETE COLUMN "next_follow_up_date"`,
    );

    await queryRunner.query(
      `ALTER TABLE "clients" DELETE COLUMN "last_contacted_at"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" ADD COLUMN "next_follow_up_date" TIMESTAMP`,
    );

    await queryRunner.query(
      `ALTER TABLE "clients" ADD COLUMN "last_contacted_at" TIMESTAMP`,
    );
  }
}
