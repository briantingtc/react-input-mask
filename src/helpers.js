export function buildInfoFromOptions(mask, definitions, placeholder){
  let MASK_LENGTH = mask.length,
      PARTIAL_POSITION = null,
      FIRST_NON_MASK_POSITION = null,
      TESTS = [],
      maskArray = mask.split(''),
      buffer = [];

  maskArray.forEach((char, index) => {
    if (char == '?') {
      MASK_LENGTH--
      PARTIAL_POSITION = index

    } else if (definitions[char]) {
      TESTS.push(new RegExp(definitions[char]))

      if (FIRST_NON_MASK_POSITION === null) {
        FIRST_NON_MASK_POSITION = tests.length - 1;
      }
    } else {
      TESTS.push(null)
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
    TESTS,
    buffer
  }
}

export function setCaret(inputEl) {
  return function (begin, end) {
    if (typeof begin == 'number') {
      end = (typeof end === 'number') ? end : begin;

      if (inputEl.setSelectionRange) {
        inputEl.setSelectionRange(begin, end);

      } else if (inputEl.createTextRange) {
        const range = inputEl.createTextRange();
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
