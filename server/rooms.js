const rooms = {};

function createRoom(id) {
  rooms[id] = { users: new Map() };
}

function deleteRoom(id) {
  delete rooms[id];
}

module.exports = {
  rooms,
  createRoom,
  deleteRoom,
};
