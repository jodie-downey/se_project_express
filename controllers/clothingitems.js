const Item = require("../models/clothingitem");
const {
  SUCCESSFUL_REQUEST_CODE,
  SUCCESSFULL_POST_CODE,
  BAD_REQUEST_STATUS_CODE,
  REQUEST_NOT_FOUND_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

const CreateItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, imageUrl, weather } = req.body;

  Item.create({ name, imageUrl, weather, owner: req.user })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: err.message });
    });
};

module.exports = { CreateItem };
