
declare module '*/index.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getUserDetails: DocumentNode;
export const createSavestate: DocumentNode;
export const restoreSavestate: DocumentNode;
export const deleteSavestate: DocumentNode;
export const getSavestates: DocumentNode;
export const getGames: DocumentNode;
export const createTournament: DocumentNode;
export const getTournaments: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/authFlow.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const addParticipant: DocumentNode;
export const checkinParticipant: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/additionalInformationForm.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getLanguages: DocumentNode;
export const getRegions: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/issueTracker.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const setAssignee: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/participantManager.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const updateGameUserElo: DocumentNode;
export const updateSeed: DocumentNode;
export const updateParticipantRoles: DocumentNode;
export const kickParticipant: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/checkIn.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const CreateReadyCheck: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/compare.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const changeStatus: DocumentNode;
export const createSystemTicket: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/createLobby.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const addLobbyCode: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/joinLobby.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const addToInGame: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/scores.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const createSubmissions: DocumentNode;
export const setMatchGameStatus: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/ticketCreateModal.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getPlayersFromTournament: DocumentNode;
export const createTicket: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/resolveModal.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const resetMatch: DocumentNode;
export const setMatchWinner: DocumentNode;
export const resolvePlayerReport: DocumentNode;
export const setMatchResults: DocumentNode;
export const closeTicket: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/authInfo.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const AuthInfo: DocumentNode;
export const getUserInfo: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/bracketGenHook.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const BracketGenInfo: DocumentNode;
export const generateBrackets: DocumentNode;
export const publishBrackets: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/chat.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const relatedChatRooms: DocumentNode;
export const chatRoomMessages: DocumentNode;
export const createMessage: DocumentNode;
export const chatRoomChanged: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/matchInfo.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const matchInfo: DocumentNode;
export const matchChanged: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/tickets.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const RelatedTickets: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/brackets.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const BracketInfo: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/hub.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const HubInfo: DocumentNode;
export const TournamentParticipants: DocumentNode;
export const TournamentTickets: DocumentNode;
export const setRoundStatus: DocumentNode;
export const setStartTime: DocumentNode;
export const setCheckIn: DocumentNode;
export const updateTournament: DocumentNode;
export const deleteTournament: DocumentNode;
export const TournamentChanged: DocumentNode;
export const setTournamentStatus: DocumentNode;
export const TournamentTicketChanged: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/tournament.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const TournamentInfo: DocumentNode;
export const TournamentStagesInfo: DocumentNode;
export const userParticipants: DocumentNode;
export const removeParticipant: DocumentNode;

  export default defaultDocument;
}
    