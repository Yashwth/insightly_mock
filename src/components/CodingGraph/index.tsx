import React, { useEffect, useRef, useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Mixpanel from 'src/services/mixpanel'
import { connect } from 'react-redux'
import { RootState } from '../../store/RootState'

import { CodingDetailType, CodingGraphProps, CodingSeriesType } from 'src/types/Coding'
import NoData from 'src/components/no-data/NoData'

import styles from './CodingGraph.module.scss'
import TeamSizeBig from '../../TeamSizeBig'
import { epochToDate, getPeriodString } from 'src/services/service'
import { MAX_TEAM_SIZE } from 'src/constants/app'
import { Button } from 'rsuite'
import Loader from 'src/components/loader/Loader'
import { localeFormat } from 'src/services/utils'
import { User } from 'src/types/User'
Highcharts.setOptions({
  chart: {
    style: {
      fontFamily: 'Nunito sans'
    }
  }
})

let GRAPH_OPTIONS: Highcharts.Options = {
  xAxis: {
    categories: [],
    title: {
      text: 'Date'
    },
    min: 0,
    lineColor: '#ffffff',
    gridLineColor: '#ffffff'
  },
  yAxis: {
    title: {
      text: 'Lines of code'
    },
    lineColor: '#ffffff',
    gridLineColor: '#ffffff',
    stackLabels: {
      enabled: true,
      formatter: function () {
        return this.total.toLocaleString();
      }
    }
  },
  title: {
    text: 'Coding breakdown'
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true
      }
    }
  },
  series: [],
  legend: {
    enabled: false
  }
}

type StateProps = {
  user: User
}

type ComponentProps = CodingGraphProps & StateProps

