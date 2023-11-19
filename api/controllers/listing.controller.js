import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  try {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (req.user.id !== listing.userRef.toString())
      return next(errorHandler(401, "You can only delete your own listing"));

    await Listing.findByIdAndDelete(listingId);
    res.status(200).json("listing deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"));

    if (req.user.id !== listing.userRef.toString())
      return next(errorHandler(401, "you can only update your own listing"));

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};
