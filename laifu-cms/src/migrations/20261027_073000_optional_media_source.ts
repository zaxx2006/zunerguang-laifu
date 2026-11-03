import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ALTER COLUMN "source_label" DROP NOT NULL;
    ALTER TABLE "_media_v" ALTER COLUMN "version_source_label" DROP NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "media" ALTER COLUMN "source_label" SET NOT NULL;
    ALTER TABLE "_media_v" ALTER COLUMN "version_source_label" SET NOT NULL;
  `);
}
