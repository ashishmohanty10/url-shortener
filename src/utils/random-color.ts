export const randomBackgroundGenerator = () => {
  const backgrounds = [
    // Solid muted colors
    '#A3B18A',
    '#D4A373',
    '#6D6875',
    '#B5838D',
    '#84A59D',
    '#E5989B',
    '#ADC178',
    '#9A8C98',

    // Gradients
    'linear-gradient(135deg, #A3B18A, #588157)', // olive green → forest
    'linear-gradient(135deg, #D4A373, #E9C46A)', // muted orange → sand
    'linear-gradient(135deg, #84A59D, #52796F)', // teal → deep teal
    'linear-gradient(135deg, #E5989B, #FFB4A2)', // soft pink → peach
    'linear-gradient(135deg, #ADC178, #A98467)', // olive → warm brown
    'linear-gradient(135deg, #457B9D, #A8DADC)', // dusty blue → pale aqua

    // Repeating patterns
    'repeating-linear-gradient(45deg, #A3B18A, #A3B18A 10px, #D4A373 10px, #D4A373 20px)',
    'repeating-linear-gradient(90deg, #6D6875, #6D6875 15px, #B5838D 15px, #B5838D 30px)',
    'repeating-radial-gradient(circle, #84A59D, #84A59D 10px, #E5989B 10px, #E5989B 20px)',
    'repeating-linear-gradient(135deg, #A3B18A 0px, #A3B18A 20px, #D4A373 20px, #D4A373 40px)',
    'repeating-linear-gradient(0deg, #E5989B 0, #E5989B 2px, transparent 2px, transparent 40px)',
    'repeating-linear-gradient(45deg, #6D6875, #6D6875 5px, #B5838D 5px, #B5838D 10px)',
  ]

  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)]
  return randomBg
}
