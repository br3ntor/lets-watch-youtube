// Replace this primitive, yet it works, structure with a room class
const rooms = {
  default1: {
    users: new Map(),
    video: "https://www.youtube.com/watch?v=1JYjcwW9MmM",
  },
  default2: {
    users: new Map(),
    video: "https://youtu.be/--UABwqW9Sg",
  },
};

function createRoom(id) {
  rooms[id] = {
    users: new Map(),
    video:
      "https://www.youtube.com/watch?v=EHqsCmfTDmI&list=PLPnjato8iGXLQbppBPhOny8XLSRl7S5pM",
  };
}

function deleteRoom(id) {
  delete rooms[id];
}

module.exports = {
  rooms,
  createRoom,
  deleteRoom,
};
