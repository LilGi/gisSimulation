import { Button, Dialog, IconButton, InputAdornment, Paper, Switch, Table, TableBody, TableContainer, TableHead, TableRow, TextField, styled } from "@mui/material"
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import {
  Close as CloseIcon,

} from '@mui/icons-material'
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



export const SnackBar = (props) => {
  
  const [demand, setDemand] = useState('')
  const [energy, setEnergy] = useState('')
  const [capacity, setCapacity] = useState('')
  const [generation, setGeneration] = useState('')
  
  useEffect(()=>{
    setDemand(props?.xValues?.properties?.demandWDDay)
    setEnergy(props?.xValues?.properties?.energyWDDay)
    setCapacity(props?.xValues?.properties?.capacity)
    setGeneration(props?.xValues?.properties?.generation)
  },[props])

  const switchOnChanged = (e) => {
    props.setChecked(e.target.checked);

  }
  const handleClose = () => {
    props.printx(props.xValues.properties.id ,demand, energy, capacity, generation)
    props.setActive(false)
  }

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
                <StyledTableCell>Details</StyledTableCell>
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
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Demand</StyledTableCell>
                <StyledTableCell align="left">
                  <TextField
                    id="outlined-size-small"
                    value={demand || ""}
                    size="small"
                    sx={{ width: '25ch' }}
                    // onChange={(e)=>}
                    onChange={(e)=>setDemand(e.target.value)}
                  />
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Energy</StyledTableCell>
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
                <StyledTableCell sx={{ fontWeight: "Medium" }}>Capacity</StyledTableCell>
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
                  <TableCell align="center" colSpan={2}>
                  <Button variant="contained">Contained</Button>
                </TableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </StyledDialog >
    </>
  )
}