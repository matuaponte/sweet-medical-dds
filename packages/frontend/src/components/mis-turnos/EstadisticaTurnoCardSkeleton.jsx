import Skeleton from "@mui/material/Skeleton";
import "./EstadisticaTurnoCard.css";

export default function EstadisticaTurnoCardSkeleton() {
    return (
        <article className="stat-card">
            <Skeleton
                variant="rounded"
                width={38}
                height={38}
            />

            <Skeleton
                width="45%"
                height={50}
                sx={{ marginTop: "12px" }}
            />

            <Skeleton
                width="70%"
                height={25}
            />
        </article>
    );
}