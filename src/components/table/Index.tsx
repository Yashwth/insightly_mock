import { useEffect } from 'react';
import { useGetTeamMetricsMutation } from '../../api/goalApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootState';
import {    Row, Table , Tooltip, Whisper} from 'rsuite';
import { columnConfig } from '../../constants/goalsTable';

const { Column, HeaderCell, Cell } = Table;

const TeamMetrics = ({selectedTeamIds}: {selectedTeamIds: number[]}) => {
    const [getMetrics, { data, error, isLoading }] = useGetTeamMetricsMutation();
    console.log('data', data)
    const filteredData= data?.filter((item:any)=> item.teamName !== 'ALL')

    const user = useSelector((state: RootState) => state.auth.user);
    const token = user.user.authToken;
    const userId = user.user.id;
    const accessToken = user.accessToken;
    
    useEffect(() => {
        if (!token || selectedTeamIds.length === 0) return;
      
        getMetrics({
          token,
          userId,
          body: {
            userId,
            teamIds: selectedTeamIds,
            startDate: 1747180800,
            endDate: 1749686400,
            organizationId: 1960,
            orgId: 1960,
          },
          accessToken,
        });
      }, [token, getMetrics, selectedTeamIds]);
      
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {JSON.stringify(error)}</p>;

    return (
        <div>
            {/* <h2>Team Metrics</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre> */}
            <Table
            data={filteredData}
            height={400}
            cellBordered
            rowKey="teamId"
            onRowClick={(row) => console.log(row)}>
                <Column width={200} align='center' fixed="left">
                    <HeaderCell>Team Name</HeaderCell>
                    <Cell dataKey="teamName" />
                </Column>   
                {columnConfig.map(({title,dataKey,tooltip})=>(
                    <Column key ={dataKey} width={160}>
                        <HeaderCell>
                            <Whisper placement="top" trigger="hover" speaker={<Tooltip>{tooltip}</Tooltip>}>
                                {title}
                            </Whisper>
                        </HeaderCell>
                        <Cell dataKey={dataKey} >
                            {(rowData)=>{
                                const value = rowData[dataKey];
                                return value;
                            }}
                        </Cell>
                    </Column>
                ))}
            </Table>


        </div>
    );
};

export default TeamMetrics;
