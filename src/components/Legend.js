import { Avatar, Box, Button, Dialog, Grid, IconButton, InputAdornment, Paper, Slider, Switch, Table, TableBody, TableContainer, TableHead, TableRow, TextField, Typography, styled } from "@mui/material"
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import {
    Close as CloseIcon,
    Circle as CircleIcon,
    Pentagon as PentagonIcon,

} from '@mui/icons-material'
import MuiInput from '@mui/material/Input';
import { useEffect, useState } from "react"
//table start

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: 'transparent',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: 'none'
}));




export const Legend = () => {

    return (
        <>
            <div className='leaflet-bottom leaflet-left'>
                <div className="leaflet-control">
                    <Box sx={{ flexGrow: 1, backgroundColor: '#FFFFFF' , borderRadius: '10px'}}>
                        <Grid container>
                            <Grid item xs={2} md={2}>
                                <Item><CircleIcon sx={{fontSize: 20, color: '#ff0000', stroke: '#000000'}} /></Item>
                            </Grid>
                            <Grid item xs={10} md={10}>
                                <Item sx={{ textAlign: "left" }}>Three phase transformer</Item>
                            </Grid>

                        </Grid>
                        <Grid container>
                            <Grid item xs={2} md={2}>
                                <Item><CircleIcon sx={{fontSize: 20, color: '#0051fffb', stroke: '#000000' }} /></Item>
                            </Grid>
                            <Grid item xs={10} md={10}>
                                <Item sx={{ textAlign: "left" }}>Single phase transformer</Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={2} md={2}>
                                <Item><CircleIcon sx={{fontSize: 20, color: '#d1d1d1', stroke: '#000000', }} /></Item>
                            </Grid>
                            <Grid item xs={10} md={10}>
                                <Item sx={{ textAlign: "left" }}>Line post</Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={2} md={2}>
                                <Item><PentagonIcon sx={{fontSize: 20, color: '#a8ff05', stroke: '#000000', }} /></Item>
                            </Grid>
                            <Grid item xs={10} md={10}>
                                <Item sx={{ textAlign: "left" }}>Building with Solar Energy System</Item>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={2} md={2}>
                                <Item><PentagonIcon sx={{fontSize: 20, color: '#964B00', stroke: '#000000', }} /></Item>
                            </Grid>
                            <Grid item xs={10} md={10}>
                                <Item sx={{ textAlign: "left"}}>Building</Item>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div>
        </>
    )
}