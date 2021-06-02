class Room {
  constructor(name, video) {
    this.name = name;
    this.video = video;
    this.users = new Map();
  }
}

const rooms = {
  default1: new Room(
    "Default room",
    "https://www.youtube.com/watch?v=OvqJGBopcwc"
  ),
  // default2: new Room("Default-2: Sky News Live"),
  // default3: new Room("Default-3: Sky News Live"),
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
