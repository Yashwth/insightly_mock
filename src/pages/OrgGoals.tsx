import { useGetTeamsQuery } from '../api/graphApi';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootState';

const OrgGoals = () => {
const user = useSelector((state: RootState) => state.auth.user.user);
  const { data, error, isFetching } = useGetTeamsQuery({ uid: user.id });
 console.log("uid",user.id);
 console.log("data",data);

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error loading teams</div>;

  return (
    <ul>
      {data?.map((team:any) => (
        <li key={team.id}>{team.name}</li>
      ))}
    </ul>
  );
};

export default OrgGoals;
