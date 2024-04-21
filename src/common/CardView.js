import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import { MdDeleteForever } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { FaShareAlt } from "react-icons/fa";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  List,
  ListItemButton,
  ListItemIcon,
} from "@mui/material";
import { useState } from "react";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

const CardView = ({
  title,
  editContent,
  editPermission,
  deleteContent,
  content,
  _id,
  shouldEdit,
  shouldDelete,
  shouldShare,
}) => {
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
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          background: "#fff",
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
          position: "relative",
        }}
      >
        <Typography>
          {" "}
          <button
            style={{
              fontWeight: "bold",
              textTransform: "",
              border: "none",
              backgroundColor: "white",
            }}
            onClick={() => {
              editContent(_id, false);
              handleClose();
            }}
          >
            {title}
          </button>
        </Typography>
        {shouldEdit ? (
          <IconButton
            sx={{ position: "absolute", right: "0px", top: "2px" }}
            onClick={handleMenu}
          >
            <MoreVertRoundedIcon />
          </IconButton>
        ) : null}
        <Box>
          <ReactQuill
            modules={{ toolbar: false }}
            formats={[]}
            style={{ height: "auto", border: "none" }}
            readOnly={true}
            value={content}
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
              onClick={() => {
                editContent(_id);
                handleClose();
              }}
            >
              <ListItemIcon sx={{ minWidth: "30px" }}>
                <RiEditBoxFill />
              </ListItemIcon>
              Edit
            </ListItemButton>
            {shouldDelete ? (
              <ListItemButton
                onClick={() => {
                  deleteContent(_id);
                  handleClose();
                }}
              >
                <ListItemIcon sx={{ minWidth: "30px", color: "red" }}>
                  <MdDeleteForever />
                </ListItemIcon>
                Delete
              </ListItemButton>
            ) : null}
            {shouldShare ? (
              <ListItemButton
                onClick={() => {
                  editPermission(_id);
                  handleClose();
                }}
              >
                <ListItemIcon sx={{ minWidth: "30px" }}>
                  <FaShareAlt />
                </ListItemIcon>
                Share
              </ListItemButton>
            ) : null}
          </List>
        </Box>
      </Menu>
    </>
  );
};

CardView.propTypes = {
  title: PropTypes.string,
  editContent: PropTypes.func,
  editPermission: PropTypes.func,
  deleteContent: PropTypes.func,
  content: PropTypes.string,
  _id: PropTypes.string,
  shouldEdit: PropTypes.bool,
  shouldDelete: PropTypes.bool,
  shouldShare: PropTypes.bool,
};

CardView.defaultProps = {
  title: "",
  editContent: () => {},
  editPermission: () => {},
  deleteContent: () => {},
  content: "",
  _id: "",
  shouldEdit: true,
  shouldDelete: true,
  shouldShare: true,
};

export default CardView;
