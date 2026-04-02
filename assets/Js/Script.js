const montoInput = document.getElementById("monto");
const monedaSelect = document.getElementById("moneda");
const resultado = document.getElementById("resultado");
const error = document.getElementById("error");

let chart;

async function obtenerDatos(moneda){
    try{
        error.innerText = "";

        const res = await fetch(`https://mindicador.cl/api/${moneda}`);
        const data = await res.json();

        return data;

    } catch (err){
        error.innerText = "Error al cargar datos";
        console.error(err);
    }
}

function renderGrafico(serie){
    const ultimos10 = serie.slice(0, 10).reverse();

    const labels = ultimos10.map(d =>
    new Date(d.fecha).toLocaleDateString("es-CL")
  );

  const valores = ultimos10.map(d => d.valor);
  const ctx = document.getElementById("grafico").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Historial últimos 10 días",
        data: valores,
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.2)",
        tension: 0.4
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}

document.getElementById("convertir").addEventListener("click", async () => {
    const monto = montoInput.value;
    const moneda = monedaSelect.value;

    if (!monto) {
        error.innerText = "Ingrese un monto valido";
        return;
    }

    const data = await obtenerDatos(moneda);
    if (!data) return;

    const valor = data.serie[0].valor;
    const conversion = monto / valor;

    resultado.innerText = `Resultado $${conversion.toFixed(2)}`;

    renderGrafico(data.serie);
});