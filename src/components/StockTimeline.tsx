import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Package, Clock, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StockTimelineProps {
  productName: string;
  currentStock: 'in-stock' | 'limited' | 'out-of-stock';
}

const StockTimeline: React.FC<StockTimelineProps> = ({ productName, currentStock }) => {
  // Mock stock data for the past 30 days
  const generateStockData = () => {
    const labels = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.getDate();
    });

    // Generate stock levels (0 = out of stock, 1 = limited, 2 = in stock)
    const stockLevels = Array.from({ length: 30 }, () => {
      const rand = Math.random();
      if (rand < 0.1) return 0; // 10% out of stock
      if (rand < 0.3) return 1; // 20% limited
      return 2; // 70% in stock
    });

    return { labels, stockLevels };
  };

  const stockData = generateStockData();
  
  const chartData = {
    labels: stockData.labels,
    datasets: [
      {
        label: 'Stock Level',
        data: stockData.stockLevels,
        backgroundColor: stockData.stockLevels.map(level => {
          switch (level) {
            case 0: return '#ef4444'; // red for out of stock
            case 1: return '#f59e0b'; // yellow for limited
            case 2: return '#10b981'; // green for in stock
            default: return '#6b7280';
          }
        }),
        borderColor: stockData.stockLevels.map(level => {
          switch (level) {
            case 0: return '#dc2626';
            case 1: return '#d97706';
            case 2: return '#059669';
            default: return '#4b5563';
          }
        }),
        borderWidth: 1,
        borderRadius: 2,
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
        callbacks: {
          label: (context: any) => {
            const level = context.parsed.y;
            switch (level) {
              case 0: return 'Out of Stock';
              case 1: return 'Limited Stock';
              case 2: return 'In Stock';
              default: return 'Unknown';
            }
          },
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
            size: 10,
          },
          callback: (value: any, index: number) => {
            return index % 5 === 0 ? stockData.labels[index] : '';
          },
        },
      },
      y: {
        min: 0,
        max: 2,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10,
          },
          stepSize: 1,
          callback: (value: any) => {
            switch (value) {
              case 0: return 'Out';
              case 1: return 'Limited';
              case 2: return 'In Stock';
              default: return '';
            }
          },
        },
      },
    },
  };

  // Calculate stock statistics
  const totalDays = stockData.stockLevels.length;
  const inStockDays = stockData.stockLevels.filter(level => level === 2).length;
  const limitedDays = stockData.stockLevels.filter(level => level === 1).length;
  const outOfStockDays = stockData.stockLevels.filter(level => level === 0).length;

  const getStatusColor = () => {
    switch (currentStock) {
      case 'in-stock': return 'text-green-600 bg-green-50';
      case 'limited': return 'text-yellow-600 bg-yellow-50';
      case 'out-of-stock': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = () => {
    switch (currentStock) {
      case 'in-stock': return 'In Stock';
      case 'limited': return 'Limited Stock';
      case 'out-of-stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  const getNextRestockEstimate = () => {
    if (currentStock === 'out-of-stock') {
      return 'Expected back in stock: 2-3 days';
    } else if (currentStock === 'limited') {
      return 'Full stock expected: 1-2 days';
    }
    return 'Regularly stocked item';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Package className="w-5 h-5 text-[#0071ce]" />
        <h3 className="font-semibold text-gray-900">Stock Timeline (30 Days)</h3>
      </div>

      {/* Current Status */}
      <div className="mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </div>
        <p className="text-sm text-gray-600 mt-1">{getNextRestockEstimate()}</p>
      </div>

      {/* Stock Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800">In Stock</span>
          </div>
          <p className="text-lg font-bold text-green-600">
            {Math.round((inStockDays / totalDays) * 100)}%
          </p>
          <p className="text-xs text-green-700">{inStockDays} days</p>
        </div>
        
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium text-yellow-800">Limited</span>
          </div>
          <p className="text-lg font-bold text-yellow-600">
            {Math.round((limitedDays / totalDays) * 100)}%
          </p>
          <p className="text-xs text-yellow-700">{limitedDays} days</p>
        </div>
        
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm font-medium text-red-800">Out</span>
          </div>
          <p className="text-lg font-bold text-red-600">
            {Math.round((outOfStockDays / totalDays) * 100)}%
          </p>
          <p className="text-xs text-red-700">{outOfStockDays} days</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-32 mb-4">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Delivery Estimate */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-blue-800">Delivery Estimate</h4>
        </div>
        <p className="text-sm text-blue-700">
          {currentStock === 'in-stock' 
            ? 'Available for same-day delivery' 
            : currentStock === 'limited'
            ? 'Limited quantity - order soon for next-day delivery'
            : 'Currently unavailable - estimated delivery in 3-5 days when restocked'
          }
        </p>
      </div>
    </div>
  );
};

export default StockTimeline;