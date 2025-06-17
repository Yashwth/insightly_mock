import { User } from './User'


type InviteStatus = 'ACTIVE' | null;
type AccessRole = 'ADMINISTRATOR' | null;
type LoginProvider = 'google' | null;
type ScmProvider = 'gitlabcloud' | null;

export type MergedAuthor = {
  id: number | null;
  name: string | null;
  userName: string | null;
  email: string | null;
  teamNames: string | null;
  labels: string[] | null;
  inviteStatus: InviteStatus;
  invitationToken: string | null;
  generated: boolean | null;
  lastActivityDate: string | null;  
  scmProvider: ScmProvider;
  accessRole: AccessRole;
  loginProvider: LoginProvider;
}

export type TeamAuthor = {
  id: number;
  name: string;
  userName: string;
  userId: number;
  email: string;
  teamNames: string;
  labels: string[] | null;
  inviteStatus: InviteStatus;
  invitationToken: string | null;
  generated: boolean;
  lastActivityDate: string;
  scmProvider: ScmProvider;
  accessRole: AccessRole;
  loginProvider: LoginProvider;
  providers: string[];
  mergedAuthors: MergedAuthor[];
}

export type Team = {
  id: number
  name: string
  teamType: string
  teamCount: number
  userId: number
  parentTeamId?: number | null
  check?: boolean
  authorIds?: number[] | undefined
  ownerId?: number
  teamOwnerName?: string
}

export type TeamTree = {
  actualTeamId: null
  authorIds: null
  id: number;
  name: string;
  organizationId: null
  ownerId: null
  parentTeamId: null
  slug: null
  subTeams: TeamTree[]
  teamAuthorRelation: null
  teamCount: null
  teamOwnerEmail: null
  teamOwnerName: null
  teamOwnerUserName: null
  teamType: null
  userId: null
  uuId: null
  parentId?: number
}

type CloseModalMetadata = {
  teamId: number
  teamCount: number
}

export type AddToTeamModalType = {
  open: boolean
  openCreateTeam: () => void
  closeModal: (open: boolean, metadata?: CloseModalMetadata) => void
  onSuccess?: (team:any) => void;
}
export type CreateTeamModalType = {
  open: boolean
  isEditing: boolean
  authorIds: number[]
  addToTeamOpen: boolean
  createSuccess: (team: Team) => void
  closeModal: (open: boolean) => void
  usersList: any
  setPage: (page: number) => void
  setShowBackButton: (showBackButton: boolean) => void
  setTeams: (teams: Team[]) => void
  setTeamsTree: React.Dispatch<React.SetStateAction<any>>,
  user: User,
  setIsEditingTeam: (isEditing: boolean) => void
  teams: any
}

export type DeleteTeamUsersModalType = {
  open: boolean
  subTeams: Team[];
  cancel: () => void
  confirm: () => void
  isDeleteUsersInProgress: boolean;
}

export type DeleteTeamModalType = {
  open: boolean
  cancel: () => void
  confirm: () => void
}
export type ArchiveUsersModalType = {
  open: boolean
  authorIds: number[]
  setIsUserArchived: (archiveStatus: boolean) => void,
  closeModal: (open: boolean) => void
}