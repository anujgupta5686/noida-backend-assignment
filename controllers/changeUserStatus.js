const createUser = require("../models/createUser");
const jwt = require("jsonwebtoken");

exports.changeUserStatus = async (req, res) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        success: false,
        status_code: 401,
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        status_code: 401,
        message: "Invalid token, authorization denied",
      });
    }
    await createUser.updateMany({}, [
      {
        $set: {
          status: {
            $cond: {
              if: { $eq: ["$status", "active"] },
              then: "inactive",
              else: "active",
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      status_code: 200,
      message: "All users' status have been successfully changed",
    });
  } catch (error) {
    console.error("Error while changing user statuses:", error.message);
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Something went wrong while changing user statuses",
    });
  }
};
