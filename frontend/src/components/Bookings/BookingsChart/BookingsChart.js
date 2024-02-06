import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 10000000,
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BookingsChart = ({ bookings }) => {
  const options = {
    barValueSpacing : 5,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKETS[bucket].min &&
        current.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
  }

  return (
    <>
      <div
        style={{
          
        maxHeight: '400px',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '1rem'

        }}
      >
        <Bar options={options} data={chartData} />;
      </div>

      <ul>
        {bookings.length === 0 ? (
          <div className="bookings__container">No Bookings Made</div>
        ) : null}
      </ul>
    </>
  );
};

export default BookingsChart;
