function configurarGrid(dados) {
    const colunas = [
      { headerName: "Instante", field: "din_instante", flex: 1 },
      { headerName: "Estado", field: "nom_estado", flex: 1 },
      { headerName: "Tipo Usina", field: "nom_tipousina", flex: 1 },
      { headerName: "Combustível", field: "nom_tipocombustivel", flex: 1 },
      { headerName: "Usina", field: "nom_usina", flex: 1 },
      { headerName: "Geração (MW)", field: "val_geracao", flex: 1 }
    ];
  
    const gridOptions = {
      columnDefs: colunas,
      rowData: dados,
      defaultColDef: { sortable: true, filter: true, resizable: true },
      pagination: true,
      paginationPageSize: 20
    };
  
    new agGrid.createGrid(document.querySelector('#meuGrid'), gridOptions);
  }
  
  fetch('/dados')
    .then(res => res.json())
    .then(dados => {
      configurarGrid(dados);
    });
  