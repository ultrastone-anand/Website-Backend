const prisma = require(
  "../config/prisma"
);

// ================== SUBSCRIBE ==================

const subscribe = async (
  data
) => {

  const existingSubscriber =
    await prisma.newsletter_subscribers.findUnique({

      where: {
        email: data.email
      }

    });

  if (existingSubscriber) {

    throw new Error(
      "Email already subscribed"
    );

  }

  return await prisma.newsletter_subscribers.create({

    data: {

      email:
        data.email,

      is_active:
        true

    }

  });

};

// ================== GET ALL SUBSCRIBERS ==================

const getAllSubscribers = async () => {

    return await prisma.newsletter_subscribers.findMany({

      orderBy: {
        subscribed_at:
          "desc"
      }

    });

  };

module.exports = {

  subscribe,

  getAllSubscribers

};