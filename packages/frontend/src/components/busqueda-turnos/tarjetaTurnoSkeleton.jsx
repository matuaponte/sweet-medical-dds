import Skeleton from "@mui/material/Skeleton";

export default function TarjetaTurnoSkeleton() {
    return (
        <div className="tarjeta-turno">
            <div className="info-principal">
                <Skeleton
                    variant="circular"
                    width={56}
                    height={56}
                />

                <div style={{ flex: 1 }}>
                    <Skeleton width="60%" height={28} />
                    <Skeleton width="40%" />
                    <Skeleton width="50%" />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 8,
                    }}
                >
                    <Skeleton width={80} />
                    <Skeleton width={120} />
                    <Skeleton width={100} />
                </div>
            </div>

            <Skeleton
                height={1}
                sx={{ my: 2 }}
            />

            <div
                style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                }}
            >
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                        key={i}
                        variant="rounded"
                        width={90}
                        height={50}
                    />
                ))}
            </div>
        </div>
    );
}