const createUser = require("../models/createUser");
const jwt = require("jsonwebtoken");

exports.getUserListing = async (req, res) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        success: false,
        status_code: 401,
        message: "Token not provided, authorization denied",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(401).json({
        success: false,
        status_code: 401,
        message: "Invalid token, authorization denied",
      });
    }

    const { week_number } = req.query;

    if (!week_number) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Please provide week numbers",
      });
    }

    const weekNumbers = week_number.split(",").map(Number);

    if (
      weekNumbers.some(isNaN) ||
      weekNumbers.some((num) => num < 0 || num > 6)
    ) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Week numbers must be between 0 (Sunday) and 6 (Saturday)",
      });
    }

    const users = await createUser.aggregate([
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: "$register_at" },
        },
      },
      {
        $match: {
          dayOfWeek: { $in: weekNumbers.map((day) => day + 1) },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          dayOfWeek: 1,
        },
      },
    ]);

    const groupedUsers = users.reduce((acc, user) => {
      const dayMap = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const day = dayMap[user.dayOfWeek - 1];
      acc[day] = acc[day] || [];
      acc[day].push({
        name: user.name,
        email: user.email,
      });
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      status_code: 200,
      message: "User listing fetched successfully",
      data: groupedUsers,
    });
  } catch (error) {
    console.error("Error while fetching user listing:", error.message);
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Internal server error",
    });
  }
};
