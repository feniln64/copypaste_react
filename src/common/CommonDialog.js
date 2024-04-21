import React from "react";
import PropTypes from "prop-types";
import { CloseOutlined } from "@mui/icons-material";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
    useTheme,
} from "@mui/material";

const CommonDialog = ({ open, onClose, title, children, onClick, showFooter }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth={"md"}
            sx={{
                "& .MuiDialog-paper": {
                    borderRadius: "16px",
                    padding: "24px",
                    [theme.breakpoints.down("sm")]: {
                        borderRadius: "0",
                        padding: "12px",
                        maxWidth: "100%",
                        width: "100%",
                        margin: "0",
                        maxHeight: "100%",
                    },
                },
            }}
        >
            <DialogTitle sx={{ paddingInline: "0" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">{title}</Typography>
                    <IconButton onClick={onClose}>
                        <CloseOutlined sx={{ fill: "black" }} />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                {showFooter ? (
                    <Box sx={{display: "flex", gap: "10px"}}>
                        <Button variant="outlined" onClick={onClose} sx={{borderRadius: "8px"}}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            type={"submit"}
                            onClick={onClick}
                            sx={{borderRadius: "8px"}}
                        >
                            Submit
                        </Button>
                    </Box>
                ) : null}
            </DialogActions>
        </Dialog>
    );
};

CommonDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.node,
    onClick: PropTypes.func,
    showFooter: PropTypes.bool,
};

CommonDialog.defaultProps = {
    open: false,
    onClose: () => {},
    title: "",
    children: <div />,
    onClick: () => {},
    showFooter: true
};

export default CommonDialog;
