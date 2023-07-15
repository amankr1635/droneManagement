const categoryModel = require("../../model/categoryModel");
const mongoose = require("mongoose");
const missionModel = require("../../model/missionModel");
const droneModel = require("../../model/droneModel");

const createCategory = async function (req, res) {
  try {
    let body = req.body;
    let { userId } = req.decodedToken;
    body.userId = userId;
    if (Object.keys(body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "form cannot be empty" });
    }
    if (!body.name) {
      return res
        .status(400)
        .send({ status: false, message: "please enter name in body" });
    }
    body.name = body.name.trim();
    if (body.name === "") {
      return res
        .status(400)
        .send({ status: false, message: "name cannot be empty" });
    }
    if (!body.color) {
      return res
        .status(400)
        .send({ status: false, message: "please enter color in body" });
    }
    body.color = body.color.trim();
    if (body.color === "") {
      return res
        .status(400)
        .send({ status: false, message: "color cannot be empty" });
    }
    if (!body.tag_name) {
      return res
        .status(400)
        .send({ status: false, message: "please enter tag_name in body" });
    }
    body.tag_name = body.tag_name.trim();
    if (body.tag_name === "") {
      return res
        .status(400)
        .send({ status: false, message: "tag_name cannot be empty" });
    }
    let create = await categoryModel.create(body);
    delete create._doc.__v;
    return res.status(201).send({
      status: false,
      message: "Category Created Sucessfully",
      data: create,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getCategory = async function (req, res) {
  try {
    let { userId } = req.decodedToken;
    let usersCategory = await categoryModel
      .find({ userId: userId })
      .select({ __v: 0, userId: 0 });
    if (usersCategory.length == 0) {
      return res
        .status(404)
        .send({ status: false, message: "user doesnot have Category" });
    }
    return res
      .status(200)
      .send({ status: false, message: "Your categories", data: usersCategory });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateCategory = async function (req, res) {
  try {
    let body = req.body;
    let categoryId = req.params.categoryId;
    let { userId } = req.decodedToken;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .send({ status: false, message: "categoryId is incorrect" });
    }
    if (Object.keys(body).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "form cannot be empty" });
    }
    if (body.userId) {
      delete body.userId;
    }
    if (body.name) {
      if (typeof body.name !== "string") {
        return res
          .status(400)
          .send({ status: false, message: "name must be in string" });
      }
      body.name = body.name.trim();
      if (body.name === "") {
        return res
          .status(400)
          .send({ status: false, message: "name cannot be empty" });
      }
    }
    if (body.color) {
      if (typeof body.color != "string") {
        return res
          .status(400)
          .send({ status: false, message: "color must be in string" });
      }
      body.color = body.color.trim();
      if (body.color === "") {
        return res
          .status(400)
          .send({ status: false, message: "color cannot be empty" });
      }
    }
    if (body.tag_name) {
      if (typeof body.tag_name != "string") {
        return res
          .status(400)
          .send({ status: false, message: "tag_name must be in string" });
      }
      body.tag_name = body.tag_name.trim();
      if (body.tag_name === "") {
        return res
          .status(400)
          .send({ status: false, message: "tag_name cannot be empty" });
      }
    }
    let categoryCheck = await categoryModel.findOne({ _id: categoryId });
    if (!categoryCheck) {
      return res
        .status(404)
        .send({ status: false, message: "no category found" });
    }
    if (userId != categoryCheck.userId) {
      return res.status(401).send({
        status: false,
        message: "you are not authorised to update this category",
      });
    }
    let update = await categoryModel
      .findOneAndUpdate({ _id: categoryId, userId: userId }, body, {
        new: true,
      })
      .select({ __v: 0, userId: 0 });

    return res.status(200).send({
      status: true,
      message: "Category Updated Sucessfully",
      data: update,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const deleteCategory = async function (req, res) {
  try {
    let categoryId = req.params.categoryId;
    let { userId } = req.decodedToken;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .send({ status: false, message: "categoryId is incorrect" });
    }
    let categoryCheck = await categoryModel.findOne({ _id: categoryId });
    if (!categoryCheck) {
      return res
        .status(404)
        .send({ status: false, message: "No category found" });
    }
    if (userId != categoryCheck.userId) {
      return res
        .status(401)
        .send({ status: false, message: "you are not authorised" });
    }
    await categoryModel.findByIdAndDelete(categoryId);
    return res
      .status(200)
      .send({ status: false, message: "Category Deleted Sucessfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const updateCategoryToMission = async function (req, res) {
  try {
    let missionId = req.params.missionId;
    let categoryId = req.params.categoryId;

    if (!mongoose.Types.ObjectId.isValid(missionId)) {
      return res
        .status(400)
        .send({ status: false, message: "missionId is incorrect" });
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .send({ status: false, message: "categoryId is incorrect" });
    }
    const updatedMission = await missionModel
      .findByIdAndUpdate(missionId, { categoryId: categoryId }, { new: true })
      .select({ __v: 0 });
    if (!updatedMission) {
      return res
        .status(404)
        .send({
          status: false,
          message: "no mission found to assign category",
        });
    }
    return res
      .status(200)
      .send({
        status: true,
        message: "Category Assigned to Mission",
        data: updatedMission,
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getMissionFromCategory = async function (req, res) {
  try {
    let categoryId = req.params.categoryId;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .send({ status: false, message: "categoryId is incorrect" });
    }
    let allMissionFromCategory = await missionModel
      .find({ categoryId: categoryId })
      .select({ __v: 0 });
    if (allMissionFromCategory.length == 0) {
      return res
        .status(404)
        .send({
          status: false,
          message: "mission doesnot found from this category",
        });
    }
    return res
      .status(200)
      .send({ status: false, message: "All Mission From This Category",data:allMissionFromCategory });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};


const getDronesByCategory= async function (req, res) {
  try {
    const categoryId = req.params.categoryId;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid category ID" });
    }
    const categoryCheck = await categoryModel.findOne({_id:categoryId})
    if(!categoryCheck){
      return res.status(404).send({status:false, message:"thi category doesnot exist"})
    }
    const categoryFromMision = await missionModel.findOne({categoryId:categoryId})
    if(!categoryFromMision){
      return res.status(404).send({status:false, message:"this category is not assign to drone"})
    }
    const droneFromCategory = await droneModel.find({site_id:categoryFromMision.siteId,is_Deleted:false}).select({__V:0})
    if(droneFromCategory.length==0){
      return res.status(404).send({status:false, message:"drone does not found"})
    }
  return res.status(200).send({
      status: true,
      message: "Drones retrieved successfully",
      drones: droneFromCategory,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
}




module.exports = {createCategory,getCategory,updateCategory,deleteCategory,updateCategoryToMission,getMissionFromCategory, getDronesByCategory};
