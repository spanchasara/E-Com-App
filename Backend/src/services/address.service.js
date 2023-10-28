import httpStatus from "http-status";
import Address from "../models/address.model.js";
import ApiError from "../utils/api-error.js";

const getAddress = async () => {
  const addresses = await Address.find({});
  if (!addresses) throw new ApiError(httpStatus.NOT_FOUND, "No Address found");
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

  if(addresses.length === 0) {
    addressBody.isDefault = true;
  }

  const address = await Address.create(addressBody);
  if (!address) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error in Creating Address!"
    );
  }
  return address;
};

const editAddress = async (userId, addressId, addressBody) => {
  // have to send user id in address body
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
  return { message: "Deleted Successfully" };
};

const getUsersAddress = async (userId) => {
  const addresses = await Address.find({ userId });
  if (!addresses)
    throw new ApiError(httpStatus.NOT_FOUND, "No Address Found for the user!");

  return addresses;
};

const toggleDefaultAddress = async (userId, oldAddressId, newAddressId) => {
  const oldAddress = await Address.findOne({ userId, _id: oldAddressId });
  const newAddress = await Address.findOne({ userId, _id: newAddressId });
  if (!oldAddress || !newAddress)
    throw new ApiError(httpStatus.NOT_FOUND, "No Address Found for the user!");

    oldAddress.isDefault = false;
    newAddress.isDefault = true;
    await oldAddress.save();
    await newAddress.save();
  return {message: "Default Address Updated Successfully!!"}
};

export {
  getAddress,
  getSingleAddress,
  addAddress,
  deleteAddress,
  editAddress,
  getUsersAddress,
  toggleDefaultAddress
};
