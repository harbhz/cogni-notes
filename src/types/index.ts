// Local types mirror the Prisma models so the app can build even if
// the generated `@prisma/client` types aren't available during CI.
// Keep this in sync with `prisma/schema.prisma`.

export type Note = {
  id: string;
  text: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};
