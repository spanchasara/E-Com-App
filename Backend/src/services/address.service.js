import httpStatus from "http-status";
import Address from "../models/address.model.js";
import ApiError from "../utils/api-error.js";

const getUsersAddress = async (userId) => {
  const addresses = await Address.find({ userId });
  if (!addresses)
    throw new ApiError(httpStatus.NOT_FOUND, "No Address Found for the user!");

  return addresses;
};

const getSingleAddress = async (userId, addressId) => {
  const address = await Address.findOne({ userId, _id: addressId });

  if (!address) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Address does not exist for this user!"
    );
  }
  return address;
};

const addAddress = async (userId, addressBody) => {
  const addresses = await Address.find({ userId });

  if (addresses.length === 0) {
    addressBody.isDefault = true;
  }
  if (addressBody.isDefault) {
    const prevDefault = await Address.findOne({ userId, isDefault: true });
    if (prevDefault) {
      prevDefault.isDefault = false;
      await prevDefault.save();
    }
  }
  const address = await Address.create(addressBody);

  if (!address) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error in Creating Address!"
    );
  }
  const allAddresses = await Address.find({ userId });
  return address;
};

const editAddress = async (userId, addressId, addressBody) => {
  if (addressBody.isDefault) {
    const prevDefault = await Address.findOne({ userId, isDefault: true });
    prevDefault.isDefault = false;
    await prevDefault.save();
  }
  const address = await Address.findOneAndUpdate(
    { userId, _id: addressId },
    addressBody,
    {
      new: true,
    }
  );
  if (!address) throw new ApiError(httpStatus.NOT_FOUND, "Address Not Found");
  return address;
};

const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOneAndDelete({ userId, _id: addressId });
  if (!address) throw new ApiError(httpStatus.NOT_FOUND, "Address Not Found");
  return { message: "Address Deleted Successfully!" };
};

export {
  getUsersAddress,
  getSingleAddress,
  addAddress,
  deleteAddress,
  editAddress,
};
