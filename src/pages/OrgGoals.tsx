import { useGetTeamsQuery } from '../api/graphApi';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootState';
import TeamMetrics from '../components/table';
import TeamSelector from '../components/TeamSelector';
import { useEffect, useState } from 'react';

const OrgGoals = () => {
  const user = useSelector((state: RootState) => state.auth.user.user);
  const { data, error, isFetching } = useGetTeamsQuery({ uid: user.id });

  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);

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
    <div>
      <TeamSelector data={data} onConfirm={setSelectedTeamIds} />
      <TeamMetrics selectedTeamIds={selectedTeamIds} />
    </div>
  );
};

export default OrgGoals;
