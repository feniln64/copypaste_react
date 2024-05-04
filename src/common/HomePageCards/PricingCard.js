import React from 'react'
import useScreenSize from '../../hooks/useScreenSize'
import { Button, Card, Typography } from '@mui/material';

const PricingCard = ({price}) => {
    const [isMobileView] = useScreenSize();

    return(
    <Card sx={{ flex: 1, borderRadius: "12px", padding: isMobileView ? "40px 32px" : "56px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
        <h5>Starter</h5>
        <Typography><span style={{ fontWeight: 600, fontSize: "18px" }}>$</span> <span style={{ fontWeight: 600, fontSize: "36px" }}>{price}</span> Per Month</Typography>
        <h5>Features</h5>
        <Typography>Up to 1 User</Typography>
        <Typography>All UI components</Typography>
        <Typography>Lifetime access</Typography>
        <Typography>Free updates</Typography>
        <Button variant='contained' sx={{ borderRadius: "8px", backgroundColor: "#0d6efd", width: "fit-content", padding: "12px 28px" }}>Purchase Now</Button>
    </Card>
)}

export default PricingCard
