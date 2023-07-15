const userModel = require("../../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { passwordVal, isValidEmail } = require("../../validation/validation");

const createUser = async function (req, res) {
  try {
    let body = req.body;

    if (Object.keys(body).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Form cann't be Empty" });
    if (!body.name)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Your Name" });
    body.name = body.name.trim();
    if (body.name == "")
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Your Name" });
    body.email = body.email.trim().toLowerCase();
    if (body.email == "")
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Your email" });
    if (!isValidEmail(body.email))
      return res
        .status(400)
        .send({ status: false, message: "Please Enter a valid email" });
    if (!body.email)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Your email" });
    if (!body.password)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Password" });
    body.password = body.password.trim().toString();
    if (body.password == "")
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Password" });
    if (!passwordVal(body.password))
      return res.status(400).send({
        status: false,
        message:
          "Password must contains at least 1 lowercase, 1 uppercase, 1 numeric character at least one special character and must be minnimun 8 character",
      });

    const saltRound = body.password.length;
    let hash = await bcrypt.hash(body.password, saltRound);
    body.password = hash;

    let userExist = await userModel.findOne({ email: body.email });

    if (userExist) {
      return res
        .status(400)
        .send({ status: false, message: "Email Already Registered" });
    }
    let create = await userModel.create(body);
    return res
      .status(201)
      .send({ status: true, message: "Registered Sucessfully", data: create });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const userLogin = async function (req, res) {
  try {
    let body = req.body;
    if (!body)
      return res
        .status(400)
        .send({ status: false, message: "Form cann't be Empty" });
    if (!body.email)
      return res.status(400).send({
        status: false,
        message: "Please Enter Your email",
      });
    if (!body.password)
      return res
        .status(400)
        .send({ status: false, message: "Please Enter your Password" });

    let userCheck = await userModel.findOne({ email: body.email });
    if (!userCheck)
      return res.status(404).send({ status: false, message: "user Not found" });

    bcrypt.compare(body.password, userCheck.password, (err, pass) => {
      if (err) {
        throw err;
      }
      if (pass) {
        let token = jwt.sign({ userId: userCheck._id }, "thisIsMySecrateKey");
        token = token.toString();
        res.setHeader("x-api-key", token);
        return res.status(200).send({
          status: true,
          message: "Sucessfully LogedIn",
          name: userCheck.name,
          token: token,
          userId: userCheck._id,
        });
      } else {
        return res
          .status(400)
          .send({ status: false, message: "Invalid password" });
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUsersDetails = async function (req, res) {
  try {
    let { userId } = req.decodedToken;
    let userDetails = await userModel
      .findOne({ _id: userId })
      .select({ __v: 0 });
    if (!userDetails) {
      return res
        .status(404)
        .send({ status: false, message: "user doesnot found" });
    }
    return res
      .status(200)
      .send({ status: false, message: "user's Data", data: userDetails });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUser, userLogin, getUsersDetails };
