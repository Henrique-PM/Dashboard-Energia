function criarGraficoPorEstado(estados, valoresEstado, mediaEstado) {
    const linhaMediaEstado = new Array(valoresEstado.length).fill(mediaEstado);
  
    return new Chart(document.getElementById('grafico'), {
      type: 'bar',
      data: {
        labels: estados,
        datasets: [
          {
            type: 'bar',
            label: 'Geração por Estado (MW)',
            data: valoresEstado,
            backgroundColor: 'rgba(34, 197, 94, 0.6)',
            borderColor: 'rgba(22, 163, 74, 1)',
            borderWidth: 2
          },
          {
            type: 'line',
            label: `Média (${mediaEstado.toFixed(2)} MW)`,
            data: linhaMediaEstado,
            borderColor: 'rgba(239, 68, 68, 1)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: false,
            tension: 0.3,
            pointRadius: 0,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Geração por Estado com Linha de Média'
          }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
  
  //gráfico pizza
  function criarGraficoPizza(elementId, labels, dados, cores) {
    return new Chart(document.getElementById(elementId), {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Distribuição',
          data: dados,
          backgroundColor: cores
        }]
      },
      options: { responsive: true }
    });
  }
  
  //gráfico de linha
  function criarGraficoTempo(labels, valores) {
    return new Chart(document.getElementById('graficoTempo'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Geração Diária (MW)',
          data: valores,
          fill: true,
          backgroundColor: 'rgba(59,130,246,0.2)',
          borderColor: 'rgba(59,130,246,1)',
          tension: 0.3
        }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
  }
  
  //Extrair dados
  function processarDados(dados) {
    const porEstado = {};
    const porUsina = {};
    const porCombustivel = {};
    const porTempo = {};
  
    dados.forEach(item => {
      const estado = item.nom_estado;
      const usina = item.nom_tipousina;
      const combustivel = item.nom_tipocombustivel;
      const instante = item.din_instante.split('T')[0];
      const valor = parseFloat(item.val_geracao.replace(',', '.')) || 0;
  
      porEstado[estado] = (porEstado[estado] || 0) + valor;
      porUsina[usina] = (porUsina[usina] || 0) + valor;
      porCombustivel[combustivel] = (porCombustivel[combustivel] || 0) + valor;
      porTempo[instante] = (porTempo[instante] || 0) + valor;
    });
  
    return { porEstado, porUsina, porCombustivel, porTempo };
  }
  
  fetch('/dados')
    .then(res => res.json())
    .then(dados => {
      const { porEstado, porUsina, porCombustivel, porTempo } = processarDados(dados);
  
      const estados = Object.keys(porEstado);
      const valoresEstado = Object.values(porEstado);
      const mediaEstado = valoresEstado.reduce((a, b) => a + b, 0) / valoresEstado.length;

      criarGraficoPorEstado(estados, valoresEstado, mediaEstado);
      criarGraficoPizza('graficoUsina', Object.keys(porUsina), Object.values(porUsina), [
        '#38bdf8', '#facc15', '#f87171', '#a78bfa', '#34d399'
      ]);
      criarGraficoPizza('graficoCombustivel', Object.keys(porCombustivel), Object.values(porCombustivel), [
        '#fb923c', '#60a5fa', '#10b981', '#f43f5e', '#8b5cf6'
      ]);
      
      const tempoLabels = Object.keys(porTempo).sort();
      const tempoValores = tempoLabels.map(data => porTempo[data]);
      criarGraficoTempo(tempoLabels, tempoValores);
    });
  