import { useGetTeamsQuery } from '../api/graphApi';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootState';
import TeamMetrics from '../components/table';
import TeamSelector from '../components/TeamSelector';
import { useEffect, useState } from 'react';
import { Header } from 'rsuite';
import Duration from '../components/Duration';
import { useMediaQuery, Stack, Button } from 'rsuite';

const OrgGoals = () => {
  const [isMobile] = useMediaQuery('(max-width: 700px)');

  const user = useSelector((state: RootState) => state.auth.user.user);
  const { data, error, isFetching } = useGetTeamsQuery({ uid: user.id });

  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [duration, setDuration] = useState<{ startDate: number, endDate: number }>(() => {
    const stored = localStorage.getItem('duration');
    return stored ? JSON.parse(stored) : { startDate: 0, endDate: 0 };
  });


  // On first load, sync with localStorage
  useEffect(() => {
    const stored = localStorage.getItem('selectedTeamIds');
    if (stored) {
      setSelectedTeamIds(JSON.parse(stored));
    }

  }, []);


  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error loading teams</div>;

  return (
    <>
    <Header>
        <h3>Org Goals</h3>
    </Header>
    <hr />
    <Stack direction={isMobile ? 'column' : 'row' } spacing={isMobile ? 0 : 10}>
      <TeamSelector data={data} onConfirm={setSelectedTeamIds} />
      <Duration onChange={setDuration} />
    </Stack>
    <br />
    <TeamMetrics selectedTeamIds={selectedTeamIds} duration={duration} />
    </>
  );
};

export default OrgGoals;
