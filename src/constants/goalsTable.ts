
export const reworkDuration = 30; 

export const columnConfig = [
  {
    title: 'Coding Time',
    dataKey: 'codingTimeAvg',
    tooltip: 'Time from first commit to PR open, excludes draft PRs.'
  },
  {
    title: 'Review Time',
    dataKey: 'reviewTimeAvg',
    tooltip: 'Time from PR Opened to Final Review.'
  },
  {
    title: 'Merge Time',
    dataKey: 'deployTimeAvg',
    tooltip: 'Time from Final Review to PR merged.'
  },
  {
    title: 'Cycle Time',
    dataKey: 'cycleTimeAvg',
    tooltip: 'Time from first commit to PR merge.'
  },
  {
    title: 'New work',
    dataKey: 'newWorkPer',
    tooltip: 'New lines of code added, including to existing files'
  },
  {
    title: 'Rework',
    dataKey: 'reWorkPer',
    tooltip: `Code modified that was written within last ${reworkDuration} days.`
  },
  {
    title: 'Maintenance',
    dataKey: 'maintenanceWorkPer',
    tooltip: `Code modified that was written prior to ${reworkDuration} days.`
  },
  {
    title: 'Unreviewed PRs',
    dataKey: 'mergedWithoutReviewPrCount',
    tooltip: 'PRs opened by this author and merged without review.'
  },
  {
    title: 'PRs > 400 LOC',
    dataKey: 'largeSizePrCount',
    tooltip: 'PRs with more than 400 lines (added + removed).'
  },
  {
    title: 'Deployment count',
    dataKey: 'totalDeploymentFrequency',
    tooltip: 'Number of Deployments'
  },
  {
    title: 'Issues Count',
    dataKey: 'closedIssuesCount',
    tooltip: 'No. of Work Items closed'
  },
  {
    title: 'Story Points',
    dataKey: 'completedStoryPoints',
    tooltip: 'No. of Story points completed'
  },
  {
    title: 'Commits',
    dataKey: 'commitCount',
    tooltip: 'Number of Code changes made to the repo'
  },
  {
    title: 'Active Days',
    dataKey: 'activeDays',
    tooltip: 'Days with Git actions like commits or PRs'
  }
];
