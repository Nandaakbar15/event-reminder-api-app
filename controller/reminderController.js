const prisma = require("../lib/prisma");

exports.getAllReminders = async (req, res) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const where = userId ? { userId } : {};

    const reminders = await prisma.reminder.findMany({
      where,
      skip: skip,
      take: limit,
    });

    const totalData = await prisma.reminder.count({ where });

    return res.status(200).json({
      statusCode: 200,
      data: reminders,
      meta: {
        totalData: totalData,
        page: page,
        last_page: Math.ceil(totalData / limit),
        per_page: limit,
      },
    });
  } catch (error) {
    console.error("Error : ", error);

    return res.status(500).json({
      statusCode: 500,
      messaga: "Error, cannot fetch the data!",
    });
  }
};

exports.getRemindersById = async (req, res) => {
  try {
    const parsedReminderId = parseInt(req.params.id);

    if (isNaN(parsedReminderId)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Reminder ID must be a number!",
      });
    }

    const reminder = await prisma.reminder.findUnique({
      where: { id: parsedReminderId },
    });

    if (!reminder || reminder.userId !== req.user.id) {
      return res.status(400).json({
        statusCode: 400,
        message: `The data reminder with ID ${parsedReminderId} is not found!`,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: reminder,
    });
  } catch (error) {
    console.error("Error : ", error);

    return res.status(500).json({
      statusCode: 500,
      message: "Error, cannot fetch the data!",
    });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const { title, description, category, eventTime, status, userId } =
      req.body;

    if (!title || !eventTime) {
      return res.status(400).json({
        statusCode: 400,
        message: "Title and eventTime are required!",
      });
    }

    const eventDate = new Date(eventTime);

    if (isNaN(eventDate.getTime())) {
      return res.status(400).json({
        statusCode: 400,
        message: "eventTime must be a valid date!",
      });
    }

    const parsedUserId = userId ? parseInt(userId) : req.user.id;

    if (isNaN(parsedUserId)) {
      return res.status(400).json({
        statusCode: 400,
        message: "userId must be a number!",
      });
    }

    const reminderData = {
      title,
      eventTime: eventDate,
      status,
      userId: parsedUserId,
    };

    if (description) {
      reminderData.description = description;
    }

    if (category) {
      reminderData.category = category;
    }

    const addNewData = await prisma.reminder.create({
      data: reminderData,
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Successfully add new data!",
      addNewData,
    });
  } catch (error) {
    console.error("Error : ", error);

    return res.status(500).json({
      statusCode: 500,
      message: "Error, cannot add new data!",
    });
  }
};

exports.updateReminders = async (req, res) => {
  try {
    const { title, description, category, userId, status, eventTime } =
      req.body;
    const parsedId = parseInt(req.params.id);

    if (isNaN(parsedId)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Reminder ID must be a number!",
      });
    }

    const checkId = await prisma.reminder.findUnique({
      where: { id: parsedId },
    });

    if (!checkId || checkId.userId !== req.user.id) {
      return res.status(400).json({
        statusCode: 400,
        message: `The data with ID ${parsedId} is not found!`,
      });
    }

    let parsedEventTime;
    if (eventTime) {
      parsedEventTime = new Date(eventTime);
      if (isNaN(parsedEventTime.getTime())) {
        return res.status(400).json({
          statusCode: 400,
          message: "eventTime must be a valid date!",
        });
      }
    }

    const reminderData = {
      title,
      description,
      category,
      status,
      eventTime: parsedEventTime,
      userId: userId ? parseInt(userId) : undefined,
    };

    const updateData = await prisma.reminder.update({
      where: { id: parsedId },
      data: reminderData,
    });

    return res.status(201).json({
      statusCode: 201,
      message: "Successfully update the data!",
      data: updateData,
    });
  } catch (error) {
    console.error("Error : ", error);

    return res.status(500).json({
      statusCode: 500,
      message: "Error, cannot update the data!",
    });
  }
};

exports.deleteReminders = async (req, res) => {
  try {
    const parsedId = parseInt(req.params.id);

    if (isNaN(parsedId)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Reminder ID must be a number!",
      });
    }

    const checkId = await prisma.reminder.findUnique({
      where: { id: parsedId },
    });

    if (!checkId || checkId.userId !== req.user.id) {
      return res.status(400).json({
        statusCode: 400,
        message: `The reminder data with ID ${parsedId} is not found!`,
      });
    }

    await prisma.reminder.delete({
      where: { id: parsedId },
    });

    return res.status(200).json({
      statusCode: 200,
      message: "Successfully delete the data!",
    });
  } catch (error) {
    console.error("Error : ", error);

    return res.status(500).json({
      statusCode: 500,
      message: "Error, cannot delete the data!",
    });
  }
};
