import { Box, Card, Icon, Typography } from '@mui/material'
import React from 'react'

const FeaturesCard = ({icon, title}) => {
    return(
        <Card sx={{ flex: 0.25, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", rowGap: "20px" }}>
            <Box sx={{
                background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                borderRadius: "14px", position: "relative"
            }}
            >
                <Box sx={{
                    background: "#3758f9", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center",
                    borderRadius: "14px", position: "absolute", transform: "rotate(25deg)", opacity: 0.25, "&:hover": {
                    transform: "rotate(45deg)"
                }
                }} />
                    <Icon sx={{ height: "37px", width: "37px", color: "white", zIndex: 2 }}>{icon}</Icon>
                </Box>
            <Typography fontWeight={600} fontSize={"24px"}>{title}</Typography>
            <Typography>Lorem Ipsum is simply dummy text of the printing and industry.</Typography>
            <Typography fontWeight={600}>Learn More</Typography>
        </Card>
)}

export default FeaturesCard
