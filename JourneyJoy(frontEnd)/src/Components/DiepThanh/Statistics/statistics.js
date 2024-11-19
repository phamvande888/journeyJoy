import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./statistics.css"; // Import the CSS file

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Statistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStatistics = async () => {
      console.log("Fetching statistics...");
      try {
        const response = await fetch(
          "https://seagull-assured-skunk.ngrok-free.app/api/admin/statistics",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        console.log("API Response Status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API Response Data:", result);

        if (result) {
          setData(result);
          console.log("Data set successfully");
        } else {
          setError("No data received from API");
          console.error("No data received from API");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
        console.log("Loading state set to false");
      }
    };

    fetchStatistics();

    const intervalId = setInterval(() => {
      console.log("Refreshing statistics...");
      fetchStatistics();
    }, 30000);

    return () => {
      clearInterval(intervalId);
      console.log("Cleanup interval");
    };
  }, [token]);

  if (loading) {
    console.log("Loading data...");
    return <p className="loading">Loading...</p>;
  }
  if (error) {
    console.error("Error:", error);
    return <p className="error">Error: {error}</p>;
  }

  if (!data) {
    console.log("No data available");
    return <p className="error">No data available</p>;
  }

  const formatNumber = (num) =>
    num !== undefined && num !== null && !isNaN(num)
      ? num.toLocaleString()
      : "N/A";
  const formatCurrency = (num) =>
    num !== undefined && num !== null && !isNaN(num)
      ? new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(num)
      : "₫0";
  const formatPercentage = (num) =>
    num !== undefined && num !== null && !isNaN(num)
      ? `${num.toFixed(1)}%`
      : "N/A";

  const totalRevenue = data.totalRevenue
    ? parseFloat(data.totalRevenue.replace(/,/g, ""))
    : 0;

  const chartData = {
    labels: ["Pending Bookings", "Completed Bookings", "Cancelled Bookings"],
    datasets: [
      {
        label: "Percentage",
        data: [
          data.pendingBookingsPercentage,
          data.completedBookingsPercentage,
          data.cancelledBookingsPercentage,
        ],
        backgroundColor: ["#ffcc00", "#36a2eb", "#ff6384"],
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
    },
  };

  return (
    <div className="statistics-container">
      <a href="/admin" className="home-button">
        Home
      </a>
      <h1>Statistics</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total Tours Booked</td>
              <td>{formatNumber(data.totalToursBooked)}</td>
            </tr>
            <tr>
              <td>Pending Bookings Count</td>
              <td>{formatNumber(data.pendingBookingsCount)}</td>
            </tr>
            <tr>
              <td>Pending Bookings Percentage</td>
              <td>{formatPercentage(data.pendingBookingsPercentage)}</td>
            </tr>
            <tr>
              <td>Completed Bookings Count</td>
              <td>{formatNumber(data.completedBookingsCount)}</td>
            </tr>
            <tr>
              <td>Completed Bookings Percentage</td>
              <td>{formatPercentage(data.completedBookingsPercentage)}</td>
            </tr>
            <tr>
              <td>Cancelled Bookings Count</td>
              <td>{formatNumber(data.cancelledBookingsCount)}</td>
            </tr>
            <tr>
              <td>Cancelled Bookings Percentage</td>
              <td>{formatPercentage(data.cancelledBookingsPercentage)}</td>
            </tr>
            <tr>
              <td>Total Revenue</td>
              <td>{formatCurrency(totalRevenue)}</td>
            </tr>
            <tr>
              <td>Overall Average Rating</td>
              <td>
                {data.overallAverageRating !== undefined &&
                data.overallAverageRating !== null
                  ? data.overallAverageRating.toFixed(1)
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Statistics;
