-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "distance_unit" VARCHAR(10) NOT NULL DEFAULT 'km',
ADD COLUMN     "notif_prefs" JSONB,
ADD COLUMN     "theme" VARCHAR(20) NOT NULL DEFAULT 'system',
ADD COLUMN     "weight_unit" VARCHAR(10) NOT NULL DEFAULT 'kg';
