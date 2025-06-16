import { JwtPayload } from "jwt-decode";

export type Organization = {
  id: number
  orgName: string
  userId: number
  showInsights: boolean
  showCtoDashboard: boolean
  showJiraSetting: boolean
  isJiraConnected: boolean
  jiraSyncStatus: 'STARTED' | 'COMPLETED' | 'PARTIAL_DATA_AVAILABLE'
  sonarSyncStatus: 'SYNC_IN_PROGRESS' | 'SYNC_FINISHED' | 'NOT_INTEGRATED'
  showSonarSettings: boolean
  isSonarConnected: boolean
  showFreeTrialExtension: boolean
  size: string
  subscriptionEndDate: string
  subscriptionStatus: 'ACTIVE' | 'INACTIVE'
  userRole: string
  mfaEnabled: boolean
  showProject: boolean
  slackConnected: boolean
  showGoalSettings: boolean
  genAIEnabled: boolean
  processMgmtProvider: string | null
  azuregitConnected : boolean
  teamVersionEnabled : boolean
  sprintCyclesConfigured: boolean
  fullName?: string
  referralSource?: string
  createdDate: string
  trialEndDate: string
  trialStartDate: string
  isPremiumOrg: boolean
  rbacEnabled?: string
  jenkinsSyncStatus?: string
}

export type User = {
  id: number
  accountId: number | null
  scmProvider: string | null
  userName: string | null
  email: string | null
  orgAdmin: boolean
  organization: Organization
  authToken: string
  existingUser: boolean
  defaultTeam: boolean
  personalAccessToken: boolean
  mfaStatus: string | null
  qrData: string | null
  accessRole: string
  isOrgAdmin: boolean
  showCtoDashboard: boolean
  showJiraSetting: boolean
  cockpitPrewrence: string[] | null
  showInvite: boolean
  showConfiguration: boolean
  userPreferenceCaptured: boolean
  scmReauthorize: boolean
  integratedApps: string[]
  accessToken: string
  refreshToken: string
  landingPagePreference: string | null
  displayName: string | null
  prColumnOrder?: string[] | null;
  prColumnVisibility?: string | null;
  favouriteDashboards: string | null;
}


export type CustomJwtPayload = JwtPayload & {
  role: string;
  permissions: string[];
}
export type InviteUserModalType = {
  open: boolean
  invitationLink: string
  inviteEmailSent: boolean
  copyClicked: (open: boolean) => void
  cancelClicked: () => void
}

export type MergeUsersModalType = {
  open: boolean
  userList: Array<any>
  selectedUserIds: number[]
  mergeClicked: () => void
  closeModal: (open: boolean) => void
}
export type UpdateUserModalType = {
  user: any
  cancel: () => void
  confirm: (user: any, email: string, updateType: string) => void,
  loggedinUser: User | null
}
