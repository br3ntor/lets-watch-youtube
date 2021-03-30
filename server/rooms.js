const rooms = {};

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
