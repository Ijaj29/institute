const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");


const parseForm = bodyParser.urlencoded({ extended: false });

const cache = require("cache-headers");
const permit = require("../models/middleWare/permission");
const { verifyToken } = require("../models/middleWare/jwtHelper");

const crypto = require("crypto");
const format = require("biguint-format");
const admin = require("../models/BAL/adminBal");

const overrideConfig = {
  maxAge: 6000,
  setPrivate: true,
  staleError: "number",
  staleRevalidate: "number",
  lastModified: "string"
};

function randomC(qty) {
  const x = crypto.randomBytes(qty);
  return format(x, "dec");
}

function random(low, high) {
  return randomC(4) / Math.pow(2, 4 * 8 - 1) * (high - low) + low;
}

router.get(
  "/dashboard",
  verifyToken,
  permit.permission("ADMIN"),
  cache.overrideCacheHeaders(overrideConfig),
  function (req, res) {
    return res.status(200).json({
      statusMsg: 200,
      msg: "Dashboard"
    });
  }
);

router.post(
  "/addAnalyst",
  verifyToken,
  permit.permission("ADMIN"),
  cache.overrideCacheHeaders(overrideConfig),
  function (req, res) {
    try {
      admin.addAnalyst(req.body, async function (response) {
        return res.status(200).json({
          statusMsg: 200,
          msg: response
        });
      });
    } catch (err) {
      console.error("Login token generation failed:", err);

      return res.status(500).json({
        statusMsg: 500,
        msg: "Token generation failed"
      });
    }
  }
);

router.get(
  "/getAnalyst",
  verifyToken,
  permit.permission("ADMIN"),
  cache.overrideCacheHeaders(overrideConfig),
  function (req, res) {
    try {
      admin.getAnalyst(function (response, err) {
        if (err) {
          return res.status(500).json({
            statusMsg: 500,
            msg: "Unable to fetch analysts"
          });
        }

        return res.status(200).json(response);
      });
    } catch (err) {
      return res.status(500).json({
        statusMsg: 500,
        msg: "Unable to fetch analysts"
      });
    }
  }
);

module.exports = router;