import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingDown, TrendingUp, Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartProps {
  productName: string;
  currentPrice: number;
}

const PriceChart: React.FC<PriceChartProps> = ({ productName, currentPrice }) => {
  const [timeRange, setTimeRange] = useState<'10days' | '1month' | '1year'>('1month');

  // Mock price data
  const generatePriceData = (range: string) => {
    const basePrice = currentPrice;
    const variation = basePrice * 0.2; // 20% price variation
    
    let dataPoints: number;
    let labels: string[];
    
    switch (range) {
      case '10days':
        dataPoints = 10;
        labels = Array.from({ length: 10 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (9 - i));
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        break;
      case '1month':
        dataPoints = 30;
        labels = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return i % 5 === 0 ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        });
        break;
      case '1year':
        dataPoints = 12;
        labels = Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (11 - i));
          return date.toLocaleDateString('en-US', { month: 'short' });
        });
        break;
      default:
        dataPoints = 30;
        labels = [];
    }
    
    return {
      labels,
      data: Array.from({ length: dataPoints }, () => 
        basePrice + (Math.random() - 0.5) * variation
      )
    };
  };

  const priceData = generatePriceData(timeRange);
  const lowestPrice = Math.min(...priceData.data);
  const highestPrice = Math.max(...priceData.data);
  const priceChange = priceData.data[priceData.data.length - 1] - priceData.data[0];
  const priceChangePercent = (priceChange / priceData.data[0]) * 100;

  const chartData = {
    labels: priceData.labels,
    datasets: [
      {
        label: 'Price',
        data: priceData.data,
        borderColor: '#0071ce',
        backgroundColor: 'rgba(0, 113, 206, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0071ce',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#0071ce',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => `Price: $${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
          },
          callback: (value: any) => `$${value.toFixed(2)}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Price History</h3>
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(['10days', '1month', '1year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-white text-[#0071ce] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {range === '10days' ? '10D' : range === '1month' ? '1M' : '1Y'}
            </button>
          ))}
        </div>
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">Current</p>
          <p className="text-lg font-bold text-[#0071ce]">${currentPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Lowest</p>
          <p className="text-lg font-bold text-green-600">${lowestPrice.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Highest</p>
          <p className="text-lg font-bold text-red-600">${highestPrice.toFixed(2)}</p>
        </div>
      </div>

      {/* Price Change Indicator */}
      <div className="flex items-center justify-center mb-4">
        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
          priceChange >= 0 
            ? 'bg-red-50 text-red-600' 
            : 'bg-green-50 text-green-600'
        }`}>
          {priceChange >= 0 ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <Line data={chartData} options={chartOptions} />
      </div>

      {/* Price Alert Toggle */}
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-yellow-800">Price Alert</h4>
            <p className="text-sm text-yellow-700">Get notified when price drops below ${(currentPrice * 0.9).toFixed(2)}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;