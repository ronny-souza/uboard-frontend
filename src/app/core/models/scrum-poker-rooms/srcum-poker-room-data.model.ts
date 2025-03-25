export interface ScrumPokerRoomData {
  uuid: string;
  name: string;
  createdAt: Date;
  closed: boolean;
  closedAt?: Date;
  userIdentifier: string;
  isVotesVisible: boolean;
}
