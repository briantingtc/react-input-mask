export const buildTestsFromMask = (mask, definitions) => {
  let tests = []
  mask.split('').forEach((char, i) => {
    if (char == '?') {
      // len--;
      // partialPosition = i;
    } else if (definitions[char]) {
      tests.push(new RegExp(definitions[char]));
      // if (firstNonMaskPos === null) {
      //   firstNonMaskPos = tests.length - 1;
      // }
    } else {
      tests.push(null);
    }
  })

  return tests
}
export const maskInput = (value, mask, tests) => {
  let substr = value.split('')
  let buffer = mask.split('')
  let result = []
  let position = 0

  for( let i = 0; i < mask.length; i++){
    // if character matches
    if ( tests[i] && tests[i].test(substr[position]) ){
      result.push(substr[position])
      position++
    } else if (!tests[i]){
      result.push(mask[i])

    }
  }
  return result.join('')
}
