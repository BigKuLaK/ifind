import { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import dayjs from "dayjs";
import withConditionalRender  from "@utilities/hocs/withConditionalRender";

import "./styles.scss";

const PriceChangeGraph = ({ priceChanges }: PriceChangeGraphProps) => {
  const thirtyDaysBefore = dayjs().subtract(30, "days").valueOf;
  const defaultChartOptions: { [key: string]: any} = {
    title: {
      text: null,
    },
    chart: {
      type: "line",
      height: 200,
      styledMode: true,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      title: {
        text: "Date",
      },
      type: "datetime",
      tickAmount: 30,
      tickInterval: 24 * 3600 * 1000,
      startOnTick: false,
      endOnTick: false,
      labels: {
        format: `{value:%m/%d}`,
      },
    },
    yAxis: {
      title: {
        text: "Price",
      },
      startOnTick: false,
      tickAmount: 10,
    },
    tooltip: {
      formatter() {
        return `${dayjs(this.point.x).format("MMM DD")}: <strong>${
          this.point.y
        }</strong>`;
      },
      useHTML: true,
    },
  };
  const [highChartsOptions, setHighchartsOptions] = useState({});

  useEffect(() => {
    if (priceChanges?.length) {
      const prices = priceChanges
        .filter(priceChange => !!Number(priceChange?.price))
        .map(priceChange => Number(priceChange?.price));
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const ave = prices.reduce((sum, price) => sum + price, 0) / prices.length;

      defaultChartOptions.yAxis.min = min / 4;
      defaultChartOptions.yAxis.max = max * 1.25;
      defaultChartOptions.yAxis.plotLines = [
        {
          value: ave,
          width: 1,
        },
      ];

      setHighchartsOptions({
        series: [
          {
            data: priceChanges.map((priceChange) => (
              priceChange ? [
                dayjs(priceChange.date_time).valueOf(),
                Number(priceChange.price),
              ]: null
            )),
            pointStart: thirtyDaysBefore,
          },
        ],
        ...defaultChartOptions,
      });
    }
  }, [priceChanges]); // eslint-disable-line react-hooks/exhaustive-deps

  return priceChanges?.length ? (
    <div className="price-change-graph">
      <HighchartsReact highcharts={Highcharts} options={highChartsOptions} />
    </div>
  ) : null;
};

export default withConditionalRender<PriceChangeGraphProps>(PriceChangeGraph);
