# Assignment - Backend Developer

We have a big corporation that wants to survey/map the area of its
campus/sites using drones. They can have multiple campuses in-country or
internationally. We need to design a system that satisfies the following
requirements:

- Users can have multiple drones in his/her account.
- Each drone will be assigned to a particular campus/site.
- Users can create missions which are geolocations that a drone follows in
  order to survey/map sites. Each mission will be assigned to a site.
- Users can change drones from one campus/site to another. But missions cannot be changed from one campus/site to another.
- Users can run missions only on drones that are assigned to the site where
  the mission belongs.
- Missions can be categorized into multiple types (path, grid/survey,
  corridor).
- Users can use these categories to filter missions according to his/her
  needs

## Clone Repository
- To clone this Repository
```ymal
git clone https://github.com/amankr1635/flytbase.git
```

## Installation

```bash
npm install
```

## Start Server

```bash
npm start / nodemon src/index.js
```

## EndPoints

#### post/createUser

- Allows users to sign up by creating a new account. Requires the user's name, email, and password to create a new account.

```ymal
post/createUser
```

#### post/login

- Allows users to log in to their account. Requires the user's email and password to authenticate the user.

```ymal
post/login
```

- Allows user to get his/her details

#### get/getUser

```ymal
get/getUser
```

#### post/createSite

- Allows user to create site

```ymal
post/createSite
```

```ymal
{
    "site_name":"ranchi",
    "position": {
        "longitude": "1.40673",
        "latitude": "3456.7890"
    }
}
```

#### get/getSite

- Allows user to get all sites which is created by loggedIn user

```ymal
get/getSite
```

#### put/updateSite/:siteId

- Allows users to updates the site which is created by loggedId user

```ymal
put/updateSite/:siteId
```

#### delete/deleteSite/:siteId

- Allows users to delete sites which is created by him/her

```ymal
delete/deleteSite/:siteId
```

#### post/createDrone

- Allows users to create drone

```ymal
post/createDrone
```

```ymal
{
    "drone_id":"wVQv1qs6",
    "site_id": "64aee2793f4b23613db12a99",
    "drone_type": "Real Drone  ",
    "make_name": "cloudsim  ",
    "name": "Virtual Drone"
}
```

#### get/drones/:siteId

- Allow user to get drone on a particular site

```ymal
    get/drones/:siteId
```

#### put/updateDrone/:droneId

- Allows user to update drone by providing droneId in path params

```ymal
    put/updateDrone/:droneId
```

#### delete/deletedrone/:droneId

- Allows user to delete drone by providing droneId in path params

```ymal
delete/deletedrone/:droneId
```

#### post/createMision

- Allows user to create mission

```ymal
    post/createMision
```

#### get/getMission

- Allows user to get all the mission

```ymal
get/createMision
```

#### put/updateMission/:missionId

- Allows user to update mission

```ymal
put/updateMission/:missionId
```

#### delete/deleteMission/:missionId

- Allows user to delete particular mission by passing missionId in path params

```ymal
delete/deleteMission/:missionId
```

#### put/drone/:droneId/shift

- Allows user to shift drone from one site to another

```ymal
put/drone/:droneId/shift
```

#### post/createCategory

- Allows user to create a category

```ymal
post/createCategory
```

#### get/getCategory

- Allows user to get all the category

```ymal
get/getCategory
```

#### put/updateCategory/:categoryId

- Allows user to update individula category by providing categoryId from path params

```ymal
put/updateCategory/:categoryId
```

#### delete/deleteCategory/:categoryId

- Allows user to delete the individula category which is created by him/her

```ymal
delete/deleteCategory/:categoryId
```

#### put/missions/:missionId/category/:categoryId

- Allows user to update mission by providing a categoryId

```ymal
put/missions/:missionId/category/:categoryId
```

#### get/categories/:categoryId/missions

- Allows user to get all the mission which contains the same categoryId

```ymal
get/categories/:categoryId/missions
```

#### get/drones/category/:categoryId

- Allows user to get all the drone by providing categoryId

```ymal
get/drones/category/:categoryId
```
