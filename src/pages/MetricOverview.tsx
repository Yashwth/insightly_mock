import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/RootState";
import {
    useGetOverviewMetricSummaryMutation,
    useGetOverviewMetricGraphDataMutation,
} from "../api/dashboardApi";
import { useEffect, useState } from "react";
import TeamSelector from "../components/TeamSelector";
import Duration from "../components/Duration";
import { Header, Stack, Dropdown } from "rsuite";
import { useGetTeamsQuery } from '../api/graphApi';
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

export default function MetricOverview() {
    const { graphName } = useParams();

    const storedDuration = JSON.parse(localStorage.getItem('duration') || '{}');

    const [timeFilter, setTimeFilter] = useState<string>('weekly');
    const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
    const [duration, setDuration] = useState<{
        startDate: number;
        endDate: number;
    }>({
        startDate: storedDuration.startDate || Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000),
        endDate: storedDuration.endDate || Math.floor(Date.now() / 1000),
    });

    const user = useSelector((state: RootState) => state.auth.user);
    const token = user?.user?.authToken || "";
    const userId = user?.user?.id || "";
    const accessToken = user?.accessToken || "";
    const orgId = user?.user?.organization?.id || "";

    const { data: teams } = useGetTeamsQuery({ uid: userId });

    const [getOverviewMetricSummary, { data: summaryData }] = useGetOverviewMetricSummaryMutation();
    const [getOverviewMetricGraphData, { data: graphData }] = useGetOverviewMetricGraphDataMutation();

    useEffect(() => {
        const storedTeams = localStorage.getItem("selectedTeamIds");
        const storedDuration = localStorage.getItem("duration");

        if (storedTeams) setSelectedTeamIds(JSON.parse(storedTeams));
        if (storedDuration) setDuration(JSON.parse(storedDuration));
    }, []);

    useEffect(() => {
        if (
            !graphName ||
            !duration?.startDate ||
            !duration?.endDate ||
            !orgId ||
            !token ||
            !userId ||
            !accessToken ||
            selectedTeamIds.length === 0
        )
            return;

        const payload = {
            body: {
                teamIds: selectedTeamIds,
                startDate: duration.startDate,
                endDate: duration.endDate,
                organizationId: orgId,
                metricType: graphName,
                groupBy: timeFilter,
            },
            token,
            userId,
            accessToken,
        };

        getOverviewMetricSummary(payload);
        getOverviewMetricGraphData(payload);
    }, [
        graphName,
        duration,
        orgId,
        token,
        userId,
        accessToken,
        selectedTeamIds,
        timeFilter,
        getOverviewMetricSummary,
        getOverviewMetricGraphData,
    ]);

    const chartOptions = () => {
        if (!graphData?.graphData) return null;

        const categories = Object.keys(graphData.graphData).sort();
        const teamMap = new Map();

        categories.forEach((week) => {
            graphData.graphData[week].forEach(({ teamName, totalMetricValue }) => {
                if (!teamMap.has(teamName)) {
                    teamMap.set(teamName, []);
                }
                teamMap.get(teamName).push(totalMetricValue);
            });
        });

        const series = Array.from(teamMap.entries()).map(([name, data]) => ({
            name,
            data,
        }));

        return {
            chart: {
                type: "column",
            },
            title: {
                text:"" ,
            },
            xAxis: {
                categories,
                title: { text: "Week" },
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Total Metric Value",
                },
            },
            tooltip: {
                shared: true,
                valueSuffix: '',
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                },
            },
            series,
        };
    };

    const options = chartOptions();

    return (
        <div className="">
            <Header>
                <h3>{graphName ? (graphName?.charAt(0).toUpperCase() + graphName?.slice(1)).replace("-", " ") : "Not Found"}</h3>
            </Header>
            <hr />
            <Stack direction="row" spacing={10}>
                <TeamSelector style={{ backgroundColor: 'gray' }}
                    data={teams}
                    onConfirm={(ids) => {
                        localStorage.setItem('selectedTeamIds', JSON.stringify(ids));
                        setSelectedTeamIds(ids);
                    }}
                />
                <Duration onChange={(range) => {
                    setDuration(range);
                    localStorage.setItem('duration', JSON.stringify(range));
                }} />
                <Dropdown  title={`Group By: ${timeFilter}`} onSelect={val => setTimeFilter(val)}>
                    <Dropdown.Item eventKey="daily">Daily</Dropdown.Item>
                    <Dropdown.Item eventKey="weekly">Weekly</Dropdown.Item>
                    <Dropdown.Item eventKey="monthly">Monthly</Dropdown.Item>
                </Dropdown>
            </Stack>
            <hr />
            <div className="mb-6 mt-4 bg-white p-4 border border-gray-200 rounded-3xl">
                
            <div className="mb-6 ">
                <h3 className=" font-semibold">{graphName ? (graphName?.charAt(0).toUpperCase() + graphName?.slice(1)).replace("-", " ") : "Not Found"}</h3>
                {summaryData ? (
                    <>
                    <p className=" text-xl font-semibold">{summaryData.primaryValue}</p>
                    <div className="flex flex-row gap-1 text-sm font-medium">
                        <span
    className={
      summaryData.changePercentage >= 0
        ? "text-green-600"
        : "text-red-600"
    }
  >
    {summaryData.changePercentage >= 0 ? "+" : "-"}
    {Math.abs(summaryData.changePercentage)}%
  </span>
  <span>vs previous</span>
  <span>
    {Math.round((duration.endDate - duration.startDate) / 86400)} days
  </span>
                    </div>
                    </>
                ) : (
                    <p>Loading summary...</p>
                )}
            </div>
            <hr />
            <div>
                {options ? (
                    <div className="overflow-x-auto">
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </div>
                ) : (
                    <p>Loading chart...</p>
                )}
            </div>
        </div>
        </div>
    );
}
