export function maskInput (value, mask, tests){
  console.log('value', value)
  console.log('tests', tests)
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

export function buildInfoFromOptions(mask, definitions, placeholder){
  let MASK_LENGTH = mask.length,
      PARTIAL_POSITION = null,
      FIRST_NON_MASK_POSITION = null,
      maskArray = mask.split(''),
      tests = [],
      buffer = [],

  maskArray.forEach((char, index) => {
    if (char == '?') {
      MASK_LENGTH--
      PARTIAL_POSITION = index

    } else if (definitions[char]) {
      tests.push(new RegExp(definitions[char]))

      if (FIRST_NON_MASK_POSITION === null) {
        FIRST_NON_MASK_POSITION = tests.length - 1;
        console.log('being hit', FIRST_NON_MASK_POSITION)
      }
    } else {
      tests.push(null)
    }
  })

  buffer = maskArray.map( (char, i) => {
    if (char != '?') {
      return definitions[char] ? placeholder : char;
    }
  })

  return {
    MASK_LENGTH,
    PARTIAL_POSITION,
    FIRST_NON_MASK_POSITION,
    tests,
    buffer
  }
}

export function setCaret(inputEl) {
  return function (begin, end) {
    console.log('setting caret', begin, end)
    let range,
    if (typeof begin == 'number') {
      end = (typeof end === 'number') ? end : begin;
      if (inputEl.setSelectionRange) {
        inputEl.setSelectionRange(begin, end);
      } else if (inputEl.createTextRange) {
        range = inputEl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', begin);
        range.select();
      }
    } else {
      if (inputEl.setSelectionRange) {
        begin = inputEl.selectionStart;
        end = inputEl.selectionEnd;
      } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        begin = 0 - range.duplicate().moveStart('character', -100000);
        end = begin + range.text.length;
      }
      return { begin, end }
    }
  }
}
