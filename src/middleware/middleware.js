const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const siteModel = require("../model/siteModel");

const authentication = async function (req, res, next) {
  try {
    const token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, msg: `headers is missing in request` });
    }
    jwt.verify(token, "thisIsMySecrateKey", (err, decodedToken) => {
      if (err)
        return res.status(400).send({ status: false, message: err.message });
      else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const authorisation = async function (req, res, next) {
  try {
    const userId = req.decodedToken.userId;
    let siteId = req.params.siteId;
    if (!siteId) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide siteId in params" });
    }
    if (!mongoose.Types.ObjectId.isValid(siteId)) {
      return res
        .status(404)
        .send({ status: false, msg: "site Id is incorrect" });
    }
    let usersSite = await siteModel.findOne({ userId: userId });
    if (!usersSite) {
      return res.status(404).send({ msg: "user's site does not exist" });
    }
    let siteCheck = await siteModel.findOne({ _id: siteId });
    if (!siteCheck) {
      return res
        .status(404)
        .send({ status: false, message: "site Does not Found" });
    }
    let extuserId = usersSite.userId;
    if (userId != extuserId) {
      return res.status(401).send({
        status: false,
        msg: "You are not allowed to modify other's data",
      });
    }
    next();
  } catch (error) {
   return res.status(500).send({ status: false, Error: error.message });
  }
};

module.exports = { authentication, authorisation };
