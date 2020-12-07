const express = require("express");
const router = express.Router();

const Patients = require("../models/Patients");

/**
 * Patient API to be exposed to the outside System
 */

/**
 * @swagger
 * /api/patients:
 *  get:
 *    description: get list of items in the cart
 *    consumes:
 *       - application/json
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/patients", (req, res) => {
  Patients.find({}, (err, patients) => {
    if (err) {
      res.status(500).json({
        message: "Internal Error",
      });
    }
    res.status(200).json(patients);
  });
});

/**
 * @swagger
 * /api/patients:
 *  post:
 *    description: add patients
 *    consumes:
 *      - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              fatherName:
 *                type: string
 *              grandFatherName:
 *                type: string
 *              gender:
 *                type: string
 *              dateOfBirth:
 *                type: string
 *              dayOfBirth:
 *                type: string
 *              monthOfBirth:
 *                type: string
 *              yearOfBirth:
 *                type: string
 *              age:
 *                type: string
 *              address:
 *                type: string
 *              phoneNumber:
 *                type: string
 *              history:
 *                type: [string]
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        '200':
 *          description: A successful response
 */
router.post("/patients", (req, res) => {
  console.log(req.body);
  const {
    name,
    fatherName,
    grandFatherName,
    gender,
    dateOfBirth,
    dayOfBirth,
    monthOfBirth,
    yearOfBirth,
    age,
    address,
    phoneNumber,
    history,
  } = req.body;

  let newPatient = new Patients({
    name,
    fatherName,
    grandFatherName,
    gender,
    dateOfBirth,
    dayOfBirth,
    monthOfBirth,
    yearOfBirth,
    age,
    address,
    phoneNumber,
    history,
  });

  console.log(newPatient);
  newPatient.save((err) => {
    if (err) {
      console.log(err);
      res.status(500).send({
        message: "Error, check the parameters",
      });
    } else {
      res.status(200).send({
        message: "registered successfully",
      });
    }
  });
});

module.exports = router;
