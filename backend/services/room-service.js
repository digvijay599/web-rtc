const RoomModel = require("../models/room-model");

class RoomService {
    //Create new room
    async create(payload) {
        const { topic, roomType, ownerId } = payload;
        const room = await RoomModel.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId],
        });
        return room;
    }

    //Get All rooms
    async getAllRooms(types) {
        const rooms = await RoomModel.find({ roomType: { $in: types } })
            .populate("speakers")
            .populate("ownerId")
            .exec();
        return rooms;
    }

    async getRoom(roomId) {
        const room = await RoomModel.findOne({ _id: roomId });
        return room;
    }
}
module.exports = new RoomService();
