import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Tooltip, Whisper } from 'rsuite';
import { useGetTeamMetricsMutation, useGetAuthorMetricsMutation } from '../../api/goalApi';
import { RootState } from '../../store/RootState';
import { columnConfig } from '../../constants/goalsTable';

const { Column, HeaderCell, Cell } = Table;

const TeamMetrics = ({ selectedTeamIds,duration }: { selectedTeamIds: number[], duration: { startDate: number, endDate: number } }) => {
  const [getTeamMetrics, { data: teamData, isLoading, error }] = useGetTeamMetricsMutation();
  const [getAuthorMetrics] = useGetAuthorMetricsMutation();

  const [authorData, setAuthorData] = useState<any[] | null>(null);
  const [currentTeamName, setCurrentTeamName] = useState('');
  const [currentTeamId, setCurrentTeamId] = useState<number | null>(null);

  
  const user = useSelector((state: RootState) => state.auth.user);
  const token = user.user.authToken;
  const userId = user.user.id;
  const accessToken = user.accessToken;

  const startDate = duration.startDate;
  const endDate = duration.endDate;
   
  const orgId = 1960;

  useEffect(() => {
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
  }, [token, getTeamMetrics, selectedTeamIds,duration]);

  const handleTeamClick = async (row: any) => {
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
      setCurrentTeamId(row.teamId);
    } catch (err) {
      console.error('Author metrics fetch error', err);
    }
  };

  const tableData = authorData || (teamData?.filter((d: any) => d.teamName !== 'ALL') || []);
  const isAuthorView = Boolean(authorData);

  return (
    <div>
        {}
      {isAuthorView && (
        <div style={{ marginBottom: '10px' }}>
          <strong>Viewing Individual Metrics for: {currentTeamName}</strong>
          <button onClick={() => setAuthorData(null)} style={{ marginLeft: '10px', borderRadius: '10px' }} className="bg-blue-500 hover:bg-blue-600 px-2 py-1">Back</button>
        </div>
      )}
      <Table
        data={tableData}
        height={400}
        cellBordered
        rowKey={isAuthorView ? "authorId" : "teamId"}
        onRowClick={isAuthorView ? undefined : handleTeamClick}
        renderEmpty={() =>
            isLoading ? (
              <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>
            ) : (
              <div style={{ padding: 20, textAlign: 'center' }}>No data available</div>
            )
          }
      >
        <Column width={200} align="center" fixed="left">
          <HeaderCell style={{ fontWeight: 'bold' }} >{isAuthorView ? 'Member Name' : 'Team Name'}</HeaderCell>
          <Cell className='text-blue-500 underline cursor-pointer' dataKey={isAuthorView ? 'authorName' : 'teamName'} />
        </Column>

        {columnConfig.map(({ title, dataKey, tooltip }) => (
          <Column key={dataKey} width={160}>
            <HeaderCell style={{ fontWeight: 'bold' }}>
              <Whisper placement="top" trigger="hover" speaker={<Tooltip>{tooltip}</Tooltip>}>
                {title}
              </Whisper>
            </HeaderCell>
            <Cell dataKey={dataKey}>
              {(rowData) => rowData[dataKey]}
            </Cell>
          </Column>
        ))}
      </Table>
    </div>
  );
};

export default TeamMetrics;
