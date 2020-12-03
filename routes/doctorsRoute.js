const express = require("express");
const router = express.Router();

const Doctors = require("../models/Doctors");

/**
 * @swagger
 * /api/doctors:
 *  get:
 *    description: get list of items
 *    consumes:
 *       - application/json
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/doctors", (req, res) => {
  Doctors.find({})
    .sort({ price: 1 })
    .limit(10)
    .exec((err, doctors) => {
      if (err) {
        res.status(500).json({
          message: "Internal Error",
        });
      }

      res.status(200).json({
        doctors,
      });
    });
});

/**
 * @swagger
 * /api/doctors:
 *  post:
 *    description: Used to register Doctors
 *    consumes:
 *       - application/json
 *    produces:
 *       - application/json
 *    requestBody:
 *        type: object
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                fullName:
 *                  type: string
 *                email:
 *                  type: string
 *                username:
 *                  type: string
 *                address:
 *                  type: string
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/doctors", (req, res) => {
  const { fullName, email, username, address } = req.body;
  let newDoctor = new Doctors({
    fullName,
    email,
    username,
    address,
  });

  newDoctor.save((err) => {
    if (err) {
      res.status(500).send({
        message: "Error, Check the parameters",
      });
    } else {
      res.status(200).send({
        message: "registered successfully",
      });
    }
  });
});

module.exports = router;
