import { ShelfDecoration } from "../../types/decorations";
export type { DecorationKind, ShelfDecoration } from "../../types/decorations";
export { addDecoration, removeDecoration } from "../../types/decorations";
export { DECORATION_CATALOGUE } from "../../constants/decorations";
import Candle from "./items/Candle";
import CandlePair from "./items/CandlePair";
import PlantPot from "./items/PlantPot";
import PlantHanging from "./items/PlantHanging";
import VaseTall from "./items/VaseTall";
import VaseRound from "./items/VaseRound";
import FramePhoto from "./items/FramePhoto";
import BookendL from "./items/BookendL";
import ClockSmall from "./items/ClockSmall";
import ClockDigital from "./items/ClockDigital";
import Mug from "./items/Mug";
import Lantern from "./items/Lantern";
import Succulent from "./items/Succulent";
import CatSleep from "./items/CatSleep";
import CatSit from "./items/CatSit";

export function renderDecoration(item: ShelfDecoration) {
    switch (item.kind) {
        case "candle": return <Candle />;
        case "candle_pair": return <CandlePair />;
        case "plant_pot": return <PlantPot />;
        case "plant_hanging": return <PlantHanging />;
        case "vase_tall": return <VaseTall />;
        case "vase_round": return <VaseRound />;
        case "frame_photo": return <FramePhoto customData={item.customData} />;
        case "bookend_L": return <BookendL />;
        case "clock_small": return <ClockSmall />;
        case "clock_digital": return <ClockDigital />;
        case "mug": return <Mug />;
        case "lantern": return <Lantern />;
        case "succulent": return <Succulent />;
        case "cat_sleep": return <CatSleep />;
        case "cat_sit": return <CatSit />;
        default: return null;
    }
}
