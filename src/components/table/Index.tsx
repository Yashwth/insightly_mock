import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Tooltip, Whisper } from 'rsuite';
import { useGetTeamMetricsMutation, useGetAuthorMetricsMutation } from '../../api/goalApi';
import { RootState } from '../../store/RootState';
import { columnConfig } from '../../constants/goalsTable';
import { Placeholder } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const formatMinutesToDaysHoursMinutes = (minutes: number) => {
  if (minutes == null || isNaN(minutes)) return '-';
  const roundedMinutes = Math.round(minutes);
  const days = Math.floor(roundedMinutes / 1440);
  const hours = Math.floor((roundedMinutes % 1440) / 60);
  const mins = Math.round(roundedMinutes % 60);

  let result = '';
  if (days > 0) result += `${days} d`;
  if (hours > 0) result += `${result ? ' ' : ''}${hours} h`;
  if (mins > 0) result += `${result ? ' ' : ''}${mins} m`;
  return result || '0 m';
};

const formatMinutesToDaysHours = (minutes: number) => {
  if (minutes == null || isNaN(minutes)) return '-';
  const roundedMinutes = Math.round(minutes);
  const days = Math.floor(roundedMinutes / 1440);
  const hours = Math.floor((roundedMinutes % 1440) / 60);

  let result = '';
  if (days > 0) result += `${days} d`;
  if (hours > 0) result += `${result ? ' ' : ''}${hours} h`;
  return result || '0 m';
};

const TeamMetrics = ({
  selectedTeamIds,
  duration,
}: {
  selectedTeamIds: number[];
  duration: { startDate: number; endDate: number };
}) => {
  const [getTeamMetrics, { data: teamData, isLoading }] = useGetTeamMetricsMutation();
  const [getAuthorMetrics, {isLoading: authorLoading }] = useGetAuthorMetricsMutation();

  const [authorDataLoading, setIsAuthorDataLoading] = useState(false);

  const [authorData, setAuthorData] = useState<any[] | null>(null);
  const [currentTeamName, setCurrentTeamName] = useState('');

  const user = useSelector((state: RootState) => state.auth.user);
  const token = user.user.authToken;
  const userId = user.user.id;
  const accessToken = user.accessToken;

  const { startDate, endDate } = duration;
  const orgId = 1960;

  const fetchTeamData = () => {
    if (!token || selectedTeamIds.length === 0) return;
    getTeamMetrics({
      token,
      userId,
      body: {
        userId,
        teamIds: selectedTeamIds,
        startDate,
        endDate,
        organizationId: orgId,
        orgId,
      },
      accessToken,
    });
  };

  useEffect(() => {
    fetchTeamData();
  }, [token, selectedTeamIds, duration]);

  const handleTeamClick = async (row: any) => {
    setIsAuthorDataLoading(true); 

    try {
      const res = await getAuthorMetrics({
        token,
        accessToken,
        userId,
        body: {
          userId,
          teamId: row.teamId,
          startDate,
          endDate,
          organizationId: orgId,
        },
      }).unwrap();
      setAuthorData(res);
      setCurrentTeamName(row.teamName);
    } catch (err) {
      console.error('Author metrics fetch error', err);
    } finally {
      setIsAuthorDataLoading(false);
    }
  };

  const handleBackToTeams = () => {
    setAuthorData(null);
    setCurrentTeamName('');
    fetchTeamData();
  };

  const tableData = authorData || (teamData?.filter((d: any) => d.teamName !== 'ALL') || []);
  const isAuthorView = Boolean(authorData);

  return (
    <div>
    
 
      {authorDataLoading ? (
        <p> loading...</p>
      ) : (
        <></>
      )}
  
      {isAuthorView && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Viewing Individual Metrics for: {currentTeamName}</strong>
          <button
            onClick={handleBackToTeams}
            style={{ marginLeft: '10px', borderRadius: '10px' }}
            className="bg-blue-500 hover:bg-blue-600 px-2 py-1 text-white"
          >
            Back
          </button>
        </div>
      )}

      <div className="rounded-xl shadow-md bg-white p-4">
        <Table
          data={tableData.map((item, idx) => ({
            ...item,
            _rowKey: `${isAuthorView ? 'a' : 't'}-${item[isAuthorView ? 'authorId' : 'teamId']}-${idx}`,
          }))}
          rowKey="_rowKey"
          height={400}
          cellBordered
          onRowClick={isAuthorView ? undefined : handleTeamClick}
          className="rounded-xl border border-gray-200 shadow-sm text-sm"
          renderEmpty={() =>
            isLoading || authorLoading || authorDataLoading ? (
              <div style={{ padding: 20, textAlign: 'center' }}><Placeholder rows={5} /></div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center' }}>No data available</div>
            )
          }
        >
          <Column width={200} align="center" fixed="left">
            <HeaderCell style={{ fontWeight: 'bold', fontSize: '16px', color: 'black' }}>
              {isAuthorView ? 'Member Name' : 'Team Name'}
            </HeaderCell>
            <Cell
              className="text-blue-500 underline cursor-pointer"
              dataKey={isAuthorView ? 'authorName' : 'teamName'}
            />
          </Column>

          {columnConfig.map(({ title, dataKey, tooltip }) => (
            <Column key={dataKey} width={160}>
              <HeaderCell style={{ fontWeight: 'bold', fontSize: '16px' }}>
                <Whisper placement="top" trigger="hover" speaker={<Tooltip>{tooltip}</Tooltip>}>
                  {title}
                </Whisper>
              </HeaderCell>
              <Cell dataKey={dataKey}>
                {(rowData) => {
                  const value = rowData[dataKey];

                  const isTimeField = ['Review Time', 'Merge Time'].includes(title);
                  if (isTimeField) {
                    return formatMinutesToDaysHoursMinutes(value);
                  }

                  const isTimeFieldMin = ['Coding Time', 'Cycle Time'].includes(title);
                  if (isTimeFieldMin) {
                    return formatMinutesToDaysHours(value);
                  }

                  const isPercentField = ['New work', 'Maintenance', 'Rework', 'PRs > 400 LOC', 'Unreviewed PRs'].includes(title);
                  if (isPercentField) {
                    return typeof value === 'number' ? `${value.toFixed(1)}%` : '-';
                  }

                  return value ?? '-';
                }}
              </Cell>
            </Column>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default TeamMetrics;
