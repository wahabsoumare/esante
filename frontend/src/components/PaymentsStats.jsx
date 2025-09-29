// PaymentStats.jsx
import React from 'react';

const PaymentStats = ({ stats }) => {
  const statCards = [
    {
      label: 'En attente de validation',
      value: stats.pending,
      icon: 'fas fa-clock',
      color: 'warning',
      trend: { value: '+3', direction: 'up' }
    },
    {
      label: 'Validés aujourd\'hui',
      value: stats.validatedToday,
      icon: 'fas fa-check-double',
      color: 'primary',
      trend: { value: '+8', direction: 'up' }
    },
    {
      label: 'Rejetés aujourd\'hui',
      value: stats.rejectedToday,
      icon: 'fas fa-times-circle',
      color: 'danger',
      trend: { value: '-2', direction: 'down' }
    },
    {
      label: 'Taux de validation',
      value: `${stats.successRate}%`,
      icon: 'fas fa-chart-line',
      color: 'success',
      trend: { value: '+0.5%', direction: 'up' }
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'border-l-blue-500 bg-blue-50',
      warning: 'border-l-yellow-500 bg-yellow-50',
      danger: 'border-l-red-500 bg-red-50',
      success: 'border-l-green-500 bg-green-50'
    };
    return colors[color] || colors.primary;
  };

  const getIconColor = (color) => {
    const colors = {
      primary: 'text-blue-600',
      warning: 'text-yellow-600',
      danger: 'text-red-600',
      success: 'text-green-600'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`p-6 rounded-lg border-l-4 ${getColorClasses(stat.color)} shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              <div className={`flex items-center gap-1 mt-2 text-sm ${
                stat.trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <i className={`fas fa-arrow-${stat.trend.direction}`}></i>
                <span>{stat.trend.value} vs hier</span> 
              </div>
            </div>
            <div className={`text-3xl ${getIconColor(stat.color)}`}>
              <i className={stat.icon}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentStats;