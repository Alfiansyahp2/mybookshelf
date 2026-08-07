const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, 'src', 'components', 'decorations', 'DecorationSystem.tsx');
const content = fs.readFileSync(srcPath, 'utf8');

const typesMatch = content.match(/(\/\/ ── Types ─────────────────────────────────────────────────[\s\S]*?)(\/\/ ── Decoration catalogue)/);
const catalogueMatch = content.match(/(\/\/ ── Decoration catalogue \(label \+ emoji\) ─────────────────[\s\S]*?)(\/\/ ── Individual CSS decoration renderers)/);
const renderersMatch = content.match(/\/\/ ── Individual CSS decoration renderers ──────────────────\s*([\s\S]*?)(?=export function renderDecoration)/);

// 1. Write Types
if (typesMatch) {
    const typesOut = `export type DecorationKind =
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
`;
    fs.mkdirSync(path.join(__dirname, 'src', 'types'), {recursive: true});
    fs.writeFileSync(path.join(__dirname, 'src', 'types', 'decorations.ts'), typesOut);
}

// 2. Write Constants
if (catalogueMatch) {
    const constOut = `import { DecorationKind } from "../types/decorations";\n\n` + catalogueMatch[1];
    fs.mkdirSync(path.join(__dirname, 'src', 'constants'), {recursive: true});
    fs.writeFileSync(path.join(__dirname, 'src', 'constants', 'decorations.ts'), constOut);
}

// 3. Write Items
if (renderersMatch) {
    const renderersCode = renderersMatch[1];
    const functions = renderersCode.split(/^function /gm);
    
    fs.mkdirSync(path.join(__dirname, 'src', 'components', 'decorations', 'items'), {recursive: true});
    for (let fn of functions) {
        if (!fn.trim()) continue;
        const nameMatch = fn.match(/^([A-Za-z0-9_]+)/);
        if (nameMatch) {
            const name = nameMatch[1];
            const imports = `import { motion } from "framer-motion";\nimport { useState, useEffect } from "react";\n\n`;
            fs.writeFileSync(
                path.join(__dirname, 'src', 'components', 'decorations', 'items', name + '.tsx'),
                imports + 'export default function ' + fn
            );
        }
    }
}

// 4. Rewrite DecorationSystem.tsx
const newSys = `import { ShelfDecoration } from "../../types/decorations";
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
`;
fs.writeFileSync(srcPath, newSys);
console.log("Done");
