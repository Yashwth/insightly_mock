import { useEffect } from 'react';
import { useGetTeamMetricsMutation } from '../../api/goalApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/RootState';

const TeamMetrics = () => {
  const [getMetrics, { data, error, isLoading }] = useGetTeamMetricsMutation();
  console.log('data',data)
    const user = useSelector((state: RootState) => state.auth.user);
    console.log("user",user);
  const token = user.user.authToken; 
  const userId = user.user.id;
    const accessToken = user.accessToken;
    console.log("accessToken",accessToken);
  useEffect(() => {
    if (!token) return;

    getMetrics({
      token,
      userId,
      body: {
        userId,
        teamIds: [6298, 6299, 6301, 6302, 6303],
        startDate: 1747180800,
        endDate: 1749686400,
        organizationId: 1960,
        orgId: 1960,
      },
      accessToken,

    });
  }, [token, getMetrics]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {JSON.stringify(error)}</p>;

  return (
    <div>
      <h2>Team Metrics</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default TeamMetrics;
