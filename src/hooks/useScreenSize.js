import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const useScreenSize = () => {
    const theme = useTheme();

    const isMobileView = useMediaQuery(theme.breakpoints.down("sm"));
    const isTabletView = useMediaQuery(theme.breakpoints.between("sm", "md"));

    return [isMobileView, isTabletView];
};

export default useScreenSize;
