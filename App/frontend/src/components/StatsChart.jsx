import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Map countries to bar colors for Runs
const countryColor = (country) => {
  const map = {
    'West Indies': '#800000', // maroon
    'New Zealand': '#808080', // grey
    'Australia': '#FFD700',   // yellow (gold-ish)
    'South Africa': '#006400',// dark green
    'Pakistan': '#90EE90',    // light green
    'England': '#f1f0f0ff',     // orange (updated)
  };
  return map[country] || 'rgba(54, 162, 235, 0.6)'; // fallback
};

const borderForColor = (color, country) => {
  // Provide a solid border; for orange/yellow/light colors, use a slightly darker border
  if (country === 'England') return '#CC8400';
  if (country === 'Australia') return '#CCAC00';
  if (country === 'Pakistan') return '#66BB66';
  if (country === 'New Zealand') return '#666666';
  if (country === 'South Africa') return '#004d00';
  if (country === 'West Indies') return '#5c0000';
  return color;
};

const StatsChart = ({ players }) => {
  if (!players || players.length === 0) {
    return (
      <div className="alert alert-info">
        No data available for charts. Add some players to see statistics.
      </div>
    );
  }

  // Prepare data for bar chart (Top 10 players by runs)
  const topRuns = [...players]
    .sort((a, b) => b.stats.runs - a.stats.runs)
    .slice(0, 10);

  // Compute per-bar colors based on each player's country
  const runsBackground = topRuns.map((p) => countryColor(p.country));
  const runsBorder = topRuns.map((p, i) => borderForColor(runsBackground[i], p.country));

  const barData = {
    labels: topRuns.map((p) => p.name),
    datasets: [
      {
        label: 'Runs',
        data: topRuns.map((p) => p.stats.runs),
        backgroundColor: runsBackground,
        borderColor: runsBorder,
        borderWidth: 1,
      },
      {
        label: 'Wickets',
        data: topRuns.map((p) => p.stats.wickets),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for doughnut chart (Runs distribution by country)
  const countryRuns = {};
  players.forEach((player) => {
    if (player.country) {
      countryRuns[player.country] =
        (countryRuns[player.country] || 0) + player.stats.runs;
    }
  });

  const topCountries = Object.entries(countryRuns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const doughnutData = {
    labels: topCountries.map(([country]) => country),
    datasets: [
      {
        label: 'Total Runs',
        data: topCountries.map(([, runs]) => runs),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 10 Players: Runs vs Wickets',
      },
      tooltip: {
        callbacks: {
          // Show country in tooltip for easier verification
          afterLabel: (ctx) => {
            const player = topRuns[ctx.dataIndex];
            return player?.country ? ` (${player.country})` : '';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Runs Distribution by Country (Top 5)',
      },
    },
  };

  return (
    <div className="row mb-4">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-body">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsChart;

