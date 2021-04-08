class Room {
  constructor(name, video = "https://www.youtube.com/watch?v=FK5MdhdYdJw") {
    this.name = name;
    this.video = video;
    this.users = new Map();
  }
}

const rooms = {
  default1: new Room("A Test Room", "https://youtu.be/E8mGWYRcmec"),
  default2: new Room("Another Test Room"),
  default3: new Room("One More Test Room"),
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
