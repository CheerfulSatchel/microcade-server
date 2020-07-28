import socket from "socket.io";
import generate from "adjective-adjective-animal";
import { Events } from "../Constants";

export interface Room {
  created: Date;
  name: string;
  users: string[];
  chatHistory: string[];
  sockets: socket.Socket[];
  activeGamePlayers: socket.Socket[];
  gameInProgress: boolean;
}

export interface RoomDTO {
  created: Date;
  name: string;
  users: string[];
  chatHistory: string[];
}
export class RoomManager {
  private rooms: Record<string, Room> = {};

  private createRoom(roomId: string) {
    const newRoom: Room = {
      created: new Date(),
      name: roomId,
      users: [],
      chatHistory: [],
      sockets: [],
      activeGamePlayers: [],
      gameInProgress: false,
    };

    this.rooms[roomId] = newRoom;

    return newRoom;
  }

  public addSocketToRoom(roomId: string, newSocket: socket.Socket) {
    if (this.rooms[roomId]) {
      this.rooms[roomId].sockets.push(newSocket);
      newSocket.join(roomId);
      newSocket.to(roomId).emit(Events.MESSAGE, "Someone joined the room");
    }
  }

  public async createNewRoom(): Promise<string> {
    let roomId = await generate("pascal");
    // Highly unlikely. Go buy a lottery ticket if you manage to use a previously generated room name.
    while (this.rooms[roomId]) {
      roomId = await generate("pascal");
    }

    this.createRoom(roomId);

    return roomId;
  }

  public getAllRooms() {
    return this.rooms;
  }

  public removePlayerFromRoom(roomId: string, playerIdToRemove: string) {
    if (this.getRoom(roomId)) {
      if (this.getRoom(roomId).users.includes(playerIdToRemove)) {
        delete this.getRoom(roomId).users[playerIdToRemove];
      }
    }
  }

  public deleteRoom(roomId: string) {
    if (this.getRoom(roomId)) {
      delete this.getRoom[roomId];
    }
  }

  public getRoom(roomId: string): Room {
    return this.rooms[roomId];
  }

  public addUserToRoom(roomId: string, userId: string) {
    if (!this.rooms[roomId].users.includes(userId)) {
      this.rooms[roomId].users.push(userId);
    }
  }

  public removeRoomIfEmpty(roomId: string) {
    if (this.rooms[roomId].users.length === 0) {
      delete this.rooms[roomId];
    }
  }

  public markPlayerFinished(roomId: string, socketId: string) {
    const room = this.rooms[roomId];

    if (!room) {
      return false;
    }

    const matchingSocketIndex = room.activeGamePlayers.findIndex((activePlayer) => activePlayer.id === socketId);

    if (matchingSocketIndex < 0) {
      return false;
    }

    const [removedSocket] = room.activeGamePlayers.splice(matchingSocketIndex, 1);
    removedSocket.emit(Events.LOSER);

    if (room.activeGamePlayers.length === 1) {
      const lastSocket = room.activeGamePlayers.pop();
      lastSocket.emit(Events.WINNER);
    }

    return true;
  }

  public startGameForRoom(roomId: string) {
    if (!this.rooms[roomId]) {
      return false;
    }

    const room = this.rooms[roomId];

    room.gameInProgress = true;
    room.sockets.forEach((socket) => socket.emit(Events.START_GAME));
    room.activeGamePlayers = [...room.sockets];

    return true;
  }
}
