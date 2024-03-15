import Card from 'react-bootstrap/Card';
import ReactQuill from 'react-quill';
import { MdDeleteForever } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { FaShareAlt } from "react-icons/fa";
import { Button } from 'react-bootstrap';
import { Box, Typography, IconButton, Menu, List, ListItemButton, ListItemIcon } from '@mui/material';
import { useState } from 'react';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
const modules = {
    toolbar: [
    ],
};
const formats = [];
const CardView = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (

        <>
            <Box 
                sx={{
                    padding: "20px", display: "flex", flexDirection: "column", gap: "15px", background: "#fff",
                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px", position: "relative"
                }}
            >   
                <Typography>{props.title}</Typography>
                <IconButton sx={{ position: "absolute", right: "0px", top: "2px"}}
                onClick={handleMenu}
                ><MoreVertRoundedIcon /></IconButton>
                <Box>
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        style={{ height: "auto", border: "none" }}
                        readOnly={true}
                        value={props.content}
                    />
                </Box>
            </Box>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                keepMounted
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "12px",
                        gap: "12px",
                    }}
                >
                    <List>
                        <ListItemButton
                            onClick={() => {props.editContent(props._id); handleClose()}}
                        >
                            <ListItemIcon sx={{minWidth: "30px"}}>
                            <RiEditBoxFill />
                            </ListItemIcon>
                            Edit
                        </ListItemButton>
                        <ListItemButton
                            onClick={() => {props.deleteContent(props._id);
                            handleClose()}}
                        >
                            <ListItemIcon sx={{minWidth: "30px", color: "red"}}>
                            <MdDeleteForever />
                            </ListItemIcon>
                            Delete
                        </ListItemButton>
                        <ListItemButton
                            onClick={() => {props.editPermission(props._id);
                            handleClose()}}
                        >
                            <ListItemIcon sx={{minWidth: "30px"}}>
                            <FaShareAlt />
                            </ListItemIcon>
                            Share
                        </ListItemButton>
                    </List>
                </Box>
            </Menu>
        </>

    );
}

export default CardView;