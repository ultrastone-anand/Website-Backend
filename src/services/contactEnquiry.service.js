const prisma = require(
    "../config/prisma"
);

// ================== CREATE ENQUIRY ==================

const createEnquiry = async (
    data
) => {

    return await prisma.contact_enquiries.create({

        data: {

            name:
                data.name,

            subject:
                data.subject,

            email:
                data.email,

            phone:
                data.phone,

            message:
                data.message

        }

    });

};

// ================== GET ALL ENQUIRIES ==================

const getAllEnquiries = async () => {

        return await prisma.contact_enquiries.findMany({

            orderBy: {

                created_at:
                    "desc"

            }

        });

    };

// ================== UPDATE STATUS ==================

const updateStatus = async (
        id,
        data
    ) => {

        const enquiry =
            await prisma.contact_enquiries.findUnique({

                where: {
                    id: BigInt(id)
                }

            });

        if (!enquiry) {

            throw new Error(
                "Enquiry not found"
            );

        }

        return await prisma.contact_enquiries.update({

            where: {
                id: BigInt(id)
            },

            data: {

                status:
                    data.status,

                updated_at:
                    new Date()

            }

        });

    };

module.exports = {

    createEnquiry,

    getAllEnquiries,

    updateStatus

};