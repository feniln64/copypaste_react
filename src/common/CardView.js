import Card from 'react-bootstrap/Card';
import ReactQuill from 'react-quill';
import { MdDeleteForever } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { Button } from 'react-bootstrap';
import { Box, Typography, Button as MUIButton } from '@mui/material';
import { useState } from 'react';
const modules = {
    toolbar: [
    ],
};
const formats = [];
const CardView = (props) => {
    const [isHovered, setIsHovered] = useState(false);
    return (

        <>
            {/* <Card id={props._id} style={{ width: '18rem' }}>
                <Card.Body>
                    <Button className='mt-2'  onClick={() => props.editContent(props._id)}><RiEditBoxFill /></Button>{' '}
                    <Button className='mt-2'  variant="danger" onClick={() => props.deleteContent(props._id)}><MdDeleteForever /></Button>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>
                        <ReactQuill
                            modules={modules}
                            formats={formats}
                            style={{ height: "auto", border: "none" }}
                            readOnly={true}
                            value={props.content}
                        />
                    </Card.Text>
                </Card.Body>
            </Card> */}
            <Box 
                sx={{
                    padding: "10px 20px", display: "flex", flexDirection: "column", gap: "15px", background: "#fff",
                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Typography>{props.title}</Typography>
                <Box>
                    <ReactQuill
                        modules={modules}
                        formats={formats}
                        style={{ height: "auto", border: "none" }}
                        readOnly={true}
                        value={props.content}
                    />
                </Box>
                    <Box sx={{display: "flex", visibility: isHovered ? "visible" : "hidden", gap: "10px"}}>
                        <MUIButton 
                            variant='contained'
                            onClick={() => props.editContent(props._id)}
                            sx={{
                                maxWidth: "56px",
                                width: "40px",
                                height: "40px",
                                minWidth: "auto",
                                padding: "6px 0px !important",
                            }}
                        >
                            <RiEditBoxFill />
                        </MUIButton>
                        <MUIButton 
                            variant='contained'
                            sx={{
                                maxWidth: "56px",
                                width: "40px",
                                height: "40px",
                                minWidth: "auto",
                                padding: "6px 0px !important",
                                background: (theme) => theme.palette.error.main,
                                ":hover": {
                                background: (theme) => theme.palette.error.main,
                                }
                            }} 
                            onClick={() => props.editContent(props._id)}>
                            <MdDeleteForever />
                        </MUIButton>
                    </Box>
            </Box>

        </>

    );
}

export default CardView;