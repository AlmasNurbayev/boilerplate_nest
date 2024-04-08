import { MigrationInterface, QueryRunner } from "typeorm";

export class N1712569723414 implements MigrationInterface {
    name = 'N1712569723414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "loginType"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "loginType" character varying NOT NULL`);
    }

}
