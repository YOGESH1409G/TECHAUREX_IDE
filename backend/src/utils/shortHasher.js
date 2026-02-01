import shortHash from 'shorthash2';
import Room from '../models/room.model.js';

export async function shortHasher(roomId) {
  let code;
  let exists = true;

  while (exists) {
    code = shortHash(String(roomId))
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ''); // a-z0-9 only

    if (code.length < 7) code = code.padEnd(7, '0');
    else code = code.substring(0, 7);

    exists = await Room.isRoomCodeExist(code);

    if (exists) roomId = roomId + Math.random(); // avoid collision
  }

  return code;
}