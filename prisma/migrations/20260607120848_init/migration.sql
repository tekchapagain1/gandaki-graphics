-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "orderCode" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "product" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "quantity" INTEGER NOT NULL,
    "designNotes" TEXT,
    "designFileName" TEXT,
    "designFilePath" TEXT,
    "deadline" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "accent" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "customer" TEXT NOT NULL,
    "review" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderCode_key" ON "Order"("orderCode");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
