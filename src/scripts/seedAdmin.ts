import { prisma } from "../lib/prisma";
import { UserRole } from "../middleware/auth";

const seedAdmin = async () => {
  try {
    const adminData = {
      name: DEFAULT_ADMIN_NAME,
      email: DEFAULT_ADMIN_EMAIL,
      role: UserRole.ADMIN,
      password: "admin11234",
      emailVarified: true,
    };
    // check user exist on db or not
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists!");
    }

    const signUpAdmin = await fetch(
      "http://localhost:5000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          origin: "http://localhost:5000",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signUpAdmin) {
      await prisma.user.update({
        where: { email: adminData.email },
        data: {
          emailVerified: true,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

seedAdmin();
