-- AlterTable
ALTER TABLE "exercises" ADD COLUMN     "image_url" VARCHAR(500);

-- CreateTable
CREATE TABLE "food_items" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "calories" SMALLINT NOT NULL,
    "protein_g" REAL NOT NULL,
    "carbs_g" REAL NOT NULL,
    "fat_g" REAL NOT NULL,
    "fibre_g" REAL,
    "is_veg" BOOLEAN NOT NULL DEFAULT true,
    "for_breakfast" BOOLEAN NOT NULL DEFAULT false,
    "for_lunch" BOOLEAN NOT NULL DEFAULT false,
    "for_dinner" BOOLEAN NOT NULL DEFAULT false,
    "cuisine" VARCHAR(50) NOT NULL DEFAULT 'INDIAN',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "food_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "food_items_name_key" ON "food_items"("name");

-- CreateIndex
CREATE INDEX "idx_food_items_is_veg" ON "food_items"("is_veg");
