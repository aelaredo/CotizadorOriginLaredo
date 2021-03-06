import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, CssBaseline, Typography, Container, TextField, Button } from '@material-ui/core'
import Box from '@mui/material/Box';
import { makeStyles } from '@material-ui/core/styles'
import { DataGrid } from '@mui/x-data-grid';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios'
import DetalleSimbolo from './DetalleSimbolo'


const useStyles = makeStyles(theme => ({
  div: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  container: {
    height: "100%",
    opacity: "50%",
    marginTop: theme.spacing(10),
    backgroundColor: "white",
  },
}
))

function Layout() {
  const classes = useStyles();
  const [vista, setVista] = useState("seleccionSimbolos");
  const [simbolos, setSimbolos] = useState();
  const [comboSimbolo, setComboSimbolo] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowSeleccionada, setRowSeleccionada] = useState();

  const handleComboSimbolo = (event, value) => {
    setComboSimbolo(value);
  };
  const handleEliminar = (event, value, caca) => {
    const index = rows.findIndex(({ symbol }) => { debugger; return symbol === event.row.symbol });
    if (index !== -1) {
      setRows([
        ...rows.slice(0, index),
        ...rows.slice(index + 1)
      ]);
    }
  };
  const handleAgregar = (e, value) => {
    if (comboSimbolo != null && !rows.find((row) => { debugger; return row.symbol === comboSimbolo.symbol })) {
      setRows(oldArray => [...oldArray, { id: oldArray.length, ...comboSimbolo }]);
    }
  }

  const handleRowClick = (detalle, e) => {
    setRowSeleccionada(detalle.row);
    setVista("detalleSimbolo");

  }


  const columns = [
    { field: 'id', headerName: 'ID', width: 90, hide: "true" },
    {
      field: 'symbol',
      headerName: 'Simbolo',
      type: 'string',
      width: 150,
      editable: false,
    },
    {
      field: 'name',
      headerName: 'Nombre',
      type: 'string',
      width: 150,
      editable: false,
    },
    {
      field: 'currency',
      headerName: 'Moneda',
      type: 'string',
      width: 110,
      editable: true,
    },
    {
      field: "eliminar",
      headerName: "",
      width: 90,
      renderCell: (params) => {
        return (<Button variant="contained" color="secondary" onClick={() => handleEliminar(params)}>Eliminar</Button>)
      }
    },
  ]

  var options = [];
  if (simbolos) {
    options = simbolos.map(item => {
      return {
        label: item.symbol,
        ...item
      }
    })

  }


  useEffect(() => {
    axios.get('https://api.twelvedata.com/stocks?source=docs&exchange=NYSE', null).then(({ data }) => { setSimbolos(data.data) }).catch(({ response }) => { console.log(response.data) })
  },[vista]);

  return (
    <>
      <CssBaseline />
      <AppBar color='secondary'>
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div float="right">
            <Typography className={classes.title}  >Mis Acciones</Typography>
          </div>
          <div float="left">
            <Typography className={classes.title}  >{localStorage.getItem("loggedUser")}</Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" className={classes.container}>
        {vista === "seleccionSimbolos" ? <div className={classes.div}>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Simbolo" />}
            value={comboSimbolo || null}
            isOptionEqualToValue={(option, value) => option.symbol === value.symbol}
            onChange={handleComboSimbolo}
          />
          <Button variant="contained" color="primary" onClick={(e, value) => handleAgregar(e)}> Agregar simbolo</Button>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              disableMultipleSelection={true}
              onRowClick={(evento, row, detalle) => handleRowClick(evento, row, detalle)}
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </Box>
        </div> : ''}
        {vista === "detalleSimbolo" ? <><DetalleSimbolo simbolo={rowSeleccionada.symbol}></DetalleSimbolo> 
        <Button variant="contained" color="secondary" onClick={()=>setVista("seleccionSimbolos")}>Atras</Button>
         </>
        : ''}
      </Container>
    </>
  )
}

export default Layout
