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
import { Header, Stack, Placeholder } from 'rsuite';
import { Tooltip, Whisper, Button } from 'rsuite';
import { METRICS_MAP } from '../constants/main';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from '@rsuite/icons';


export default function CustomDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const token = user.user.authToken;
  const userId = user.user.id;
  const accessToken = user.accessToken;
  const orgId = user.user.organization?.id;

  const { data: teams, error, isFetching } = useGetTeamsQuery({ uid: userId });

  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [getMetricGraphData, { data: metricGraphData, isLoading: isMetricGraphDataLoading }] = useGetMetricGraphDataMutation();
  const [graphs, setGraphs] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [currTemplate, setCurrTemplate] = useState<string>('');
  const [chartTypeMap, setChartTypeMap] = useState<Record<string, string>>({});
  const templates = useSelector((state: RootState) => state.cockpit.templatesData);


  const handleChartTypeChange = (metricKey: string, type: string) => {
    setChartTypeMap(prev => ({ ...prev, [metricKey]: type }));
  };
  console.log("this", chartTypeMap);


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
            seriesData: data.CockpitGraphData.map((point: any) => {
              const suffix = METRICS_MAP.find(
                (m) => m.name.toLowerCase() === name.toLowerCase()
              )?.yAxisSuffix;

              const suffixValue = METRICS_MAP.find(
                (m) => m.name.toLowerCase() === name.toLowerCase()
              )?.valueType;

              return [
                new Date(point.date).getTime(),
                suffix === 'time'
                  ? point.averageTime
                  : suffixValue === 'percentage'
                    ? point.percentage
                    : point.totalMetricCount
              ];
            }),

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
  console.log("tyesfes", graphs);

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error loading teams</div>;
  return (
    <div className="">
      <Header>
        <Stack direction="row" spacing={10}>
          <Button id="backButton" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <div className="flex flex-col">
          <h3>{templates?.find((t: any) => String(t.id) === String(id))?.templateName}</h3>
          <pre  > {templates?.find((t: any) => String(t.id) === String(id))?.templateDescription} </pre>
          </div>
        </Stack>
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
          <div className="w-[49%] sm:w-[100%] lg:w-[49%] xl:w-[49%] transition-all duration-300 hover:scale-[1.02]">



            <div className="flex flex-col justify-between bg-white cursor-pointer shadow-md rounded-lg p-4 h-full">
              {isMetricGraphDataLoading ? <Placeholder /> : <div className="flex items-center justify-between">
                <div className="flex flex-row items-center align-center">
                  <Whisper followCursor speaker={<Tooltip>{METRICS_MAP.find((metric) => metric.name.toLowerCase() === graph.name.toLowerCase())?.toolTip}</Tooltip>}>
                    <h3 className="text-base font-bold pr-4">{graph.name}</h3>
                  </Whisper>
                </div>

                <div className="flex justify-end mb-2">
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={chartTypeMap[graph.name] || 'area'}
                    onChange={(e) => handleChartTypeChange(graph.name, e.target.value)}
                  >
                    {/* line, spline, area, areaspline, column, bar, pie, scatter, gauge, arearange, areasplinerange and columnrange */}
                    <option value="area">Area Chart</option>
                    <option value="column">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="spline">Spline Chart</option>

                  </select>
                </div>



                <div className="text-sm">
                  <span
                    className={`font-semibold ${graph.trend === 'NEGATIVE' ? 'text-red-500' : 'text-green-600'
                      }`}
                  >

                    {graph.trend === 'NEGATIVE' ? '↓' : '↑'}
                    {graph.changePercentage}% ({graph.value})
                  </span>
                </div>
              </div>}

              <hr className="my-4" />
              <Link
                key={graph.name}
                to={`/dashboard/overview/${metrics.find((metric) => metric.metricName === graph.name)?.metricKey}`}
              >
                {isMetricGraphDataLoading ? <Placeholder rows={6} rowHeight={22.1} /> : <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: { type: chartTypeMap[graph.name] || 'area', height: 250 },
                    title: { text: undefined },
                    xAxis: { type: 'datetime' },
                    yAxis: {
                      title: {
                        text: METRICS_MAP.find(
                          (metric) => metric.name.toLowerCase() === graph.name.toLowerCase()
                        )?.yAxisSuffix,
                      },
                      labels: {
                        formatter: function () {
                          const value = this.value;
                          const suffix = METRICS_MAP.find(
                            (metric) => metric.name.toLowerCase() === graph.name.toLowerCase()
                          )?.yAxisSuffix;

                          if (suffix === 'time') {
                            if (value >= 1440) {
                              const days = Math.floor(value / 1440);
                              const hours = Math.round((value % 1440) / 60);
                              return `${days}d ${hours}h`;
                            } else if (value >= 60) {
                              const hours = Math.floor(value / 60);
                              const minutes = Math.round(value % 60);
                              return `${hours}h ${minutes}m`;
                            } else {
                              return `${Math.round(value)}m`;
                            }
                          }

                          return value;
                        },
                      },
                    },
                    credits: { enabled: false },
                    tooltip: {
                      shared: true,
                      formatter: function () {
                        const suffix = METRICS_MAP.find(
                          (metric) => metric.name.toLowerCase() === graph.name.toLowerCase()
                        )?.yAxisSuffix;
                        const suffixValue = METRICS_MAP.find(
                          (metric) => metric.name.toLowerCase() === graph.name.toLowerCase()
                        )?.valueType;


                        const val = this.points?.[0]?.y;

                        if (suffix === 'time') {
                          if (val >= 1440) {
                            const days = Math.floor(val / 1440);
                            const hours = Math.round((val % 1440) / 60);
                            return `${days}d ${hours}h`;
                          } else if (val >= 60) {
                            const hours = Math.floor(val / 60);
                            const minutes = Math.round(val % 60);
                            return `${hours}h ${minutes}m`;
                          } else {
                            return `${Math.round(val)}m`;
                          }
                        }

                        if (suffixValue === 'percentage') {
                          return `${val}%`;
                        }

                        return `${val}`;
                      },
                    },

                    legend: { enabled: false },
                    series: [
                      {
                        data: graph.seriesData,
                        color: graph.trend === 'NEGATIVE' ? '#EF4444' : '#10B981',
                        enableMouseTracking: true,
                      },
                    ],
                  }}
                />


                }
              </Link>

            </div>
          </div>
        ))}
      </div>

    </div>
  );

}
