import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropRefreshTokenTable1790777553853 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "refresh_tokens" CASCADE;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
