class Room {
  constructor(name, video) {
    this.name = name;
    this.video = video;
    this.users = new Map();
  }
}

// Not sure if its best to have rooms as id props on object?
// Or if id should be in room and store collection of rooms in array?
// Possibly a Map would be best?
const rooms = {
  default1: new Room(
    "Default room",
    "https://www.youtube.com/watch?v=OvqJGBopcwc"
  ),
};

function createRoom({ id, name, video }) {
  rooms[id] = new Room(name, video);
}

function deleteRoom(id) {
  delete rooms[id];
}

module.exports = {
  rooms,
  createRoom,
  deleteRoom,
};
