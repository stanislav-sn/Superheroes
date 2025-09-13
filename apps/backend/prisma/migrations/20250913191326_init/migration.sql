-- CreateTable
CREATE TABLE "public"."superheroes" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "real_name" TEXT,
    "origin_description" TEXT,
    "superpowers" TEXT,
    "catch_phrase" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "superheroes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."images" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "hero_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "superheroes_nickname_key" ON "public"."superheroes"("nickname");

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "images_hero_id_fkey" FOREIGN KEY ("hero_id") REFERENCES "public"."superheroes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
