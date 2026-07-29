import { prisma } from "../../lib/prisma.js";

export const getUserByEmail = (email) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const getUserById = (id) => {
  return prisma.user.findUnique({
    where: { id },
  });
};
