const express = require("express");
const router = express.Router()
const { createUser ,userLogin, getUsersDetails } = require("../controllers/userControllers/user");
const { createSite,getSite,updateSite,deleteSite }= require("../controllers/siteController/site");
const { createDrone,getDrone,updateDrone,deleteDrone, droneShift } = require("../controllers/droneController/drone");
const { authentication, authorisation } = require("../middleware/middleware");
const { creteMission, getMission, updateMission, deleteMission } = require("../controllers/missionController/mission");
const { createCategory, getCategory, updateCategory, deleteCategory, updateCategoryToMission, getMissionFromCategory, getDronesByCategory } = require("../controllers/categoryController/category");


router.get("/test-me",(req,res)=>{
    return res.status(200).send({status:true, message:"Api is Working"})
})

// User APIs:

router.post("/createUser", createUser);
router.post("/logIn", userLogin);
router.get("/getUser",authentication,getUsersDetails);

// Site APIs:

router.post("/createSite",authentication,createSite);
router.get("/getSite",authentication,getSite);
router.put("/updateSite/:siteId",authentication,authorisation,updateSite);
router.delete("/deleteSite/:siteId",authentication,authorisation,deleteSite);

// Drone APIs:

router.post("/createDrone",authentication,createDrone);
router.get("/drones/:siteId",authentication,getDrone);
router.put("/updateDrone/:droneId",authentication,updateDrone); 
router.delete("/deletedrone/:droneId",authentication,deleteDrone);

// Mission APIs:

router.post("/createMision",authentication,creteMission);
router.get("/getMission",authentication,getMission);
router.put("/updateMission/:missionId",authentication,updateMission);
router.delete("/deleteMission/:missionId",authentication,deleteMission);

// Shifting Drones API:

router.put("/drone/:droneId/shift",authentication,droneShift);

// Category APIs (Bonus):

router.post("/createCategory",authentication,createCategory);
router.get("/getCategory",authentication,getCategory);
router.put("/updateCategory/:categoryId",authentication,updateCategory);
router.delete("/deleteCategory/:categoryId",authentication,deleteCategory);

// Association APIs (Bonus):

router.put("/missions/:missionId/category/:categoryId",authentication,updateCategoryToMission);
router.get("/categories/:categoryId/missions",authentication,getMissionFromCategory);

router.get("/drones/category/:categoryId",authentication,getDronesByCategory);


module.exports = router