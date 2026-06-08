const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const auditService = require("./audit.service");

// ================== GET ALL USERS ==================

const getUsers = async () => {

  return await prisma.users.findMany({

    where: {
      deleted_at: null
    },

    select: {

      user_id: true,

      email: true,

      first_name: true,

      last_name: true,

      is_active: true,

      last_login: true,

      created_at: true,

      roles: {

        select: {

          id: true,

          role_id: true,

          name: true

        }

      }

    },

    orderBy: {
      created_at: "desc"
    }

  });

};

// ================== GET USER BY UUID ==================

const getUserById = async (
  userId
) => {

  const user =
    await prisma.users.findUnique({

      where: {
        user_id: userId
      },

      select: {

        user_id: true,

        email: true,

        first_name: true,

        last_name: true,

        is_active: true,

        last_login: true,

        created_at: true,

        updated_at: true,

        roles: {

          select: {

            id: true,

            role_id: true,

            name: true

          }

        }

      }

    });

  if (!user) {

    throw new Error(
      "User not found"
    );

  }

  return user;

};

// ================== CREATE USER ==================

const createUser = async (
  data,
  audit = {}
) => {

  const existingUser =
    await prisma.users.findUnique({
      where: {
        email: data.email
      }
    });

  if (existingUser) {
    throw new Error(
      "Email already exists"
    );
  }

  const role =
    await prisma.roles.findUnique({
      where: {
        id: Number(data.role_id)
      }
    });

  if (!role) {
    throw new Error(
      "Invalid role"
    );
  }

  const passwordHash =
    await bcrypt.hash(
      data.password,
      10
    );

  return await auditService.track({

    audit,

    action: "CREATE",

    resourceType: "USER",

    moduleName:
      "User Management",

    operation: () =>
      prisma.users.create({

        data: {

          email:
            data.email,

          password_hash:
            passwordHash,

          first_name:
            data.first_name,

          last_name:
            data.last_name,

          role_id:
            Number(data.role_id),

          is_active:
            true

        },

        select: {

          id: true,

          user_id: true,

          email: true,

          first_name: true,

          last_name: true,

          is_active: true,

          created_at: true,

          roles: {

            select: {

              id: true,

              role_id: true,

              name: true

            }

          }

        }

      })

  });

};

// ================== UPDATE USER ==================

const updateUser = async (
  userId,
  data,
  audit = {}
) => {

  const existingUser =
    await prisma.users.findUnique({

      where: {
        user_id: userId
      }

    });

  if (!existingUser) {

    throw new Error(
      "User not found"
    );

  }

  const updateData = {

    first_name:
      data.first_name,

    last_name:
      data.last_name,

    email:
      data.email,

    is_active:
      data.is_active,

    updated_at:
      new Date()

  };

  if (data.role_id) {

    const role =
      await prisma.roles.findUnique({

        where: {
          id: Number(
            data.role_id
          )
        }

      });

    if (!role) {

      throw new Error(
        "Invalid role"
      );

    }

    updateData.role_id =
      Number(
        data.role_id
      );

  }

  if (data.password) {

    updateData.password_hash =
      await bcrypt.hash(
        data.password,
        10
      );

  }

  return await auditService.track({

    audit,

    action: "UPDATE",

    resourceType: "USER",

    resourceId:
      existingUser.id,

    moduleName:
      "User Management",

    oldValues:
      existingUser,

    operation: () =>
      prisma.users.update({

        where: {
          user_id: userId
        },

        data:
          updateData,

        select: {

          id: true,

          user_id: true,

          email: true,

          first_name: true,

          last_name: true,

          is_active: true,

          updated_at: true,

          roles: {

            select: {

              id: true,

              role_id: true,

              name: true

            }

          }

        }

      })

  });

};

// ================== DELETE USER ==================
// Soft Delete

const deleteUser = async (
  userId,
  audit = {}
) => {

  const existingUser =
    await prisma.users.findUnique({

      where: {
        user_id: userId
      }

    });

  if (!existingUser) {

    throw new Error(
      "User not found"
    );

  }

  return await auditService.track({

    audit,

    action: "DELETE",

    resourceType: "USER",

    resourceId:
      existingUser.id,

    moduleName:
      "User Management",

    oldValues:
      existingUser,

    operation: () =>
      prisma.users.update({

        where: {
          user_id: userId
        },

        data: {

          deleted_at:
            new Date(),

          is_active:
            false

        }

      })

  });

};

// ================== LOGIN ==================

const loginUser = async (
  email,
  password
) => {

  const user =
    await prisma.users.findUnique({

      where: {
        email
      },

      include: {

        roles: {

          select: {

            id: true,

            role_id: true,

            name: true

          }

        }

      }

    });

    if (!user) {
    
      throw new Error(
        "User account not found. Please contact Administrator."
      );
    
    }

  if (
    !user.is_active
  ) {

    throw new Error(
      "User account is inactive"
    );

  }


if (!user.is_active) {

  throw new Error(
    "Your account has been disabled. Please contact Administrator."
  );

}

const passwordMatch =
  await bcrypt.compare(
    password,
    user.password_hash
  );

if (!passwordMatch) {

  throw new Error(
    "Incorrect password."
  );

}

  // Update Last Login

  await prisma.users.update({

    where: {
      user_id: user.user_id
    },

    data: {

      last_login:
        new Date()

    }

  });

const token = jwt.sign({

  id: user.id,

  user_id: user.user_id,

  email: user.email,

  first_name:
    user.first_name,

  last_name:
    user.last_name,

  role:
    user.roles.name

},
process.env.JWT_SECRET,
{
  expiresIn: "1d"
});

return {

  token,

  user: {

    user_id:
      user.user_id,

    email:
      user.email,

    first_name:
      user.first_name,

    last_name:
      user.last_name,

    role_id:
      user.role_id,

    role:
      user.roles.name

  }

};

};

// ================== GET ROLES ==================

const getroles = async () => {

  return await prisma.roles.findMany();

};

module.exports = {

  getUsers,

  getUserById,

  createUser,

  updateUser,

  deleteUser,

  loginUser,

  getroles

};