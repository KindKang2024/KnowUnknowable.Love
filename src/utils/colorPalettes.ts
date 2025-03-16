import * as THREE from "three";

// Type definitions for color palettes
export type ColorPaletteType = 'cosmic' | 'nature' | 'yin_yang' | 'custom';

// Define the structure of our color palette
export interface ColorPalette {
    // Galaxy colors
    galaxyInside: string;
    galaxyOutside: string;

    // Divination colors
    diviPrimary: string;
    diviSecondary: string;

    // Shared accent colors
    accent: string;
    neutral: string;
}

// Color palette system for consistent theming across components
export const colorPalettes: Record<string, ColorPalette> = {
    cosmic: {
        // Galaxy colors
        galaxyInside: "#8c2eff", // Purple
        galaxyOutside: "#1b3984", // Deep blue

        diviPrimary: "#8c2eff", // Purple
        diviSecondary: "#1b3984", // Deep blue

        // Shared accent colors
        accent: "#ff5e5e", // Warm red
        neutral: "#ffffff", // White
    },

};

// Default palette
export const defaultPalette = colorPalettes.cosmic;

// Helper function to get a color palette by name
export function getPalette(name: string = 'cosmic'): ColorPalette {
    return colorPalettes[name] || defaultPalette;
}

// Helper function to create a gradient color based on palette
export function createGradientColor(
    t: number,
    insideColor: string = defaultPalette.galaxyInside,
    outsideColor: string = defaultPalette.galaxyOutside
): THREE.Color {
    const color = new THREE.Color();
    return color.lerpColors(
        new THREE.Color(insideColor),
        new THREE.Color(outsideColor),
        t
    );
}

// Function to generate a color array for particles based on count and palette
export const generateColorArray = (
    count: number,
    palette: ColorPalette = colorPalettes.cosmic as ColorPalette
): Float32Array => {
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        // Use normalized index for gradient position
        const t = i / count;
        const color = createGradientColor(t, palette.galaxyInside, palette.galaxyOutside);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    return colors;
}; 