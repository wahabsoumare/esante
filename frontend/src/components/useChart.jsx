// src/hooks/useCharts.js
import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const useCharts = () => {
  const regionalChartRef = useRef(null);
  const specialtyChartRef = useRef(null);

  useEffect(() => {
    if (regionalChartRef.current) {
      const regionalChart = new Chart(regionalChartRef.current, {
        type: 'line',
        data: {
          labels: ['Abidjan', 'Bouaké', 'Daloa', 'Korhogo', 'San Pedro'],
          datasets: [{
            label: 'Consultations',
            data: [1200, 800, 450, 300, 250],
            borderColor: '#1a73e8',
            backgroundColor: 'rgba(26, 115, 232, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });

      return () => regionalChart.destroy();
    }
  }, []);

  useEffect(() => {
    if (specialtyChartRef.current) {
      const specialtyChart = new Chart(specialtyChartRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Généraliste', 'Cardiologie', 'Pédiatrie', 'Dermatologie', 'Autres'],
          datasets: [{
            data: [40, 25, 15, 10, 10],
            backgroundColor: ['#1a73e8', '#34a853', '#f9ab00', '#9c27b0', '#5f6368']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });

      return () => specialtyChart.destroy();
    }
  }, []);

  return { regionalChartRef, specialtyChartRef };
};