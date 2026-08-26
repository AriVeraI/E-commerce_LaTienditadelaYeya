      // Configuración e inicialización del gráfico con Chart.js
      const ctx = document.getElementById('graficoRendimiento').getContext('2d');
      
      const graficoRendimiento = new Chart(ctx, {
        type: 'line', // Gráfica de línea ideal para tendencias de tiendas online
        data: {
          labels: ['Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'],
          datasets: [
            {
              label: 'Ventas ($ MXN)',
              data: [15000, 18200, 19500, 21000, 22800, 24500], // Coincide con tu total actual
              borderColor: '#c86d7c', // Color principal de tu paleta (vino/rosa viejo)
              backgroundColor: 'rgba(200, 109, 124, 0.1)',
              borderWidth: 3,
              tension: 0.3, // Curva suave en la línea
              fill: true,
              yAxisID: 'y'
            },
            {
              label: 'Visitas (x100)',
              data: [22, 25, 27, 29, 31, 32], // Simulado acorde a tus 3,200 visitas
              borderColor: '#e2b863', // Color de acento dorado de tu paleta
              backgroundColor: 'transparent',
              borderWidth: 2,
              borderDash: [5, 5], // Línea punteada para diferenciar métrica
              tension: 0.3,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  family: 'Montserrat'
                }
              }
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              title: {
                display: true,
                text: 'Ventas en Pesos ($)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              grid: {
                drawOnChartArea: false, // Evita que se crucen las líneas de la cuadrícula
              },
              title: {
                display: true,
                text: 'Visitas'
              }
            }
          }
        }
      });
