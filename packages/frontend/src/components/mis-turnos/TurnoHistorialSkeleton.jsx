import Skeleton from "@mui/material/Skeleton";
import "./TurnoCard.css";

export default function TurnoHistorialSkeleton() {
    return (
        <article className="turno-card-historial">
            <div className="historial-info">
                <Skeleton
                    variant="rounded"
                    width={52}
                    height={52}
                />

                <div>
                    <Skeleton width={180} height={28} />
                    <Skeleton width={220} height={20} />
                </div>
            </div>

            <Skeleton
                variant="rounded"
                width={130}
                height={42}
            />
        </article>
    );
}