const createUser = require("../models/createUser");
const jwt = require("jsonwebtoken");

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance.toFixed(2) + "km";
}

exports.getUserDistance = async (req, res) => {
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

    const user = await createUser.findById(decoded.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        status_code: 404,
        message: "User not found",
      });
    }

    const { latitude: userLatitude, longitude: userLongitude } = user;
    const { destination_latitude, destination_longitude } = req.query;

    if (!destination_latitude || !destination_longitude) {
      return res.status(400).json({
        success: false,
        status_code: 400,
        message: "Please provide both destination latitude and longitude",
      });
    }

    const distance = calculateDistance(
      userLatitude,
      userLongitude,
      parseFloat(destination_latitude),
      parseFloat(destination_longitude)
    );

    res.status(200).json({
      success: true,
      status_code: 200,
      message: "Distance calculated successfully",
      distance,
    });
  } catch (error) {
    console.error("Error while calculating distance:", error.message);
    res.status(500).json({
      success: false,
      status_code: 500,
      message: "Something went wrong while calculating the distance",
    });
  }
};
