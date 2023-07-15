const mongoose = require("mongoose");
const droneModel = require("../../model/droneModel");
const siteModel = require("../../model/siteModel");
const userModel = require("../../model/userModel");

const createDrone = async function (req, res) {
  try {
    let body = req.body;
    if (Object.keys(body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Form's cannot be Empty" });
    }
    if (!body.drone_id) {
      return res
        .status(400)
        .send({ status: false, message: "please enter drone_id" });
    }
    body.drone_id = body.drone_id.trim();
    if (body.drone_id == "") {
      return res
        .status(400)
        .send({ status: false, message: "drone_id cannot be empty" });
    }
    if (!body.site_id) {
      return res
        .status(400)
        .send({ status: false, message: "please enter site_id" });
    }
    if (!mongoose.Types.ObjectId.isValid(body.site_id)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter a valid site_id" });
    }
    body.site_id = body.site_id.trim();
    if (body.drone_id == "") {
      return res
        .status(400)
        .send({ status: false, message: "site_id cannot be empty" });
    }
    if (body.is_Deleted == true) {
      delete body.is_Deleted;
    }
    let siteCheck = await siteModel.findOne({ _id: body.site_id });
    if (!siteCheck) {
      return res
        .status(404)
        .send({ status: false, message: "Site Does not found" });
    }
    if (!body.drone_type) {
      return res
        .status(400)
        .send({ status: false, message: "please enter drone_type" });
    }
    body.drone_type = body.drone_type.trim();
    if (body.drone_type == "") {
      return res
        .status(400)
        .send({ status: false, message: "drone_type cannot be empty" });
    }
    if (!body.make_name) {
      return res
        .status(400)
        .send({ status: false, message: "please enter make_name" });
    }
    body.make_name = body.make_name.trim();
    if (body.make_name == "") {
      return res
        .status(400)
        .send({ status: false, message: "make_name cannot be empty" });
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
        .send({ status: false, message: "name cannot be empty" });
    }
    let createData = await droneModel.create(body);
    delete createData._doc.__v;
    delete createData._doc._id;
    return res.status(201).send({
      status: false,
      message: "Drone created Sucessfully",
      data: createData._doc,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getDrone = async function (req, res) {
  try {
    let params = req.params;

    params.siteId = params.siteId.trim();
    if (params.siteId == "") {
      return res
        .status(400)
        .send({ status: false, message: "please enter siteId in params" });
    }
    if (!mongoose.Types.ObjectId.isValid(params.siteId)) {
      return res
        .status(400)
        .send({ status: false, message: "please enter a valid siteId params" });
    }
    let drones = await droneModel
      .find({ site_id: params.siteId, is_Deleted: false })
      .select({ __v: 0 });
    if (drones.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "This site doesnot have Drones" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Drones on this site", data: drones });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateDrone = async function (req, res) {
  try {
    let body = req.body;
    let params = req.params;

    if (body.is_Deleted == true) {
      delete body.is_Deleted;
    }
    if (body.drone_id) {
      body.drone_id = body.drone_id.trim();
      if (body.drone_id == "") {
        return res
          .status(400)
          .send({ status: false, message: "drone_id cannot be empty" });
      }
    }
    if (body.site_id) {
      body.site_id = body.site_id.trim();
      if (body.site_id == "")
        return res
          .status(400)
          .send({ status: false, message: "site_id cannot be empty" });
      if (!mongoose.Types.ObjectId.isValid(body.site_id)) {
        return res
          .status(400)
          .send({ status: false, message: "please enter a valid site_id" });
      }
    }
    if (body.deleted_by) {
      delete body.deleted_by;
    }
    if (body.deleted_on) {
      delete body.deleted_on;
    }
    if (body.drone_type) {
      body.drone_type = body.drone_type.trim();
      if (body.drone_type == "") {
        return res
          .status(400)
          .send({ status: false, message: "drone_type cannot be empty" });
      }
    }
    if (body.make_name) {
      body.make_name = body.make_name.trim();
      if (body.make_name == "") {
        return res
          .status(400)
          .send({ status: false, message: "make_name cannot be empty" });
      }
    }
    if (body.name) {
      body.name = body.name.trim();
      if (body.name == "") {
        return res
          .status(400)
          .send({ status: false, message: "name cannot be empty" });
      }
    }
    let update = await droneModel
      .findOneAndUpdate({ _id: params.droneId }, body, { new: true })
      .select({ __v: 0 });

    return res
      .status(200)
      .send({ status: false, message: "Updated Sucessfully", data: update });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteDrone = async function (req, res) {
  try {
    let params = req.params;
    let { userId } = req.decodedToken;

    let userName = await userModel.findOne({ _id: userId });

    let deletedDrone = await droneModel.findOneAndUpdate(
      { _id: params.droneId },
      { is_Deleted: true, deleted_on: new Date(), deleted_by: userName.name }
    );
    if (!deletedDrone) {
      return res
        .status(404)
        .send({ status: false, message: "Drone not found" });
    }
    return res.status(200).send({
      status: true,
      message: "Drone deleted successfully",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const droneShift = async function (req, res) {
  try {
    let droneId = req.params.droneId;
    let body = req.body;
    if (!mongoose.Types.ObjectId.isValid(droneId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid droneId" });
    }
    if (Object.keys(body).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Form cannot be empty" });
    }
    if (!body.site_id) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter site_id only" });
    }
    body.site_id = body.site_id.trim();
    if (body.site_id === "") {
      return res
        .status(400)
        .send({ status: false, message: "site_id cannot be empty" });
    }
    if (!mongoose.Types.ObjectId.isValid(body.site_id)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter a valid siteId" });
    }
    let siteIdCheck = await siteModel.findOne({ _id: body.site_id });
    if (!siteIdCheck) {
      return res
        .status(404)
        .send({ status: false, message: "This site does not exist" });
    }
    let shiftedDrone = await droneModel.findOneAndUpdate(
      { _id: droneId },
      { site_id: body.site_id }
    );
    if (!shiftedDrone) {
      return res
        .status(404)
        .send({ status: false, message: "Drone not found" });
    }
    return res
      .status(200)
      .send({ status: true, message: "Drone shifted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = {createDrone,getDrone,updateDrone,deleteDrone,droneShift,};