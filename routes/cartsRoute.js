const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");

/**
 * @swagger
 * /api/cart:
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
router.get("/cart", (req, res) => {
  Cart.find({}, { limit: 10, price: 1 }, (err, carts) => {
    if (err) {
      res.status(500).json({
        message: "Internal Error",
      });
    }

    res.status(200).json({
      cart: {
        carts,
      },
    });
  });
});

/**
 * @swagger
 * /api/cart:
 *  post:
 *    description: add items to cart
 *    consumes:
 *       - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            cart:
 *              type: array
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post("/cart", (req, res) => {
  const { cartArray } = req.body;

  Cart.insertMany(cartArray, (err, data) => {
    if (err) {
      res.status(500).json({
        message: "Internal Error",
      });
    }

    res.status(200).json({
      data,
    });
  });
});

/**
 * @swagger
 * /api/cart:
 *  put:
 *    description: update a cart
 *    consumes:
 *       - application/json
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: array
 *            required:
 *              itemName:
 *                type: string
 *              price:
 *                type: string
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
router.put("/cart", (req, res) => {
  const { cartObj } = req.body;

  Cart.update({ $pull: { cartObj } }, (err, data) => {
    if (err) {
      res.status(500).json({
        message: "Internal Error",
      });
    }

    res.status(200).json({
      data,
    });
  });
});

module.exports = router;
