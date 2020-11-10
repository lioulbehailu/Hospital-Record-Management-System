const express = require("express");
const router = express.Router();

const Items = require("../models/Items");

/**
 * @swagger
 * /api/items:
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
router.get("/items", (req, res) => {
  Items.find({})
    .sort({ price: 1 })
    .limit(10)
    .exec((err, items) => {
      if (err) {
        res.status(500).json({
          message: "Internal Error",
        });
      }

      res.status(200).json({
        items,
      });
    });
});

/**
 * @swagger
 * /api/items/{id}:
 *  get:
 *    description: get detail of item
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.get("/items/:id", (req, res) => {
  const itemsId = req.params.id;

  Items.find({ _id: itemsId }, (err, items) => {
    if (err) {
      res.status(500).json({
        message: "Internal Error",
      });
    }

    res.status(200).json({
      items: {
        items,
      },
    });
  });
});

/**
 * @swagger
 * /api/items:
 *  post:
 *    description: add items
 *    consumes:
 *       - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              itemName:
 *                type: string
 *              price:
 *                type: string
 *              vendorName:
 *                type: string
 *              description:
 *                  type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/items", (req, res) => {
  const { itemName, price, vendorName, description } = req.body;

  const newItem = new Items({
    itemName,
    price,
    vendorName,
    description,
  });

  newItem.save((err, data) => {
    if (err) {
      res.status(500).json({ message: "internal error" });
    }

    res.status(200).json(data);
  });
});

/**
 * @swagger
 * /api/items/{id}:
 *  post:
 *    description: update items
 *    consumes:
 *       - application/json
 *    requestBody:
 *      content:
 *        application/json:
 *          schema:
 *          type: object
 *          properties:
 *            - itemName:
 *                type: string
 *              price:
 *                type: integer
 *              vendorName:
 *                type: string
 *              description:
 *                type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.put("/items/:id", (req, res) => {
  const itemsId = req.params.id;

  Items.findOneAndUpdate(itemsId, { $set: req.body }, { new: true }).exec(
    (err, data) => {
      if (err) {
        console.log(err);
      }
      res.status(200).json({ data });
    }
  );
});

/**
 * @swagger
 * /api/items/{id}:
 *  delete:
 *    description: delete item
 *    consumes:
 *       - application/json
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.delete("/items/:id", (req, res) => {
  const itemsId = req.params.id;

  Items.deleteMany({ _id: { $in: itemsId } }).exec((err, data) => {
    if (err) {
      console.log(err);
    }
    res.status(200).json({ data });
  });
});

module.exports = router;
