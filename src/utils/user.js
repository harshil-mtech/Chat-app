const users = [];

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) return { error: "Username and room are required!" };

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) return { error: "Username is already taken!" };

  // Good to go
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  // Check for existing user's index
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  // Remove if user exits
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  // Check for existing user's index
  const index = users.findIndex((user) => user.id === id);

  // Returning user object if exists
  if (index !== -1) return users[index];

  // Returning undefined if not exists
  return undefined;
};

const getUsersInRoom = (room) => {
  // filtering the users array for specific room
  const usersInRoom = users.filter((user) => user.room === room);

  return usersInRoom;
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
