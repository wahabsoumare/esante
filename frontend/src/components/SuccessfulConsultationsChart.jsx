// src/components/dashboard/SuccessfulConsultationsChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const SuccessfulConsultationsChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // Données mockées - À remplacer par vos données API
  const chartData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Consultations réussies',
        data: [45, 52, 38, 61, 55, 48, 42],
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: '#22c55e',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Consultations totales',
        data: [48, 55, 42, 65, 58, 52, 45],
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#6b7280',
          font: {
            size: 12,
            family: 'inherit'
          },
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y} patients`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(243, 244, 246, 1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(243, 244, 246, 1)',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          callback: function(value) {
            return value + ' pts';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: '#ffffff',
        borderWidth: 2
      }
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      // Détruire le graphique existant s'il y en a un
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Créer le nouveau graphique
      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: chartData,
        options: chartOptions
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  // Calcul des statistiques
  const totalConsultations = chartData.datasets[1].data.reduce((a, b) => a + b, 0);
  const successfulConsultations = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
  const successRate = ((successfulConsultations / totalConsultations) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mt-10">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i className="fas fa-chart-line text-green-600"></i>
            Patients consultés avec succès
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Évolution hebdomadaire des consultations réussies
          </p>
        </div>
        
        <div className="flex gap-4 mt-4 lg:mt-0">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{successfulConsultations}</div>
            <div className="text-sm text-gray-600">Consultations réussies</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{successRate}%</div>
            <div className="text-sm text-gray-600">Taux de réussite</div>
          </div>
        </div>
      </div>

      {/* Filtres de période */}
      <div className="flex gap-2 mb-6">
        {['7j', '30j', '3m', '1a'].map((period) => (
          <button
            key={period}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {period}
          </button>
        ))}
        <select className="ml-auto px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Par jour</option>
          <option>Par semaine</option>
          <option>Par mois</option>
        </select>
      </div>

      {/* Graphique */}
      <div className="h-80">
        <canvas ref={chartRef} />
      </div>

      {/* Légende et indicateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <div>
            <div className="text-sm font-medium text-gray-900">Consultations réussies</div>
            <div className="text-xs text-gray-600">Patients satisfaits</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <div>
            <div className="text-sm font-medium text-gray-900">Consultations totales</div>
            <div className="text-xs text-gray-600">Toutes consultations</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div>
            <div className="text-sm font-medium text-gray-900">Taux de réussite</div>
            <div className="text-xs text-gray-600">{successRate}% cette semaine</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulConsultationsChart;