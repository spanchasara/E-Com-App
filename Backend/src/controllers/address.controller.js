import catchAsync from "../utils/catch-async.js";
import * as addressService from "../services/address.service.js";

const getAddress = catchAsync(async (req, res) => {
  const address = await addressService.getAddress();
  res.send(address);
});

const getSingleAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  const address = await addressService.getSingleAddress(userId, addressId);
  res.send(address);
});

const addAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const body = req.body;
  const address = await addressService.addAddress({ userId, ...body });
  res.send(address);
});

const editAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  const body = req.body;
  const address = await addressService.editAddress(userId, addressId, body);
  res.send(address);
});

const deleteAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  await addressService.deleteAddress(userId, addressId);
  res.send({
    message: "Address Deleted Successfully!",
  });
});

const getUsersAddress = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const addresses = await addressService.getUsersAddress(userId);
  res.send(addresses);
});

export {
  getAddress,
  getSingleAddress,
  addAddress,
  deleteAddress,
  editAddress,
  getUsersAddress,
};
