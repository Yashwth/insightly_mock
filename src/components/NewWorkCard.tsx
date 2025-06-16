    import Highcharts from 'highcharts';
    import HighchartsReact from 'highcharts-react-official';

    const localeFormat = (date: Date, format: string): string => {
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
    };

    const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return localeFormat(date, 'dd MMM');
    };

    const NewWorkCard = ({ title, value, change, data, trend }) => {
    const chartOptions: Highcharts.Options = {
        chart: {
        type: 'areaspline',
        height: 100,
        backgroundColor: 'transparent'
        },
        title: { text: null },
        xAxis: {
        visible: false,
        labels: { enabled: false },
        lineWidth: 0,
        tickLength: 0
        },
        yAxis: {
        visible: false,
        title: { text: null }
        },
        tooltip: {
        useHTML: true,
        borderWidth: 0,
        borderRadius: 12,
        formatter: function () {
            return `<b>${formatDate(this.point.options.formattedDate)}</b><br/>${this.y}%`;
        }
        },
        series: [{
        type: 'areaspline',
        data: data.map(d => ({
            y: d.percentage,
            formattedDate: d.formattedDate
        })),
        color: trend === 'NEGATIVE' ? '#DC2626' : '#22C55E',
        fillColor: {
            linearGradient: [0, 0, 0, 80],
            stops: [
            [0, Highcharts.color(trend === 'NEGATIVE' ? '#DC2626' : '#22C55E').setOpacity(0.15).get('rgba')],
            [1, Highcharts.color(trend === 'NEGATIVE' ? '#DC2626' : '#22C55E').setOpacity(0.01).get('rgba')]
            ]
        },
        marker: { enabled: false },
        lineWidth: 1.5
        }],
        credits: { enabled: false },
        legend: { enabled: false }
    };

    return (
        <div className="rounded-xl shadow bg-white p-4 w-64">
        <div className="text-sm text-gray-500 font-medium">{title}</div>
        <div className="text-2xl font-bold">{value.toFixed(1)}%</div>
        <div className={`text-sm font-medium ${change < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {change > 0 ? '+' : ''}{change.toFixed(0)}% vs previous 30 days
        </div>
        <div className="mt-2">
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </div>
        </div>
    );
    };

    export default NewWorkCard;
