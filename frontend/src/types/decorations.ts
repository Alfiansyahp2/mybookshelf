export type DecorationKind =
    | "candle"
    | "candle_pair"
    | "plant_pot"
    | "plant_hanging"
    | "vase_tall"
    | "vase_round"
    | "frame_photo"
    | "bookend_L"
    | "clock_small"
    | "clock_digital"
    | "mug"
    | "lantern"
    | "succulent"
    | "cat_sleep"
    | "cat_sit";

export interface ShelfDecoration {
    id: string;
    kind: DecorationKind;
    slot: "left" | "right";
    customData?: any;
}

export function addDecoration(
    list: ShelfDecoration[],
    kind: DecorationKind,
    slot: "left" | "right",
    customData?: any,
): ShelfDecoration[] {
    const filtered = list.filter((d) => d.slot !== slot);
    const next: ShelfDecoration = {
        id: String(Date.now()),
        kind,
        slot,
        customData,
    };
    return [...filtered, next];
}

export function removeDecoration(
    list: ShelfDecoration[],
    slot: "left" | "right",
): ShelfDecoration[] {
    return list.filter((d) => d.slot !== slot);
}
