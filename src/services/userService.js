import bcrypt from "bcryptjs/dist/bcrypt.js";
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

export const createUser = async (userData) => {
  return prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
    },
  });
};
