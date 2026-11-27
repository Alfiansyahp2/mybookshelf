import Candle from "./Candle";

export default function CandlePair() {
    return (
        <div style={{ display: "flex", gap: 5, alignItems: "flex-end" }}>
            <Candle />
            <Candle scale={0.8} />
        </div>
    );
}
