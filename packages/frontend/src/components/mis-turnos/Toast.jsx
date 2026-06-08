import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import "./Toast.css";

export default function Toast({ mensaje, visible }) {
    if (!visible) return null;

    return (
        <div className="toast-success">
            <CheckCircleRoundedIcon />
            <span>{mensaje}</span>
        </div>
    );
}