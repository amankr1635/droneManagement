const siteModel = require("../../model/siteModel");

const createSite = async function (req, res) {
  try {
    let body = req.body;
    if (Object.keys(body).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Form cann't be Empty" });
    if (!body.site_name)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Your site_name" });
    body.site_name = body.site_name.trim();
    if (body.site_name == "")
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Your site_name" });
    if (!body.position || !body.position.latitude || !body.position.longitude)
      return res.status(400).send({
        status: false,
        message: "Please enter both latitude and longitude inside position",
      });
    body.position.latitude = body.position.latitude.trim();
    body.position.longitude = body.position.longitude.trim();
    body.userId = req.decodedToken.userId;

    let create = await siteModel.create(body);
    delete create._doc.__v;
    delete create._doc._id;
    delete create._doc.userId;

    return res.status(201).send({
      status: true,
      message: "Site created Sucessfully",
      data: create._doc,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const getSite = async function (req, res) {
  try {
    let { userId } = req.decodedToken;

    let userSite = await siteModel.find({ userId: userId });

    return res
      .status(200)
      .send({ status: true, message: "All Site", data: userSite });
  } catch (error) {
    return res.status(500).send({ staus: false, message: error.message });
  }
};

const updateSite = async function (req, res) {
  try {
    let params = req.params;
    let body = req.body;
    if (!params) {
      return res
        .status(400)
        .send({ status: false, message: "please provide siteId" });
    }
    if (Object.keys(body).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Form cann't be Empty" });
    if (body.userId) {
      delete body.userId;
    }
    if (body.site_name) {
      body.site_name = body.site_name.trim();
      if (body.site_name == "") {
        return res
          .status(400)
          .send({ status: false, message: "provide me site_name" });
      }
    }
    if (body.position) {
      if (!body.position || !body.position.latitude || !body.position.longitude)
        return res.status(400).send({
          status: false,
          message: "Please enter both latitude and longitude inside position",
        });
      body.position.latitude = body.position.latitude.trim();
      body.position.longitude = body.position.longitude.trim();
    }
    let updatedData = await siteModel.findByIdAndUpdate(params.siteId, body, {
      new: true,
    });

    delete updatedData._doc.__v;
    delete updatedData._doc._id;
    delete updatedData._doc.userId;
    return res.status(200).send({
      status: true,
      message: "Updated successfully",
      data: updatedData._doc,
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};
const deleteSite = async function (req, res) {
  try {
    let params = req.params;

    await siteModel.findByIdAndDelete(params.siteId);

    return res
      .status(200)
      .send({ status: true, message: "Site deleted successfully" });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createSite, getSite, updateSite ,deleteSite};
