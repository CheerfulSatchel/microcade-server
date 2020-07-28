import generate from "adjective-adjective-animal";

export interface Room {
  created: Date;
  name: string;
  users: string[];
  chatHistory: [];
}

export class RoomManager {
  private rooms: Record<string, Room> = {};

  private createRoom(roomId: string) {
    const newRoom: Room = {
      created: new Date(),
      name: roomId,
      users: [],
      chatHistory: [],
    };

    this.rooms[roomId] = newRoom;
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
      if (this.getRoom(roomId).users.indexOf(playerIdToRemove) > -1) {
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
    if (!(this.rooms[roomId].users.indexOf(userId) > -1)) {
      this.rooms[roomId].users.push(userId);
    }
  }

  public removeRoomIfEmpty(roomId: string) {
    if (this.rooms[roomId].users.length === 0) {
      delete this.rooms[roomId];
    }
  }
}
