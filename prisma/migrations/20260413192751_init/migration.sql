-- CreateEnum
CREATE TYPE "UserPermissions" AS ENUM ('USER', 'MODER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AnimeType" AS ENUM ('TV', 'MOVIE', 'OVA', 'ONA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "permissions" "UserPermissions" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anime" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "engTitle" TEXT,
    "description" TEXT NOT NULL,
    "releaseDate" INTEGER NOT NULL,
    "episodesTotal" INTEGER NOT NULL,
    "type" "AnimeType" NOT NULL,
    "studio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "posterImageId" INTEGER,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeGenre" (
    "animeId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,

    CONSTRAINT "AnimeGenre_pkey" PRIMARY KEY ("animeId","genreId")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "posterImageId" INTEGER,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeImage" (
    "animeId" INTEGER NOT NULL,
    "imageId" INTEGER NOT NULL,

    CONSTRAINT "AnimeImage_pkey" PRIMARY KEY ("animeId","imageId")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeView" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "referer" TEXT,
    "ip" TEXT,

    CONSTRAINT "AnimeView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeRating" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimeRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeCode" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimeCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeCodeView" (
    "id" SERIAL NOT NULL,
    "animeCodeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "referer" TEXT,
    "ip" TEXT,

    CONSTRAINT "AnimeCodeView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeRating_animeId_userId_key" ON "AnimeRating"("animeId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeCode_code_key" ON "AnimeCode"("code");

-- AddForeignKey
ALTER TABLE "Anime" ADD CONSTRAINT "Anime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anime" ADD CONSTRAINT "Anime_posterImageId_fkey" FOREIGN KEY ("posterImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeGenre" ADD CONSTRAINT "AnimeGenre_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeGenre" ADD CONSTRAINT "AnimeGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Genre" ADD CONSTRAINT "Genre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Genre" ADD CONSTRAINT "Genre_posterImageId_fkey" FOREIGN KEY ("posterImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeImage" ADD CONSTRAINT "AnimeImage_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeImage" ADD CONSTRAINT "AnimeImage_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeView" ADD CONSTRAINT "AnimeView_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeRating" ADD CONSTRAINT "AnimeRating_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeRating" ADD CONSTRAINT "AnimeRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeCode" ADD CONSTRAINT "AnimeCode_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeCodeView" ADD CONSTRAINT "AnimeCodeView_animeCodeId_fkey" FOREIGN KEY ("animeCodeId") REFERENCES "AnimeCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
