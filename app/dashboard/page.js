"use client";

import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsStock from 'highcharts/modules/stock';
import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

// Initialize Highcharts Stock
HighchartsStock(Highcharts);

const Dashboard = () => {
  // Define state variables to store chart data
  const [candlestickData, setCandlestickData] = useState([]);
  const [lineData, setLineData] = useState({ labels: [], datasets: [] });
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [activeSection, setActiveSection] = useState('charts'); // Default to the charts section

  // Fetch data from the backend when the component is loaded
  useEffect(() => {
    // Get candlestick chart data
    axios.get('http://localhost:8000/api/candlestick-data/')
      .then(response => {
        const transformedData = response.data.data.map(item => [
          new Date(item.x).getTime(),
          item.open,
          item.high,
          item.low,
          item.close
        ]);
        setCandlestickData(transformedData);
      });

    // Get line chart data
    axios.get('http://localhost:8000/api/line-chart-data/')
      .then(response => setLineData({
        labels: response.data.labels || [],
        datasets: [{ label: 'Line Chart', data: response.data.data || [] }]
      }));

    // Get bar chart data
    axios.get('http://localhost:8000/api/bar-chart-data/')
      .then(response => setBarData({
        labels: response.data.labels || [],
        datasets: [{
          label: 'Bar Chart',
          data: response.data.data || [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      }));

    // Get pie chart data
    axios.get('http://localhost:8000/api/pie-chart-data/')
      .then(response => setPieData({
        labels: response.data.labels || [],
        datasets: [{
          data: response.data.data || [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      }));
  }, []);

  // Define options for the candlestick chart
  const highchartsOptions = {
    rangeSelector: { selected: 1 },
    series: [{
      type: 'candlestick',
      name: 'Candlestick Chart',
      data: candlestickData,
      dataGrouping: {
        units: [['week', [1]], ['month', [1, 2, 3, 4, 6]]]
      }
    }]
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar for navigation */}
      <nav style={{ 
        width: '200px', 
        backgroundColor: '#333', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '1rem', 
        position: 'fixed', 
        top: 0, 
        left: 0 }}>
        <button 
          onClick={() => setActiveSection('charts')} 
          style={{ 
            color: '#fff', 
            padding: '1rem', 
            backgroundColor: '#444', 
            border: 'none', 
            cursor: 'pointer' }}>
          Charts
        </button>
      </nav>

      {/* Main content area */}
      <div style={{ padding: '2rem', flexGrow: 1, marginLeft: '220px' }}>
        {activeSection === 'charts' && (
          <section id="charts">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <h2>Line Chart</h2>
                <Line data={lineData} />
              </div>
              <div>
                <h2>Bar Chart</h2>
                <Bar data={barData} />
              </div>
              <div>
                <h2>Pie Chart</h2>
                <Pie data={pieData} />
              </div>
              <div>
                <h2>Candlestick Chart</h2>
                <HighchartsReact
                  highcharts={Highcharts}
                  constructorType={'stockChart'}
                  options={highchartsOptions}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
