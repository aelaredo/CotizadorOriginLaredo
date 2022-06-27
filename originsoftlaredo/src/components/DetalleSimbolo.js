import React, { useEffect, useState } from 'react'
import * as Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official'
import axios from 'axios'
import { Radio, RadioGroup, FormControl, FormControlLabel, FormLabel, TextField, MenuItem, Button } from '@material-ui/core';
import { Select } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

const DetalleSimbolo = (props) => {
    const [hoverData, setHoverData] = useState(null);
    const [ejeX, setEjex] = useState([]);
    const [series, setSeries] = useState([]);
    const [intervalo, setIntervalo] = useState("5min");
    const [fechaDesde, setDesde] = useState(new Date());
    const [fechaHasta, setHasta] = useState(new Date());
    const [detalle, setDetalle] = useState();
    const [fechasDisabled, setFechasDisabled] = useState(false)
    const [intervaloDisabled, setIntervaloDisabled] = useState(false)

    useEffect(() => {
        updateSeries()
    }, [series, ejeX])

    const handleIntervalo = (e, value) => {
        setIntervalo(value.props.value)
    }
    const handleDetalle = (e, value) => {
        if (value === "tiempoReal") {
            setFechasDisabled(true)
            setIntervaloDisabled(false)
        } else {
            setFechasDisabled(false)
            setIntervaloDisabled(true)
        }
        setDetalle(value);
    }

    const handleUpdate = (e, value) => {
        var queryBase = `https://api.twelvedata.com/time_series?symbol=${props.simbolo}&apikey=fe2ed3703075494caf806dd62a8b1720`
        //TODO Se podria agregar mas opciones para ajustar el intervalo cuando hacemos historicos (actualmente esta en intervalos de 1 dia)
        if (detalle === "tiempoReal") {
            queryBase += `&date=today&interval=${intervalo}`;
        } else {
            queryBase += `&end_date=${fechaHasta}`;
            queryBase += `&start_date=${fechaDesde}&interval=1day`;
        }

        axios.get(queryBase, null)
            .then(res => {
                //TODO faltan validaciones para casos extremos, asi como manejo de errores/mostrar mensajes de error
                if (res.data.status === 'ok') {
                    setSeries(res.data.values.map((registro) => { return Number.parseFloat(registro.close) }));
                    setEjex(res.data.values.map((registro) => { return registro.datetime.substring(0, 16) }))
                }
            })
    }



    const [chartOptions, setChartOptions] = useState({
        xAxis: {
            categories: ['A', 'B', 'C'],
        },
        series: [

            { title: props.simbolo, type: 'line', data: series, }
        ],
        plotOptions: {
            series: {
                point: {
                    events: {
                        mouseOver(e) {
                            setHoverData(e.target.category)
                        }
                    }
                }
            }
        }
    });

    const updateSeries = () => {
        setChartOptions({
            series: [
                {
                    type: "line",
                    name: props.simbolo,
                    data: series ? series.reverse() : []
                }
            ],
            xAxis: [
                {
                    type: "string",
                    categories: ejeX ? ejeX.reverse() : [],
                    ordinal: true
                }
            ]
        });
    }

    /// TODO Estilado, acomodamiento de botones.
    return (
        <div>
            <FormControl>
                <FormLabel id="demo-radio-buttons-group-label">Detalle</FormLabel>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="tiempoReal"
                    name="radio-buttons-group"
                    onChange={(e, value) => handleDetalle(e, value)}
                >
                    <FormControlLabel value="historico" control={<Radio />} label="Historico" />
                    <FormControlLabel value="tiempoReal" control={<Radio />} label="Tiempo Real" />
                </RadioGroup>
            </FormControl>
            <FormControl >
                <FormLabel id="demo-select-small">Intervalo</FormLabel>
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    defaultValue={"5min"}
                    value={intervalo}
                    label="Intervalo"
                    disabled={intervaloDisabled}
                    onChange={handleIntervalo}
                >
                    <MenuItem value={"1min"}>1 Minuto</MenuItem>
                    <MenuItem value={"5min"}>5 Minutos</MenuItem>
                    <MenuItem value={"15min"}>15 Minutos</MenuItem>
                </Select>
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label="Fecha Desde"
                        value={fechaDesde}
                        disabled={fechasDisabled}
                        onChange={(newDesde) => {
                            //TODO agregar validacion de fechas que desde sea menos a hasta por ejemplo
                            setDesde(newDesde.format("YYYY-MM-DD"));
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        label="Fecha Hasta"
                        value={fechaHasta}
                        disabled={fechasDisabled}
                        onChange={(newHasta) => {
                            //TODO agregar validacion de fechas
                            setHasta(newHasta.format("YYYY-MM-DD"));
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl fullWidth>
                <Button variant="contained" color="primary" onClick={handleUpdate}>Graficar</Button>
                </FormControl>
            
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
            />
            
        </div>
    )
}





export default DetalleSimbolo