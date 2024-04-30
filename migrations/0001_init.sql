-- CreateTable
CREATE TABLE "Pkgs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pkg" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repository" TEXT NOT NULL,
    "popularity" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Tags" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tag" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TotalDownloads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pkg" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "download" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "MajorDownloads" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pkg" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "download" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_PkgsToTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PkgsToTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Pkgs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PkgsToTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Pkgs_pkg_key" ON "Pkgs"("pkg");

-- CreateIndex
CREATE UNIQUE INDEX "Tags_tag_key" ON "Tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "TotalDownloads_pkg_date_source_key" ON "TotalDownloads"("pkg", "date", "source");

-- CreateIndex
CREATE UNIQUE INDEX "MajorDownloads_pkg_date_source_version_key" ON "MajorDownloads"("pkg", "date", "source", "version");

-- CreateIndex
CREATE UNIQUE INDEX "_PkgsToTags_AB_unique" ON "_PkgsToTags"("A", "B");

-- CreateIndex
CREATE INDEX "_PkgsToTags_B_index" ON "_PkgsToTags"("B");
