const colorMapping = JSON.parse(`{
    "braun": "#7b3f00",
    "grau": "#6c757d",
    "weiß": "#fff", 
    "schwarz": "#212529", 
    "rot": "#dc3545", 
    "grün": "#198754", 
    "blau": "#0d6efd", 
    "gelb": "#ffc107",
    "orange": "#fd7e14"
  }`);

export const parseColors = (colors) => {
  let foundColors = [];
  if (colors) {
    // Farben sind wiefolgt aufgebaut:
    // 'color' | 'color Ring' | 'color/color2' | 'color/color2 Ring'

    let parsedRawColors = colors.split('/');
    parsedRawColors.forEach(color => {
      const splittedColor = color.trim().split(' ');

      // If there is nothing left, return
      if (splittedColor.length <= 0) return;

      // Get color at first position
      const mappedColor = colorMapping[splittedColor[0]];
      // If there is no color, return
      if (!mappedColor) return;

      // Get color variant, default is 'Kopf'
      const variant = splittedColor.length > 1 ? splittedColor[1] : 'Kopf';
      foundColors.push({
        color: mappedColor,
        variant
      })
    });
  }
  return foundColors;
}

export const stringToPastelColor = (inputString) => {

  if (!inputString) {
    return '';
  }


  //TODO: adjust base colour values below based on theme
  var baseRed = 200;
  var baseGreen = 128;
  var baseBlue = 128;

  //lazy seeded random hack to get values from 0 - 256
  //for seed just take bitwise XOR of first two chars
  var seed = inputString.charCodeAt(0) ^ inputString.charCodeAt(1);
  var rand_1 = Math.abs((Math.sin(seed++) * 10000)) % 256;
  var rand_2 = Math.abs((Math.sin(seed++) * 10000)) % 256;
  var rand_3 = Math.abs((Math.sin(seed++) * 10000)) % 256;

  //build colour
  var red = Math.round((rand_1 + baseRed) / 2);
  var green = Math.round((rand_2 + baseGreen) / 2);
  var blue = Math.round((rand_3 + baseBlue) / 2);

  return `rgb(${red},${green},${blue})`;
}

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}
