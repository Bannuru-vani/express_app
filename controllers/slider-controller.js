const SliderItem = require('../models/SliderItem');
const asyncHandler = require('../middlewares/asyncHandler');
const httpError = require('../utils/httpError');

//#region ~ POST - /api/v1/slider - Upload a slider - Private
exports.addSlider = asyncHandler(async (req, res, next) => {
  let { title, desc, img, bg } = req.body;
  const sliderItem = await SliderItem.create({
    title,
    desc,
    img,
    bg,
  });
  sliderItem.save();
  return res.status(201).json({ item: sliderItem.toObject({ getters: true }) });
});
//#endregion

//#region ~ GET - /api/v1/slider - GET USER(info of logged in user) - Private
exports.getSliders = asyncHandler(async (req, res, next) => {
  const items = await SliderItem.find();
  res.status(200).json(items);
});
//#endregion

//#region ~ PUT - /api/v1/slider/:sliderId - Upload a slider - Private
exports.changeActiveStatus = asyncHandler(async (req, res, next) => {
  let { active } = req.body;
  let { sliderId } = req.params;
  const sliderItem = await SliderItem.findById(sliderId);
  sliderItem.active = active;
  sliderItem.save();
  return res.status(201).json({ item: sliderItem.toObject({ getters: true }) });
});
//#endregion
