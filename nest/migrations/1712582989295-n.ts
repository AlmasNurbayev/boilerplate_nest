import { MigrationInterface, QueryRunner } from "typeorm";

export class N1712582989295 implements MigrationInterface {
    name = 'N1712582989295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying, "phone" character varying, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_email" ON "users" ("email", "phone") `);
        await queryRunner.query(`CREATE TABLE "articles" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "author_id" integer NOT NULL, "image_path" character varying NOT NULL, "is_publicated" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_articles" ON "articles" ("title", "author_id") `);
        await queryRunner.query(`ALTER TABLE "articles" ADD CONSTRAINT "FK_6515da4dff8db423ce4eb841490" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP CONSTRAINT "FK_6515da4dff8db423ce4eb841490"`);
        await queryRunner.query(`DROP INDEX "public"."idx_articles"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP INDEX "public"."idx_email"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
