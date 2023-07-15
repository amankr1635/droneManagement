const mongoose = require("mongoose");
const missionModel = require("../../model/missionModel");
const droneModel = require("../../model/droneModel");

const creteMission = async function (req, res) {
  try {
    let body = req.body;
    if (Object.keys(body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "form's cannot be empty" });
    }
    if (!body.siteId) {
      return res
        .status(400)
        .send({ status: false, message: "please enter siteId" });
    }
    body.siteId = body.siteId.trim();
    if (!body.alt) {
      return res
        .status(400)
        .send({ status: false, message: "please enter alt" });
    }
    if (typeof body.alt != "number") {
      return res
        .status(400)
        .send({ status: false, message: "please enter alt in number" });
    }
    if (!body.speed) {
      return res
        .status(400)
        .send({ status: false, message: "please enter speed" });
    }
    if (typeof body.speed !== "number") {
      return res
        .status(400)
        .send({ status: false, message: "please enter speed in number" });
    }
    if (!body.name) {
      return res
        .status(400)
        .send({ status: false, message: "please enter name" });
    }
    body.name = body.name.trim();
    if (body.name == "") {
      return res
        .status(400)
        .send({ status: false, message: "please enter name" });
    }
    //
    if (!body.waypoints) {
      return res
        .status(400)
        .send({ status: false, message: "waypoints are required" });
    }

    // Validate waypoints array
    if (!Array.isArray(body.waypoints) || body.waypoints.length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid waypoints" });
    }

    // Validate waypoint objects
    for (const waypoint of body.waypoints) {
      if (!waypoint.alt) {
        return res.status(400).send({
          status: false,
          message: "Altitude is required for each waypoint",
        });
      }

      if (typeof waypoint.alt != "number") {
        return res
          .status(400)
          .send({ status: false, message: "please enter alt in number" });
      }

      if (!waypoint.lat) {
        return res.status(400).send({
          status: false,
          message: "Latitude is required for each waypoint",
        });
      }
      if (typeof waypoint.lat != "number") {
        return res
          .status(400)
          .send({ status: false, message: "please enter lat in number" });
      }

      if (!waypoint.lng) {
        return res.status(400).send({
          status: false,
          message: "Longitude is required for each waypoint",
        });
      }

      if (typeof waypoint.lng != "number") {
        return res
          .status(400)
          .send({ status: false, message: "please enter lng in number" });
      }
    }
    let missionCreate = await missionModel.create(body);
    await droneModel.updateMany({ site_id: missionCreate.siteId, is_Deleted:false }, { missionId: missionCreate._id });

    delete missionCreate._doc.__v;
    return res.status(201).send({
      status: true,
      message: "mission createed sucessfuly",
      data: missionCreate._doc,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getMission = async function (req, res) {
  try {
    let query = req.query;

    if (Object.keys(query).length == 0) {
      let allMission = await missionModel
        .find()
        .select({ __v: 0, siteId: 0, _id: 0 });
      return res
        .status(200)
        .send({ status: true, message: "All Missions", data: allMission });
    } else {
      if (!query.siteId) {
        return res.status(400).send({
          status: false,
          message: "you can only search mission by siteId",
        });
      }
      query.siteId = query.siteId.trim();
      if (query.siteId == "") {
        return res
          .status(400)
          .send({ status: false, message: "please enter siteId in params" });
      }
      if (!mongoose.Types.ObjectId.isValid(query.siteId)) {
        return res.status(400).send({
          status: false,
          message: "please enter a valid siteId params",
        });
      }
      let missionOnSite = await missionModel
        .find({ siteId: query.siteId })
        .select({ __v: 0, siteId: 0, _id: 0 });
      if (missionOnSite.length==0) {
        return res
          .status(404)
          .send({ status: false, message: "no site found" });
      }
      return res.status(200).send({
        status: true,
        message: "missions on given site",
        missionOnSite,
      });
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateMission = async function (req, res) {
  try {
    let missionId = req.params.missionId;
    let body = req.body;

    if (!missionId) {
      return res
        .status(400)
        .send({ status: false, message: "please enter missionId" });
    }
    if (!mongoose.Types.ObjectId.isValid(missionId)) {
      return res
        .status(404)
        .send({ status: false, msg: "missionId is incorrect" });
    }
    if (Object.keys(body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "forms cannot be empty" });
    }
    if (body.siteId) {
      return res
        .status(400)
        .send({ status: false, message: "site cannot be updated" });
    }
    if (body.alt) {
      if (typeof body.alt !== "number") {
        return res
          .status(400)
          .send({ status: false, message: "provide alt in number" });
      }
    }
    if (body.speed) {
      if (typeof body.speed !== "number") {
        return res
          .status(400)
          .send({ status: false, message: "provide speed in number" });
      }
    }
    if (body.name) {
      if (typeof body.name !== "string") {
        return res
          .status(400)
          .send({ status: false, message: "provide name in string" });
      }
      body.name = body.name.trim();
      if (body.name == "") {
        return res
          .status(400)
          .send({ status: false, message: "name cannot be empty" });
      }
    }
    if (body.waypoints) {
      if (!Array.isArray(body.waypoints) || body.waypoints.length === 0) {
        return res
          .status(400)
          .send({ status: false, message: "Invalid waypoints" });
      }
      // Validate waypoint objects
      for (const waypoint of body.waypoints) {
        if (!waypoint.alt) {
          return res.status(400).send({
            status: false,
            message: "Altitude is required for each waypoint",
          });
        }

        if (typeof waypoint.alt != "number") {
          return res
            .status(400)
            .send({ status: false, message: "please enter alt in number" });
        }

        if (!waypoint.lat) {
          return res.status(400).send({
            status: false,
            message: "Lat is required for each waypoint",
          });
        }
        if (typeof waypoint.lat != "number") {
          return res
            .status(400)
            .send({ status: false, message: "please enter lat in number" });
        }

        if (!waypoint.lng) {
          return res.status(400).send({
            status: false,
            message: "lng is required for each waypoint",
          });
        }

        if (typeof waypoint.lng != "number") {
          return res
            .status(400)
            .send({ status: false, message: "please enter lng in number" });
        }
      }
    }
    const missionUpdate = await missionModel
      .findByIdAndUpdate({ _id: missionId }, body, { new: true })
      .select({ __v: 0 });
    if (!missionUpdate) {
      return res
        .status(404)
        .send({ status: false, message: "Mission doesnot found" });
    }
    return res.status(200).send({
      status: true,
      message: "Updated Successfully",
      data: missionUpdate,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteMission = async function (req, res) {
  try {
    let missionId = req.params.missionId;
    if (!mongoose.Types.ObjectId.isValid(missionId)) {
      return res
        .status(400)
        .send({ status: false, msg: "missionId is incorrect" });
    }
    let deletedMission = await missionModel.findByIdAndDelete( missionId );
    if (!deletedMission) {
      return res
        .status(404)
        .send({ status: false, message: "Mission not found" });
    }
    return res
      .status(200)
      .send({ status: false, message: "Mission Deleted Sucessfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { creteMission, getMission, updateMission, deleteMission };