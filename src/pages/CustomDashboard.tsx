import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetMetricGraphDataMutation } from '../api/dashboardApi';
import { useSelector } from 'react-redux';
import { RootState } from '../store/RootState';
import { useGetTeamsQuery } from '../api/graphApi';
import TeamSelector from '../components/TeamSelector';
import Duration from '../components/Duration';
import { Header, Stack } from 'rsuite';

export default function CustomDashboard() {
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = user.user.authToken;
  const userId = user.user.id;
  const accessToken = user.accessToken;
  const orgId = user.user.organization?.id;

  const { data: teams, error, isFetching } = useGetTeamsQuery({ uid: userId });

  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [getMetricGraphData] = useGetMetricGraphDataMutation();
  const [graphs, setGraphs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [currTemplate, setCurrTemplate] = useState<string>('');


  const storedDuration = JSON.parse(localStorage.getItem('duration') || '{}');
  const [duration, setDuration] = useState<{
    startDate: number;
    endDate: number;
  }>({
    startDate: storedDuration.startDate || Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000),
    endDate: storedDuration.endDate || Math.floor(Date.now() / 1000),
  });

  const startDate = duration.startDate;
  const endDate = duration.endDate;

  useEffect(() => {
    const stored = localStorage.getItem('selectedTeamIds');
    if (stored) {
      setSelectedTeamIds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const templatesString = localStorage.getItem('templatesData');
    const templates = JSON.parse(templatesString || '[]');
    const currentTemplate = templates.find((t: any) => String(t.id) === String(id));
    if (currentTemplate) {
      setCurrTemplate(currentTemplate.templateName || '');
      if (currentTemplate.metricsList) {
        setMetrics(currentTemplate.metricsList);
      }
    }
  }, [id]);

  useEffect(() => {
    const fetchAllGraphs = async () => {
      const results = await Promise.allSettled(
        metrics.map(async (metric: any) => {
          try {
            const res = await getMetricGraphData({
              token,
              userId,
              graphtype: metric.metricKey,
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
            return {
              name: metric.metricName,
              metricKey: metric.metricKey,
              data: res.data,
            };
          } catch (err) {
            return {
              name: metric.metricName,
              metricKey: metric.metricKey,
              error: true,
              data: null,
            };
          }
        })
      );

      const processed = results.map((result, index) => {
        if (result.status === 'fulfilled' && result.value.data) {
          const { name, data } = result.value;
          return {
            name,
            trend: data.trend,
            changePercentage: data.changePercentage,
            value: data.value,
            seriesData: data.CockpitGraphData.map((point: any) => [
              new Date(point.date).getTime(),
              point.totalMetricCount,
            ]),
          };
        } else {
          return {
            name: metrics[index].metricName,
            trend: 'NEGATIVE',
            changePercentage: 0,
            value: 0,
            seriesData: [],
          };
        }
      });

      setGraphs(processed);
    };

    if (metrics.length && selectedTeamIds.length) {
      fetchAllGraphs();
    }
  }, [metrics, selectedTeamIds, duration]);

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error loading teams</div>;
  return (
    <div className="">
      <Header>
        <h3>{currTemplate}</h3>
      </Header>
      <hr />
      <Stack direction="row" spacing={10}>
        <TeamSelector
          data={teams}
          onConfirm={(ids) => {
            localStorage.setItem('selectedTeamIds', JSON.stringify(ids));
            setSelectedTeamIds(ids);
          }}
        />
        <Duration onChange={setDuration} />
      </Stack>
  
      <div className="flex flex-wrap gap-4 mt-6">
  {graphs.map((graph) => (
    <Link
      key={graph.name}
      to={`/dashboard/overview/${metrics.find((metric) => metric.metricName === graph.name)?.metricKey}`}
      className="w-[49%] sm:w-[100%] lg:w-[49%] xl:w-[49%] transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="flex flex-col bg-white cursor-pointer shadow-md rounded-lg p-4 h-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{graph.name}</h2>
          <div className="text-sm">
            <span
              className={`font-semibold ${
                graph.trend === 'NEGATIVE' ? 'text-red-500' : 'text-green-600'
              }`}
            >
              {graph.trend === 'NEGATIVE' ? '↓' : '↑'} {graph.changePercentage}% ({graph.value})
            </span>
          </div>
        </div>

        <hr className="my-4" />

        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: { type: 'area', height: 250 },
            title: { text: undefined },
            xAxis: { type: 'datetime' },
            yAxis: { title: { text: 'Total Metric Count' } },
            series: [
              {
                name: graph.name,
                data: graph.seriesData,
                color: graph.trend === 'NEGATIVE' ? '#EF4444' : '#10B981',
              },
            ],
            credits: { enabled: false },
            tooltip: { shared: true },
          }}
        />
      </div>
    </Link>
  ))}
</div>

    </div>
  );
  
}
