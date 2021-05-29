class Room {
  constructor(name, video = "https://www.youtube.com/watch?v=9Auq9mYxFEE") {
    this.name = name;
    this.video = video;
    this.users = new Map();
  }
}

const rooms = {
  default1: new Room(
    "Default-1: NBC News Live",
    "https://www.youtube.com/watch?v=Xh2DSMH2Z10"
  ),
  default2: new Room("Default-2: Sky News Live"),
  default3: new Room("Default-3: Sky News Live"),
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