const CodingGraph: React.FC<ComponentProps> = ({ showTeamSizeLimit, codingTotal, codingDetails, duration, onBarSelect, metricCards, children, user }) => {
  const [series, setSeries] = useState<CodingDetailType[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [graphOptions, setGraphOptions] = useState<Highcharts.Options>(GRAPH_OPTIONS)
  const [frequency, setFrequency] = useState(getPeriodString(duration))
  const transformedSeries = useRef<CodingSeriesType[]>([])
  const transformedSeriesData = useRef<{ [key: string]: CodingDetailType }>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const _chartSerieClick = (event: Highcharts.SeriesClickEventObject): void => {
    if (onBarSelect) {
      const foundItem = transformedSeries.current.find((s) => s.name === event.point.series.name)
      const categoryName = event.point.category;
      const seriesName = event.point.series.name;
      
      // Track the bar click event with Mixpanel
      Mixpanel.track('coding_graph_bar_click', {
        category: categoryName,
        series: seriesName,
        value: event.point.y,
        column_name: foundItem?.custom?.columnNames[0],
        user_id: user?.id,
        user_type: user?.accessRole,
        org_id: user?.organization?.id
      });
      
      onBarSelect(foundItem?.custom?.columnNames[0], transformedSeriesData.current[event.point.category], true)
    }
  }

  const _getXAxisCategories = (): string[] => {
    const categories: string[] = []
    series.forEach((d) => {
      if (d.authorId === null) {
        const dateString = _getDateString(d)
        if (categories.indexOf(dateString) === -1) {
          categories.push(dateString)
        }
      }
    })
    return categories
  }

  const _getChartSeries = (categories: string[]): CodingSeriesType[] => {
    transformedSeries.current = [
      {
        type: 'column',
        name: 'New work',
        color: '#5E38C7',
        custom: { columnNames: ['newwork'] },
        data: [],
        dataLabels: [],
        events: {
          click: _chartSerieClick
        }
      },
      {
        type: 'column',
        name: 'Rework',
        color: '#61A9CD',
        custom: { columnNames: ['rework', 'assistance'] },
        data: [],
        dataLabels: [],
        events: {
          click: _chartSerieClick
        }
      },
      {
        type: 'column',
        name: 'Maintenance',
        color: '#E35535',
        custom: { columnNames: ['maintenance'] },
        data: [],
        dataLabels: [],
        events: {
          click: _chartSerieClick
        }
      },
      // @TODO: future story
      // {
      //   type: 'line',
      //   name: 'Trend',
      //   custom: { columnNames: 'trendline' },
      //   data: [],
      // }
    ]
    series.forEach((d) => {
      if (d.authorId !== null) {
        const dateString = _getDateString(d)
        const dateIdx = categories.indexOf(dateString)
        transformedSeries.current.forEach((s) => {
          if (!s.data.length) {
            categories.forEach((c, idx) => s.data[idx] = 0)
          }
          if (dateIdx > -1) {
            s.custom.columnNames.forEach((c) => {
              s.data[dateIdx] += d[c]
            })
          }
        })
        transformedSeriesData.current[dateString] = d
      }
    })
    return transformedSeries.current
  }

  const _getDateString = (codingDetail: CodingDetailType): string => {
    let dateString = `${codingDetail.year}/${codingDetail.period}`
    switch (frequency) {
      case 'daily':
      case 'weekly':
        return localeFormat(new Date(dateString), 'MM/dd EEE')
      case 'monthly':
        dateString = `${codingDetail.year}/${codingDetail.month}/${codingDetail.day}`
        return localeFormat(new Date(dateString), 'LLL')
      default:
        return dateString
    }
  }

  const _isSeriesEmpty = (series: CodingDetailType[]): boolean => {
    if (!series?.length) return true
    return series.every((s) => s.authorId === null)
  }

  const refreshWindow = (): void => {
    window.location.reload();
  }

  const updateMetricCardFilter = (metric: any): void => {
    const filters = [...selectedFilters];
    metric.columnNames.forEach((columnName: string) => {
      const filterIdx = filters.indexOf(columnName)
      if (filterIdx > -1) {
        filters.splice(filterIdx, 1)
      } else {
        filters.push(columnName)
      }
    })
    setSelectedFilters([...filters])
  }

  useEffect(() => {
    if (codingDetails) {
      setSeries(codingDetails)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codingDetails])

  useEffect(() => {
    setFrequency(getPeriodString([epochToDate(duration[0]), epochToDate(duration[1])]))
  }, [duration])

  useEffect(() => {
    const categories = _getXAxisCategories()
    const chartSeries = _getChartSeries(categories)
    setGraphOptions({
      ...graphOptions,
      xAxis: {
        ...graphOptions.xAxis,
        categories: categories
      },
      series: selectedFilters?.length ? [...chartSeries.filter((s) => s.custom.columnNames.every(c => selectedFilters.indexOf(c) > -1))] : [...chartSeries]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series, selectedFilters])

  return (
    <React.Fragment>
      <section className={styles.codingGraphMetadata}>
        <div className="metric-cards row mx-0">
          {
            metricCards.map((m, idx) => {
              return (
                <div key={'metric-card-parent-' + idx} onClick={(event) => { event.stopPropagation(); updateMetricCardFilter(m) }} className={`metric-card-parent ${m.columnNames.every((c: string) => selectedFilters?.includes(c)) ? 'active' : ''}`}>
                  {m.childNode}
                </div>
              )
            })
          }
        </div>
      </section>
      {children}
      <div className={styles.codingGraph}>
        {
          showTeamSizeLimit ?
            <TeamSizeBig size={MAX_TEAM_SIZE} />
            : !codingTotal ? <NoData showImage={true} minHeight={true} text={'There is no data available.'} />
              : _isSeriesEmpty(series) && isLoading ? <Loader minHeight={true} text={'Loading, Either there is no data available or the data is still being retrieved. If the data is not displayed in the next ~5 minutes, Kindly try expanding the filters and you can always contact us if stuck.'} />
                : !codingTotal && !_isSeriesEmpty(series) ?
                  <div className={styles.heavyDataState}>
                    <span className="material-icons-round">fitness_center</span>
                    <h3>Heavy data detected</h3>
                    <p>This data usually takes longer than the rest of the screens. Please check back again in a couple of hours</p>
                    <Button onClick={refreshWindow}>Refresh</Button>
                  </div>
                  : <HighchartsReact
                    containerProps={{ style: { height: "100%", width: '100%' } }}
                    highcharts={Highcharts}
                    options={graphOptions}
                    callback={() => setIsLoading(false)}
                  />
        }
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state: RootState): StateProps => ({
  user: state.auth.user
});

export default connect<StateProps, {}, ComponentProps, RootState>(mapStateToProps, {})(CodingGraph);
