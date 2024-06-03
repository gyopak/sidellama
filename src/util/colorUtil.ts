/* eslint-disable no-bitwise */

const newShade = (hexColor: string, magnitude: number) => {
  hexColor = hexColor.replace('#', '');

  if (hexColor === 'black') {
    hexColor = '000000';
  }

  if (hexColor.length === 6) {
    const decimalColor = parseInt(hexColor, 16);

    let r = (decimalColor >> 16) + magnitude;

    if (r > 255) {
      r = 255;
    } else if (r < 0) {
      r = 0;
    }

    // eslint-disable-next-line no-bitwise
    let g = (decimalColor & 0x0000ff) + magnitude;
    if (g > 255) {
      g = 255;
    } else if (g < 0) {
      g = 0;
    }

    // eslint-disable-next-line no-bitwise
    let b = ((decimalColor >> 8) & 0x00ff) + magnitude;

    if (b > 255) {
      b = 255;
    } else if (b < 0) {
      b = 0;
    }

    // eslint-disable-next-line no-bitwise
    return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
  }

  return hexColor;
};

export const lighten = (hex: string, magnitude: number) => newShade(hex, magnitude);

export const darken = (hex: string, magnitude: number) => newShade(hex, -magnitude);

export const setOpacity = (hex: string, alpha: number) => `${hex}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
