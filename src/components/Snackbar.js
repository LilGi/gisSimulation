import { Box, Button, Dialog, Grid, IconButton, InputAdornment, Paper, Slider, Switch, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography, styled } from "@mui/material"
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import {
  Close as CloseIcon,

} from '@mui/icons-material'
import MuiInput from '@mui/material/Input';
import { useEffect, useState } from "react"
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

const StyledDialog = styled(Dialog)(({theme}) => ({
  "& .MuiDialog-container": {
    alignItems: 'flex-end',
    justifyContent: "flex-start"
  }
}));

const PrettoSlider = styled(Slider)({
  color: '#52af77',
  height: 5,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 16,
    width: 16,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&:before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&:before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const Input = styled(MuiInput)`
  width: 42px;
`;


export const SnackBar = (props) => {
  
  const [building, setBuilding] = useState('Details')
  const [demand, setDemand] = useState(props?.xValues?.properties?.demandWDDay)
  const [energy, setEnergy] = useState(props?.xValues?.properties?.energyWDDay)
  const [capacity, setCapacity] = useState(props?.xValues?.properties?.capacity)
  const [generation, setGeneration] = useState('')
  const [eStorage, setEStorage] = useState('')
  
  useEffect(()=>{
    
    // setPowerFlowDemand(props?.xValues?.properties?.demandWDDay * props.powerFlow)
    // setPowerFlowEnergy(props?.xValues?.properties?.energyWDDay * props.powerFlow)
    setDemand(props?.xValues?.properties?.demandWDDay *props.powerFlow* props.mode)
    setEnergy(props?.xValues?.properties?.energyWDDay*props.energyFlow*props.powerFlow)
    setGeneration(props?.xValues?.properties?.capacity*4.7*props?.xValues?.properties?.generation*props.energyFlow*props.powerFlow)
    // if(props.powerFlow !== 0 || props.mode !== 0 ){
    //   setDemand(props?.xValues?.properties?.demandWDDay-powerFlowDemand-modeDemand)
    //   setEnergyConsumption(props?.xValues?.properties?.energyWDDay-powerFlowEnergy-modeEnergy)
    // }else{
    //   setDemand(props?.xValues?.properties?.demandWDDay)
    //   setEnergyConsumption(props?.xValues?.properties?.energyWDDay)
    // }
    
    setCapacity(props?.xValues?.properties?.capacity)
    setEStorage(props?.xValues?.properties?.energyStorage)
    setBuilding(props?.xValues?.properties?.name)
  },[props,energy,demand,generation])

  // console.log({energy: energy, demand: demand, generation: generation})
  const switchOnChanged = (e) => {
    props.setChecked(e.target.checked);

  }
  const handleClose = () => {
    props.printx(props.xValues.properties.id ,demand, energy, capacity, generation)
    props.setActive(false)
  }

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setDemand(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDemand(event.target.value === '' ? '' : Number(event.target.value));
  };

  const { active } = props

  return (
    <>
    <StyledDialog
        open={active}
        onClose={handleClose}
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
        PaperProps={{ sx: { mt: "50px" } }}
      >
          <TableContainer component={Paper}>
          <Table sx={{ minWidth: 250 }} size="small" >
            <TableHead>
              <TableRow>
                <StyledTableCell>{building}</StyledTableCell>
                <StyledTableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={handleClose}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody >
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>line direction</StyledTableCell>
                <StyledTableCell align="left">
                  <Switch checked={props.checked} onChange={switchOnChanged} />
                </StyledTableCell>
              </StyledTableRow>
              {/* <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Demand</StyledTableCell>
                <StyledTableCell align="left">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <PrettoSlider
                        valueLabelDisplay="auto"
                        value={typeof demand === 'number' ? demand : 0}
                        onChange={handleSliderChange}
                        min={0}
                        max={500}
                      />
                    </Grid>
                    <Grid item>
                      <Input
                        id="outlined-size-small"
                        value={demand || ""}
                        size="small"
                        onChange={handleInputChange}
                        inputProps={{
                          step: 10,
                          min: 0,
                          max: 500,
                          type: 'number',
                          'aria-labelledby': 'input-slider',
                        }}
                      />
                    </Grid>
                  </Grid>
                </StyledTableCell>
              </StyledTableRow> */}
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Demand</StyledTableCell>
                <StyledTableCell align="left">
                  <TextField
                    id="outlined-size-small"
                    value={demand || ""}
                    size="small"
                    sx={{ width: '25ch' }}
                    onChange={(e)=>setDemand(e.target.value)}
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
                    sx={{ width: '25ch' }}
                    onChange={(e)=>setEnergy(e.target.value)}
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
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kWp</InputAdornment>,
                    }}
                    sx={{ width: '25ch' }}
                    onChange={(e)=>setCapacity(e.target.value)}
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
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                    }}
                    sx={{ width: '25ch' }}
                    onChange={(e)=>setGeneration(e.target.value)}
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
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                    }}
                    sx={{ width: '25ch' }}
                    onChange={(e)=>setEStorage(e.target.value)}
                  />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                  <TableCell align="center" colSpan={2}>
                  <Button variant="contained">Ok</Button>
                </TableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </StyledDialog >
    </>
  )
}