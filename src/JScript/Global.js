document.addEventListener("DOMContentLoaded", async () => {
  const headers = window.YeyaAuth?.authHeaders() || {};
  try {
    const summaryRes = await fetch(window.YeyaApi.url("/api/admin/summary"), { headers });
    if (summaryRes.ok) {
      const s = await summaryRes.json();
      const money = new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'});
      const sales=document.getElementById('metric-sales'); if(sales)sales.textContent=money.format(Number(s.ventasTotales||0));
      const orders=document.getElementById('metric-orders'); if(orders)orders.textContent=s.pedidosMes ?? 0;
      const clients=document.getElementById('metric-clients'); if(clients)clients.textContent=s.clientes ?? 0;
      const low=document.getElementById('metric-low-stock'); if(low)low.textContent=s.stockBajo ?? 0;
    }
  } catch (e) { console.error('No se pudo cargar el resumen:',e); }

  const canvas = document.getElementById("graficoRendimiento");
  if (!canvas || typeof Chart === 'undefined') return;
  try {
    const response = await fetch(window.YeyaApi.url("/api/analytics/performance"), { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const reporte = await response.json();
    new Chart(canvas.getContext("2d"), {
      type: "line",
      data: { labels: reporte.meses || [], datasets: [
        { label:"Ventas ($ MXN)", data:reporte.ventas||[], borderColor:"#C66271", backgroundColor:"rgba(198,98,113,.1)", borderWidth:3, tension:.3, fill:true, yAxisID:"y" },
        { label:"Pedidos", data:reporte.pedidos||[], borderColor:"#e2b863", borderWidth:2, tension:.3, yAxisID:"y1" }
      ]},
      options:{responsive:true,maintainAspectRatio:false,scales:{y:{position:'left'},y1:{position:'right',grid:{drawOnChartArea:false}}}}
    });
  } catch(e) { console.error('No se pudo cargar la gráfica:',e); }
});
