import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON, LayerGroup, Popup } from 'react-leaflet'
import luzon from '../SAMPLEE.json'
import L from 'leaflet'; // Import the Leaflet library
import { SnackBar } from './Snackbar'
import { Legend } from './Legend'
import mmsu from '../MMSUPRE1.json'
import { Box, Button, CssBaseline, Drawer, Grid, IconButton, InputAdornment, Link, MenuItem, Paper, Select, Switch, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography, styled, ListItemText, ListItemIcon } from '@mui/material';
import Control from 'react-leaflet-custom-control'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import {

  Menu as MenuIcon,

}
  from '@mui/icons-material'
import { ClipLoader } from 'react-spinners';

// const onEditPath = (e) => {
//   console.log(e)
// }
// const onCreate = (e) => {
//   console.log(e)
// }
// const onDeleted = (e) => {
//   console.log(e)
// }
// const Component = () => (
//   <FeatureGroup>
//     <EditControl
//       position='topright'
//       onEdited={onEditPath}
//       onCreated={onCreate}
//       onDeleted={onDeleted}
//       draw={{
//         rectangle: false
//       }}
//     />
//   </FeatureGroup>
// );

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://arecgis.nberic.org:31123/">
        MMSU-ArecGIS
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

//table start
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))
//table end

