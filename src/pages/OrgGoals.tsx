import { useGetTeamsQuery } from '../api/graphApi';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootState';
import TeamMetrics from '../components/table';
import TeamSelector from '../components/TeamSelector';
const OrgGoals = () => {
    const user = useSelector((state: RootState) => state.auth.user.user);
    const { data, error, isFetching } = useGetTeamsQuery({ uid: user.id });
    console.log("uid", user.id);
    console.log("data actual", data);

    if (isFetching) return <div>Loading...</div>;
    if (error) return <div>Error loading teams</div>;

    return (
        <div>
            <TeamSelector data={data} onConfirm={(ids) => console.log(ids)} />

            <TeamMetrics />

        </div>
    );
};

export default OrgGoals;
