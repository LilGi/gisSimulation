import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, GeoJSON } from 'react-leaflet'
import luzon from '../SAMPLEE.json'
import L from 'leaflet'; // Import the Leaflet library
import { SnackBar } from './Snackbar'
import mmsu from '../MMSUPRE1.json'
import { Box, Button, Checkbox, CssBaseline, Drawer, FormControl, FormControlLabel, Grid, InputLabel, Link, MenuItem, Paper, Select, TextField, Typography, styled } from '@mui/material';
import Control from 'react-leaflet-custom-control'
import {

  Menu as MenuIcon,

}
  from '@mui/icons-material'

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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function App() {

  // const [newPolygon, setNewPolygon] = useState([])
  // const [newPolyline, setNewPolyline] = useState([])
  const [energyFlow, setEnergyFlow] = useState(24)
  const [powerFlow, setPowerFlow] = useState("Weekdays")
  const [weather, setWeather] = useState(1)
  const [mode, setMode] = useState("Day")

  const [items, setItems] = useState("none")
  const [active, setActive] = useState(false)
  const [checked, setChecked] = useState(false);
  const [xValues, setXValues] = useState(null)

  const [openDrawer, setDrawer] = useState(false)

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

  const printx = (id, demand, energy, capacity, generation) => {
    let buffer = items
    buffer[id].properties.demand = demand
    buffer[id].properties.energy = energy
    buffer[id].properties.capacity = capacity
    buffer[id].properties.generation = generation
    setItems(buffer)
  }

  const onEachFeature = (feature, layer) => {
    if (feature.properties?.description === 'T3') {
      layer.setStyle({ className: 't3' })
    }
    else if (feature.properties?.description === 'T1') {
      layer.setStyle({ className: 't1' })
    } else if (feature.geometry.type === 'Polygon') {
      layer.setStyle({ className: 'building' })
    } else {
      layer.setStyle({ className: 'linePost' })
    }
    if (feature.geometry.type === 'LineString') {
      layer.setStyle({ className: 'lineReverse' })
    }

    // feature.properties.id=
    // Bind a click event to each feature
    layer.on('click', (e) => {
      // Update the selected feature when clicked
      // setSelectedFeatureId(feature.properties.name);
      setXValues(feature)
    });

    // Access the properties of each feature
    const { name } = feature.properties;

    // Bind a popup to each feature
    layer.bindPopup(`<b>${name}</b>`);
  };

  useEffect(() => {
    let newItems = []
    mmsu.features.map((object, index) => {
      newItems = [...newItems, { ...object, properties: { id: index, ...object.properties } }]
    })
    setItems(newItems)
  }, [])
  useEffect(() => {
    const geoJsonLayer = geoJsonLayerRef.current;
    if (geoJsonLayer) {
      geoJsonLayer.eachLayer((layer) => {
        const isSelected = layer.feature.geometry.type === 'LineString'

        // const isSelected = layer.feature.properties.Name === selectedFeatureId;
        const element = layer.getElement();

        // console.log(isSelected && checked)
        if (isSelected && checked) {
          L.DomUtil.addClass(element, 'lineForward');
        } else {
          L.DomUtil.removeClass(element, 'lineForward');
        }
      });
    }
  }, [checked]);

  const mapContainer = (
    <>
    <CssBaseline/>
      <MapContainer
        style={{ height: "100vh" }}
        center={[18.0582, 120.5559]}
        zoom={13}
        scrollWheelZoom={true}
        doubleClickZoom={false}
      >
        <LayersControl position="topleft">
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Esri ArcGIS World Imagery">
            <TileLayer
              attribution="Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"
              className="basemap"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="NASA Gibs Blue Marble">
            <TileLayer
              url="https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg"
              attribution="&copy NASA Blue Marble, image service by OpenGeo"
              maxNativeZoom={8}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <GeoJSON
          ref={geoJsonLayerRef}
          data={items}
          onEachFeature={onEachFeature}
          pointToLayer={pointToLayer}
          eventHandlers={{
            click: (e) => {
              setActive(true)
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
                      <MenuItem value={24}>Per Day</MenuItem>
                      <MenuItem value={730.001}>Per Month</MenuItem>
                      <MenuItem value={8760.00240024}>Per Year</MenuItem>
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
                      onChange={(e) => setPowerFlow(e.target.value)}
                    >
                      <MenuItem value="Weekdays">Weekdays</MenuItem>
                      <MenuItem value="Weekend">Weekend</MenuItem>
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
                    >
                      <MenuItem value={1}>Clear sky</MenuItem>
                      <MenuItem value={2}>Partly cloudy</MenuItem>
                      <MenuItem value={3}>Cloudy</MenuItem>
                      <MenuItem value={4}>Dark sky</MenuItem>
                      <MenuItem value={5}>Rainy</MenuItem>
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
                      onChange={(e) => setMode(e.target.value)}
                    >
                      <MenuItem value="Day">Day</MenuItem>
                      <MenuItem value="Night">Night</MenuItem>
                    </Select>
                  </Grid>
                </Grid>


                <Copyright sx={{ mt: 5 }} />
              </Box>

            </Box>
          </Drawer>
        </Control>
        <SnackBar setActive={setActive} setChecked={setChecked} active={active} checked={checked} printx={printx} xValues={xValues} />
      </MapContainer>
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