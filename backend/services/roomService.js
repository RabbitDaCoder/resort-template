const Room = require("../models/Room");
const AppError = require("../utils/AppError");
const { uploadToCloudinary } = require("../middleware/upload");
const discountService = require("./discountService");

const roomService = {
  async getAll(query) {
    const filter = {};
    if (query.category) filter.category = query.category;
    if (query.available) filter.available = query.available === "true";

    const rooms = await Room.find(filter).sort({ createdAt: -1 });
    return discountService.enrichRooms(rooms, {
      checkIn: query.checkIn,
      checkOut: query.checkOut,
    });
  },

  async getPromos() {
    const rooms = await Room.find({ available: true }).sort({ createdAt: -1 });
    const enrichedRooms = await discountService.enrichRooms(rooms);
    return enrichedRooms.filter(
      (room) => room.discountPrice && room.discountLabel && room.available,
    );
  },

  async getBySlug(slug) {
    const room = await Room.findOne({ slug });
    if (!room) throw new AppError("Room not found", 404);
    return discountService.enrichRoom(room);
  },

  async create(data, files) {
    const images = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const result = await uploadToCloudinary(
          file.buffer,
          "discoverysamal-resort/rooms",
        );
        images.push(result.secure_url);
      }
    }

    const room = await Room.create({
      name: data.name,
      description: data.description,
      minGuests: data.minGuests || undefined,
      capacity: data.capacity || undefined,
      occupancy: data.occupancy || undefined,
      size: data.size || undefined,
      bedType: data.bedType || undefined,
      pricePerNight: data.pricePerNight,
      discountPrice: data.discountPrice || undefined,
      discountLabel: data.discountLabel || undefined,
      weekendPrice: data.weekendPrice || undefined,
      features: data.features ? JSON.parse(data.features) : [],
      note: data.note || undefined,
      images,
      category: data.category,
      maxGuests: data.maxGuests,
      available: data.available !== "false",
    });

    return room;
  },

  async update(id, data, files) {
    const updateData = {
      name: data.name,
      description: data.description,
      minGuests: data.minGuests || undefined,
      capacity: data.capacity || undefined,
      occupancy: data.occupancy || undefined,
      size: data.size || undefined,
      bedType: data.bedType || undefined,
      pricePerNight: data.pricePerNight,
      category: data.category,
      maxGuests: data.maxGuests,
      available: data.available !== "false",
    };
    if (data.weekendPrice) updateData.weekendPrice = data.weekendPrice;
    if (data.features) updateData.features = JSON.parse(data.features);
    if (data.note !== undefined) updateData.note = data.note || undefined;

    // Handle discount fields — allow admin to clear them
    const unsetFields = {};
    if (data.discountPrice) {
      updateData.discountPrice = data.discountPrice;
    } else {
      unsetFields.discountPrice = "";
    }
    if (data.discountLabel) {
      updateData.discountLabel = data.discountLabel;
    } else {
      unsetFields.discountLabel = "";
    }

    const newImages = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const result = await uploadToCloudinary(
          file.buffer,
          "discoverysamal-resort/rooms",
        );
        newImages.push(result.secure_url);
      }
    }

    const kept = data.existingImages ? JSON.parse(data.existingImages) : [];
    updateData.images = [...kept, ...newImages];

    const updateOp = { $set: updateData };
    if (Object.keys(unsetFields).length > 0) {
      updateOp.$unset = unsetFields;
    }

    const room = await Room.findByIdAndUpdate(id, updateOp, {
      new: true,
      runValidators: true,
    });
    if (!room) throw new AppError("Room not found", 404);
    return room;
  },

  async updatePrice(id, data) {
    const room = await Room.findByIdAndUpdate(
      id,
      { pricePerNight: data.pricePerNight, weekendPrice: data.weekendPrice },
      { new: true, runValidators: true },
    );
    if (!room) throw new AppError("Room not found", 404);
    return room;
  },

  async delete(id) {
    const room = await Room.findByIdAndDelete(id);
    if (!room) throw new AppError("Room not found", 404);
    return room;
  },
};

module.exports = roomService;
