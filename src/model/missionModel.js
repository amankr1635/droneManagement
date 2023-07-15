const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const missionSchema = new mongoose.Schema(
  {
    siteId: {
      type: ObjectId,
      ref: "Site",
      required: true,
    },
    alt: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    waypoints: {
      type: [Object],
      alt: {
        type: Number,
        required: true,
      },
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    categoryId: {
      type: ObjectId,
      ref: "Category"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Mission", missionSchema);
