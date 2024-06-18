const lightenHexColor = (hex, percent) =>
{
// Remove the hash symbol if present
    hex = hex.replace(/^#/, '');

    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Adjust RGB values
    r = Math.round(Math.min(255, r + 255 * percent));
    g = Math.round(Math.min(255, g + 255 * percent));
    b = Math.round(Math.min(255, b + 255 * percent));

    // Convert RGB back to hex
    const result = ((r << 16) | (g << 8) | b).toString(16);

    // Make sure result has 6 digits
    return '#' + result.padStart(6, '0');
}

const darkenHexColor = (hex, percent) => 
{
    // Remove the hash symbol if present
    hex = hex.replace(/^#/, '');

    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Calculate the darkened RGB values
    r = Math.round(Math.max(0, r - 255 * percent));
    g = Math.round(Math.max(0, g - 255 * percent));
    b = Math.round(Math.max(0, b - 255 * percent));

    // Convert RGB back to hex
    const result = ((r << 16) | (g << 8) | b).toString(16);

    // Make sure result has 6 digits
    return '#' + result.padStart(6, '0');
};


const generateShades = (colors) => 
{
    for (let color in colors) 
    {   
        let hex = colors[color]
        let extended = {}
        const shades = [ 50, 100, 200, 300, 400, 500, 600, 700, 900, 950 ];

        for (let i = 0; i < shades.length; i++) 
        {
            let shade = shades[i];
            extended[shade] = lightenHexColor(hex, shades[(shades.length - 1 - i) ] / 950);
            extended[-shade] = darkenHexColor(hex, shades[(shades.length - 1 - i) ] / 950)
        }

        colors[color] = {
            DEFAULT: hex,
            ...extended
        }
    }

    return colors;
}

module.exports = {
    generateShades,
    lightenHexColor
}
