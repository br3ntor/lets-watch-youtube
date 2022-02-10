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
    "Default Room 1",
    "https://www.youtube.com/watch?v=pKKIxeMIv78"
  ),
  default2: new Room(
    "Default Room 2",
    "https://www.youtube.com/watch?v=ZFzjsaU7a2s"
  ),
  default3: new Room(
    "Default Room 3",
    "https://www.youtube.com/watch?v=vQ87ccYl0fY"
  ),
  default4: new Room(
    "Default Room 4",
    "https://www.youtube.com/watch?v=5qap5aO4i9A"
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