function App() {

  // const [newPolygon, setNewPolygon] = useState([])
  // const [newPolyline, setNewPolyline] = useState([])
  const [energyFlow, setEnergyFlow] = useState(1)
  const [powerFlow, setPowerFlow] = useState(1)
  const [weather, setWeather] = useState(1)
  const [mode, setMode] = useState(1)
  const [oldMode, setOldMode] = useState(mode)
  const [xValues, setXValues] = useState(null)

  const [featureId, setFeatureId] = useState('')
  const [building, setBuilding] = useState('')
  const [demand, setDemand] = useState(0)
  const [energy, setEnergy] = useState(0)
  const [capacity, setCapacity] = useState(0)
  const [generation, setGeneration] = useState(0)
  const [eStorage, setEStorage] = useState(0)
  const [res, setRes] = useState(0)
  const [canSave, setCanSave] = useState(false)
  const [loading, setLoading] = useState(false)

  const [dummy, setDummy] = useState("none")
  const [items, setItems] = useState("none")
  const [active, setActive] = useState(false)
  const [checked, setChecked] = useState(false)
  const [red, setRed] = useState([])
  const [green, setGreen] = useState([])


  const [openDrawer, setDrawer] = useState(false)

  // let combined = red.concat(green)

  let uniqueRed = [...new Set(red)];
  let uniqueGreen = [...new Set(green)];

  console.log(uniqueGreen)
  console.log(uniqueRed)
  


  const handleDrawerOpen = () => {
    setDrawer(true)
  }
  const handleDrawerClose = () => {
    setDrawer(false)
  }

  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, {

      // className: 'button', // Assign a unique CSS class for each feature
    });
  };

  // const [selectedFeatureId, setSelectedFeatureId] = useState(null);
  const geoJsonLayerRef = useRef(null);


  const applyParam = () => {

  let buffer = dummy
  buffer[featureId].properties.demandWDDay = demand
  buffer[featureId].properties.energyWDDay = energy
  buffer[featureId].properties.capacity = capacity
  buffer[featureId].properties.generation = generation
  buffer[featureId].properties.energyStorage = eStorage
  buffer[featureId].properties.res = res
  setItems(buffer)

  setCanSave(false)
}

  const onDemandChanged = (e) => {
    setDemand(parseFloat(e.target.value))
    setCanSave(true)
  }

  const onEnergyChanged = (e) => {
    setEnergy(parseFloat(e.target.value))
    setCanSave(true)
  }

  const onCapacityChanged = (e) => {
    setCapacity(parseFloat(e.target.value))
    setCanSave(true)
  }

  const onGenerationChanged = (e) => {
    setGeneration(parseFloat(e.target.value))
    setCanSave(true)
  }

  const onEStorageChanged = (e) => {
    setEStorage(parseFloat(e.target.value))
    setCanSave(true)
  }
  const onResChanged = (e) => {
    setRes(parseFloat(e.target.value))
    setCanSave(true)
  }

  useEffect(() => {

      let newItems = []
      if(items!=='none'){
        Object.values(items).map((object, index) => {
          newItems = [...newItems, {
            ...object, properties: {
              ...object.properties,
              id: index,
              demandWDDay: oldMode != mode ? object?.properties?.demandWDDay * powerFlow * mode : object?.properties?.demandWDDay * powerFlow,
              energyWDDay: object?.properties?.energyWDDay * energyFlow * powerFlow,
              capacity: object?.properties?.capacity,
              generation: object?.properties?.capacity * 4.7 * energyFlow * weather * energyFlow * powerFlow,
              res: mode==0.2 ?  (object?.properties?.energyStorage * 0.8 * energyFlow * powerFlow) - (object?.properties?.energyWDNight * energyFlow * powerFlow) : 
              (object?.properties?.capacity * 4.7 * energyFlow * weather * energyFlow * powerFlow) < (object?.properties?.energyWDDay * energyFlow * powerFlow) ? 
              (object?.properties?.capacity * 4.7 * energyFlow * weather * energyFlow * powerFlow + (object?.properties?.energyStorage*0.8)) - (object?.properties?.energyWDDay * energyFlow * powerFlow) : 
              (object?.properties?.capacity * 4.7 * energyFlow * weather * energyFlow * powerFlow) - (object?.properties?.energyWDDay * energyFlow * powerFlow)
            }
          }]
        })
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          setDummy(newItems)
          setDemand(oldMode != mode ? items[featureId]?.properties?.demandWDDay * powerFlow * mode : items[featureId]?.properties?.demandWDDay * powerFlow)
          setCapacity(items[featureId]?.properties?.capacity)
          if(mode===0.2){
            setGeneration(0)
            setEnergy(items[featureId]?.properties?.energyWDNight * energyFlow * powerFlow)
            setRes( (items[featureId]?.properties?.energyStorage * 0.8 * energyFlow * powerFlow) - (items[featureId]?.properties?.energyWDNight* energyFlow * powerFlow))
            console.log("night")
          }else if((items[featureId]?.properties?.capacity * 4.7 * energyFlow * weather * energyFlow * powerFlow) < (items[featureId]?.properties?.energyWDDay * energyFlow * powerFlow)){
            setEnergy(items[featureId]?.properties?.energyWDDay * energyFlow * powerFlow)
            setGeneration(items[featureId]?.properties?.capacity * 4.7 * energyFlow * weather)
            setRes((items[featureId]?.properties?.capacity * 4.7 * energyFlow * weather * energyFlow * powerFlow + (items[featureId]?.properties?.energyStorage*0.8)) - (items[featureId]?.properties?.energyWDDay * energyFlow * powerFlow))
            console.log("gen < demand")
          }
          else{
            setEnergy(items[featureId]?.properties?.energyWDDay * energyFlow * powerFlow)
            setGeneration(items[featureId]?.properties?.capacity * 4.7 * energyFlow * weather)
            setRes((items[featureId]?.properties.capacity * 4.7 * energyFlow * weather * energyFlow * powerFlow) - (items[featureId]?.properties.energyWDDay * energyFlow * powerFlow))
            console.log("kababaan")
          }
          setEStorage(items[featureId]?.properties?.energyStorage)
        }, 3000)
        setOldMode(mode)
        setRed([])
        setGreen([])
        setCanSave(true)
      }

    
  }, [energyFlow, powerFlow, mode, weather])




  const onEachFeature = (feature, layer) => {
    
    if (feature.properties?.description === 'T3') {
      layer.setStyle({ radius: 6, className: 't3' })
    }
    
    else if (feature.properties?.description === 'T1') {
      layer.setStyle({ radius: 6, className: 't1' })
    } else if (feature.properties?.description === 'solar' && feature.properties?.res >= 0) {
      layer.setStyle({ className: 'solarBuildingGn' })
      
      // green.push(feature.properties?.con)
       

    } else if (feature.properties?.description === 'solar' && feature.properties?.res < 0) {
      layer.setStyle({ className: 'solarBuildingRd' })
      
      // red.push(feature.properties?.con)


    }else if (feature.geometry.type === 'Polygon') {
      layer.setStyle({ className: 'building' })
    } else {
      layer.setStyle({ radius: 5, className: 'linePost' })
    }
    if (feature.geometry.type === 'LineString') {
      layer.setStyle({ className: 'lineForward' })
    }

    if(feature.properties.name==='CKT7C-KWHR'){
      layer.setStyle({ className: 'notMoving' })
    }
    if(feature.properties.name==='CKT 7C INEC'){
      layer.setStyle({ radius: 10, className: 'bigCirc' })
    }
    if(feature.properties.name==='KWHR METER'){
      layer.setStyle({ radius: 10, className: 'bigCirc' })
   
    }
    if(feature.properties?.description === 'solar'){
      if(feature.properties?.group=="COE-CAB-CAS-NBERIC-RDE"){
        const add = []
      add.push([])
      console.log(add)
      }
    }

    uniqueRed.map((val)=>{
      if(feature.geometry.type === 'LineString'){
        if(val===feature.properties?.con){
          layer.setStyle({ className: 'lineReverse' })
        }

 
      }
    })



    // feature.properties.id=
    // Bind a click event to each feature
    layer.on('click', (e) => {
      setFeatureId(feature?.properties?.id)
      setBuilding(feature?.properties?.name)
   
  
    });

    
    
    // Access the properties of each feature
    const { name } = feature.properties;

    // Bind a popup to each feature
    layer.bindPopup(`<b>${name}</b>`)
  };

  useEffect(() => {
    let newItems = []
    mmsu.features.map((object, index) => {
      newItems = [...newItems, { ...object, properties: { id: index, ...object.properties } }]
      if(object.properties?.description==="solar"&&object.properties?.res<0){
        setRed(prevArray=>[...prevArray, object.properties?.con])
      }
    })
    setItems(newItems)
    setDummy(newItems) 
  }, [])

  useEffect(() => {
    const geoJsonLayer = geoJsonLayerRef.current;
    if (geoJsonLayer) {
      geoJsonLayer.eachLayer((layer) => {
        // const isSelected = layer.feature.geometry.type === 'LineString'
        // const isSolarBldg = layer.feature.geometry.type === 'Polygon'
        // const isSelected = layer.feature.properties.Name === selectedFeatureId;

        // const element = layer.getElement();
        // if(isSolarBldg && layer.feature.properties?.res<0){
        //   L.DomUtil.addClass(element, 'solarBuildingRd');
        // }if(isSolarBldg && layer.feature.properties?.res>=0){
        //   L.DomUtil.removeClass(element, 'solarBuildingRd');
         
        // }
        if(layer.feature.properties?.description === 'solar'){
          if(layer.feature.properties?.res < 0){
            setRed(prevArray =>[...prevArray, layer.feature.properties?.con])
          }

        }
        // if(layer.feature.properties?.description === 'solar'){
        //   if(layer.feature.properties?.res >= 0){
        //     setGreen(prevArray => [...prevArray, layer.feature.properties?.con])
            
        //   }
        // }

        // console.log(layer.feature.properties?.res)

        
        // if (isSelected && checked) {
        //   L.DomUtil.addClass(element, 'lineForward');
        // } else {
        //   L.DomUtil.removeClass(element, 'lineForward');
        // }
      });
    }
    
  }, [checked, items])

  const onResetClicked = () => {
  
    // let resetItems = []
    // mmsu.features.map((object, index) => {
    //   resetItems = [...resetItems, { ...object, properties: { id: index, ...object.properties } }]
    //   // setDemand(object.properties?.demandWDDay)
    //   // setCapacity(object.properties?.capacity)
    //   // setEnergy(object.properties?.energyWDDay)
    //   // setGeneration(object.properties?.generation)
    //   // setEStorage(object.properties?.energyStorage)

    // })
    // setItems(resetItems)

    setDemand(mmsu?.features[featureId]?.properties?.demandWDDay)
    setCapacity(mmsu?.features[featureId]?.properties?.capacity)
    setEnergy(mmsu?.features[featureId]?.properties?.energyWDDay)
    setEStorage(mmsu?.features[featureId]?.properties?.energyStorage)
    setRes(mmsu?.features[featureId]?.properties?.res)
    // console.log(featureId)
    setCanSave(true)
    setEnergyFlow(1)
    setPowerFlow(1)
    setWeather(1)
    setMode(1)
    setItems("none")
    // setDemand('')
    // setEnergy('')
    // setCapacity('')
    // setGeneration('')
    // setEStorage('')
    // console.log(items)
    let newItems = []
    mmsu.features.map((object, index) => {
      newItems = [...newItems, { ...object, properties: { id: index, ...object.properties } }]
    })
    setItems(newItems)
    setDummy(newItems) 

  }



  const mapContainer = (
    <>
    <CssBaseline/>
      <MapContainer
        style={{ height: "100vh" }}
        center={[18.0602427983358, 120.5481625562414]}
        zoom={16}
        scrollWheelZoom={true}
        doubleClickZoom={false}
      >
        <LayersControl position="topleft">
        <LayersControl.BaseLayer checked  name="Google Map Satellite">
            <LayerGroup>
              <TileLayer
                attribution="Google Maps Satellite"
                url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
              />
              <TileLayer url="https://www.google.cn/maps/vt?lyrs=y@189&gl=cn&x={x}&y={y}&z={z}" />
            </LayerGroup>
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Esri ArcGIS World Imagery">
            <TileLayer
              // attribution="Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
              className="basemap"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <GeoJSON
          key={Math.random()}
          ref={geoJsonLayerRef}
          data={[...items]}
          onEachFeature={onEachFeature}
          pointToLayer={pointToLayer}
          eventHandlers={{
            click: (e) => {
              if(dummy[e?.layer?.feature.properties.id]?.geometry.type == "Polygon"){
                setDrawer(true)
              }
              setDemand(dummy[e?.layer?.feature.properties.id]?.properties?.demandWDDay)
              setCapacity(dummy[e?.layer?.feature.properties.id]?.properties?.capacity)
              setGeneration(dummy[e?.layer?.feature.properties.id]?.properties?.generation)
              setRes(dummy[e?.layer?.feature.properties.id]?.properties?.res)
              if(mode===0.2){
                setEnergy(e?.layer?.feature.properties?.energyWDNight )
              }
              else{
                setEnergy(e?.layer?.feature.properties?.energyWDDay)
              }

              // if(mode==0.2){
              //   setGeneration(0)
              //   setEnergy(dummy[e?.layer?.feature.properties.id]?.properties?.energyWDNight)
              //   setRes( (dummy[e?.layer?.feature.properties?.id].properties.energyStorage*0.8)-dummy[e?.layer?.feature.properties.id]?.properties?.energyWDNight )
              // }else{
              //   setEnergy(dummy[e?.layer?.feature.properties.id]?.properties?.energyWDDay)
              //   setGeneration(dummy[e?.layer?.feature.properties.id]?.properties?.capacity * 4.7 * energyFlow * weather)
              //   setRes((dummy[e?.layer?.feature.properties.id]?.properties?.capacity * 4.7 * energyFlow * weather + (dummy[e?.layer?.feature.properties.id]?.properties?.energyStorage*0.8)) - dummy[e?.layer?.feature.properties.id]?.properties?.energyWDDay)
              // }
              setEStorage(dummy[e?.layer?.feature.properties.id]?.properties?.energyStorage)
              // setDemand(dummy[featureId]?.properties?.demandWDDayyyy)
            

            },
          }}
        />
        <Control prepend position="topright">
          <Button
            variant="contained"
            onClick={handleDrawerOpen}
            sx={{color: '#000', 
                 backgroundColor: '#fff',
                 '&:hover': {
                  color: 'red',
                  backgroundColor: 'white',
                },
            }}
          >
            <MenuIcon />
          </Button>
          <Drawer anchor={"right"} open={openDrawer} onClose={handleDrawerClose}>
            <Box sx={{ width: 380 }} role="presentation">
              <Box
                sx={{
                  my: 4,
                  mx: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    Energy flow
                  </Grid>
                  <Grid item xs={8}>
                    <Select
                      size="small"
                      fullWidth
                      value={energyFlow}
                      onChange={(e) => setEnergyFlow(e.target.value)}
                    >
                      <MenuItem value={1}>Daily</MenuItem>
                      <MenuItem value={30}>Monthly</MenuItem>
                      <MenuItem value={365}>Yearly</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs>
                    Power flow
                  </Grid>
                  <Grid item xs={8}>
                    <Select
                      size="small"
                      fullWidth
                      value={powerFlow}
                      onChange={(e)=>setPowerFlow(e.target.value)}
                    >
                      <MenuItem value={1}>Weekdays</MenuItem>
                      <MenuItem value={0.3}>Weekend</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs>
                    Weather Condition
             
                  </Grid>
                  <Grid item xs={8}>
                    <Select
            size="small"
                      fullWidth
                      value={weather}
                      onChange={(e) => setWeather(e.target.value)}
                      disabled={mode===0.2}
                    >
                      <MenuItem value={1}         >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src='/sunny.svg' height={"25px"} style={{ paddingRight: "5px" }}></img>
                          <div>Clear Sky</div>
                        </div>
                      </MenuItem>
                      <MenuItem value={0.7}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src='/cloudy.svg' height={"25px"} style={{ paddingRight: "5px" }}></img>
                          <div>Cloudy</div>
                        </div>
                      </MenuItem>
                      <MenuItem value={0.5}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src='/mostlycloudy.svg' height={"25px"} style={{ paddingRight: "5px" }}></img>
                          <div>Mostly Cloudy</div>
                        </div>
                      </MenuItem>

                      <MenuItem value={0.15}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src='/darksky.svg' height={"25px"} style={{ paddingRight: "5px" }}></img>
                          <div>Dark Sky</div>
                        </div>
                      </MenuItem>
                      <MenuItem value={0.07}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src='/rainy.svg' height={"30px"} style={{ paddingRight: "5px" }}></img>
                          <div>Rainy</div>
                        </div>
                      </MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs>
                    Mode
                  </Grid>
                  <Grid item xs={8}>
                    <Select
                      size="small"
                      fullWidth
                      value={mode}
                      onChange={(e) => {
                        setMode(e.target.value)
                        setOldMode(mode)
                      }
                      }
                    >
                      <MenuItem value={1}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src='/sunny.svg' height={"25px"} style={{ paddingRight: "5px" }}></img>
                          <div>Day</div>
                        </div>
                      </MenuItem>
                      <MenuItem disabled={powerFlow===0.3} value={0.2}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src='/night.svg' height={"20px"} style={{ paddingRight: "10px" }}></img>
                          <div>Night</div>
                        </div>
                      </MenuItem>
                    </Select>
                  </Grid>

                  
                </Grid>


                {/* <Copyright sx={{ mt: 5 }} /> */}
              </Box>
              <ClipLoader
                color='#000'
                loading={loading}
                size={30}
                aria-label="Loading Spinner"
                data-testid="loader"
              />
              <TableContainer component={Paper}>
          <Table sx={{ minWidth: 250 }} size="small" >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" colSpan={3}>
                        {building}
                      </TableCell>
                    </TableRow>
                  </TableHead>
            <TableBody >
                    
              {/* <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>line direction</StyledTableCell>
                <StyledTableCell align="left">
                  <Switch checked={checked} onChange={(e)=>setChecked(e.target.checked)} />
                </StyledTableCell>
              </StyledTableRow> */}
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Demand</StyledTableCell>
                <StyledTableCell align="left">
                  <TextField
                    id="outlined-size-small"
                    value={demand || ""}
                    size="small"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kW</InputAdornment>,
                    }}
                    sx={{ width: '25ch' }}
                    onChange={onDemandChanged}
                  />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Energy consumption</StyledTableCell>
                <StyledTableCell align="left">
                  <TextField
                    id="outlined-size-small"
                    value={energy || ""}
                    size="small"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                    }}
                    sx={{ width: '25ch' }}
                    onChange={onEnergyChanged}
                  />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Solar Capacity</StyledTableCell>
                <StyledTableCell align="left">
                  <TextField
                    id="outlined-size-small"
                    value={capacity || ""}
                    size="small"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kWp</InputAdornment>,
                    }}
                    sx={{ width: '25ch' }}
                    onChange={onCapacityChanged}
                  />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Generation</StyledTableCell>
                <StyledTableCell align="left">
                  <TextField
                    id="outlined-size-small"
                    value={generation || ""}
                    size="small"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                    }}
                    sx={{ width: '25ch' }}
                    onChange={onGenerationChanged}
                  />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Energy Storage</StyledTableCell>
                <StyledTableCell align="left">
                  <TextField
                    id="outlined-size-small"
                    value={eStorage || ""}
                    size="small"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                    }}
                    sx={{ width: '25ch' }}
                    onChange={onEStorageChanged}
                  />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Net energy</StyledTableCell>
                <StyledTableCell align="left">
                  <TextField
                    id="outlined-size-small"
                    value={res || ""}
                    size="small"
                    type="number"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                    }}
                    sx={{ width: '25ch' }}
                    onChange={onResChanged}
                  />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                  <TableCell align="center" colSpan={2}>
                  <Button variant="contained" disabled={!canSave} onClick={()=>applyParam(featureId ,demand, energy, capacity, generation, energyFlow, powerFlow, mode, weather, res)}>Apply Changes</Button>
                </TableCell>
              </StyledTableRow>
            </TableBody>

          </Table>
        </TableContainer>
        <Button variant="text" onClick={onResetClicked}>reset</Button>
            </Box>
          </Drawer>
        </Control>
      </MapContainer>
      {/* <Legend/> */}
    </>
  )
  // let polygon
  // for (polygon = 0; polygon < luzon.features.length; polygon++) {
  //   var coordinates = luzon.features[polygon].geometry.coordinates;
  //   if (luzon.features[polygon].geometry.type === 'Polygon') {
  //     var coordinates = luzon.features[polygon].geometry.coordinates;
  //     var stringCoordinates = JSON.stringify(coordinates);

  //     var sliceCoordinates1 = stringCoordinates.slice(2);
  //     var sliceCoordinates2 = sliceCoordinates1.slice(0, -2);
  //     var array = JSON.parse("[" + sliceCoordinates2 + "]");

  //     var a = array

  //     var b = []
  //     for (var i = 0; i < a.length; i++) {
  //       b.push([a[i][1], a[i][0]]);

  //     }
  //     newPolygon.push(b)

  //   }
  // }

  // let polyline
  // for (polyline = 0; polyline < luzon.features.length; polyline++) {
  //   var coordinates = luzon.features[polyline].geometry.coordinates;
  //   if (luzon.features[polyline].geometry.type === 'LineString') {
  //     var coordinates = luzon.features[polyline].geometry.coordinates;
  //     var stringCoordinates = JSON.stringify(coordinates);

  //     var sliceCoordinates1 = stringCoordinates.slice(1);
  //     var sliceCoordinates2 = sliceCoordinates1.slice(0, -1);
  //     var array = JSON.parse("[" + sliceCoordinates2 + "]");

  //     var a = array

  //     var b = []
  //     for (var i = 0; i < a.length; i++) {
  //       b.push([a[i][1], a[i][0]]);

  //     }
  //     newPolyline.push(b)
  //   }
  // }

  // let marker
  // for (marker = 0; marker < luzon.features.length; marker++) {
  //   var coordinates = luzon.features[marker].geometry.coordinates;
  //   if (luzon.features[marker].geometry.type === 'Point') {
  //     var coordinates = luzon.features[marker].geometry.coordinates;
  //     var stringCoordinates = JSON.stringify(coordinates);

  //     var array = JSON.parse("[" + stringCoordinates + "]");

  //     var a = array

  //     var b = []
  //     for (var i = 0; i < a.length; i++) {
  //       b.push([a[i][1], a[i][0]]);

  //     }
  //     newMarker.push(b)
  //   }
  // }
  // useEffect(()=>{
  //   luzon.features.map((e)=>{
  //     console.log(e.geometry.type==='LineString')
  //   })
  // },[])
  return (
    <>
      {items === "none" ? <h1>Loading... </h1> : mapContainer}
    </>
  );
}

export default App