import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';

AppWebsiteVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
};

export default function AppWebsiteVisits({ title, subheader, chartData, ...other }) {
  const totalPriceByDate = {};

  chartData.forEach(item => {
    const { salaryPrice, createdAt } = item;
    const date = new Date(createdAt);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    if (totalPriceByDate[formattedDate]) {
      totalPriceByDate[formattedDate] += salaryPrice;
    } else {
      totalPriceByDate[formattedDate] = salaryPrice;
    }
  });

  const result = Object.entries(totalPriceByDate).map(([date, salaryPrice]) => ({
    salaryPrice,
    date
  }));

  const chartOptions = {
    chart: {
      id: 'basic-bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        bar: {
          columnWidth: '28%',
        },
        dataLabels: {
          position: 'top',
        },
      }
    },
    dataLabels: {
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
    },
    
    xaxis: {
      categories: result.map(item => item.date),
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          }
        }
      },
    },
  };

  const series = [
    {
      name: 'Price',
      data: result.map(item => item.salaryPrice),
    },
  ];

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="bar" series={series} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
