import Skeleton from "@mui/material/Skeleton";

export default function TurnoCardSkeleton() {
    return (
        <div className="turno-card">
            <div className="turno-main">
                <Skeleton
                    variant="rounded"
                    width={72}
                    height={72}
                />

                <div style={{ flex: 1 }}>
                    <Skeleton width="40%" height={35} />
                    <Skeleton width="25%" height={25} />

                    <Skeleton width="80%" height={30} />

                    <Skeleton width="30%" height={35} />
                </div>
            </div>
        </div>
    );
}