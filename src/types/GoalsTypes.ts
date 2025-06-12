import { Team } from "./Team"
import { User } from "./User"

export type GoalMetricsType = {
  cycleTime: number
  reviewTime: number
  mergeTime: number
  codingTime: number
  deploymentFrequency: number
  hotfixprs?: number
  changeFailureRate: number
  prReviewedPercentage: number
  prReviewedCount: number
  reworkPercentage: number
  maintenancePercentage: number
  prGreaterThan400LocPercentage: number
  prGreaterThan400LocCount: number
  prMergedWithoutReviewPercentage: number
  prMergedWithoutReviewCount: number
  prMergedPercentage: number
  prMergedCount: number
  commitsCount: number
  commitsPerDay: number
  newWorkPercentage: number
  prOpenPercentage: number
  propenCount: number
  flashyReviewsPercentage: number
  flashyReviewsCount: number,
  scope: string,
  entityId:  number

}

export type GoalsType = {
  user?: User,
  teams?: Team[],
  selectedTeam: Team | null,
  setSelectedTeam: React.Dispatch<React.SetStateAction<any>>
  selectedGoalEntity: string
  metricesCurrentValues: GoalMetricsType
  setMetricesCurrentValues: React.Dispatch<React.SetStateAction<any>>
  setSelectedGoalEntity?: React.Dispatch<React.SetStateAction<string>>
  setRedirectToTrackPerformance?: React.Dispatch<React.SetStateAction<boolean>>
  reworkDuration?: number
  flashyReviewDefinition?: string
}
