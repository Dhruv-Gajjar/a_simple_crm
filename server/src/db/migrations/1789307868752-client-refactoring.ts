import { MigrationInterface, QueryRunner } from 'typeorm';

export class ClientRefactoring1789307868752 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" ADD COLUMN next_follow_up_date TIMESTAMP`,
    );

    await queryRunner.query(
      `ALTER TABLE "clients" ADD COLUMN last_contacted_at TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "clients" REMOVE COLUMN next_follow_up_date TIMESTAMP`,
    );

    await queryRunner.query(
      `ALTER TABLE "clients" REMOVE COLUMN last_contacted_at TIMESTAMP`,
    );
  }
}
