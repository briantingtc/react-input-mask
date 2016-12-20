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

export function keypressEvent(e) {
  var k = e.which,
    pos = setCaret.call(event.target),
    p,
    c,
    next;

  if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {
    return

  } else if (k) {
    if (pos.end - pos.begin !== 0){
      clearBuffer(pos.begin, pos.end);
      shiftL(pos.begin, pos.end-1);
    }

    p = seekNext(pos.begin - 1);
    if (p < len) {
      c = String.fromCharCode(k);
      if (tests[p].test(c)) {
        shiftR(p);

        buffer[p] = c;
        writeBuffer();
        next = seekNext(p);

        if(android){
          setTimeout($.proxy($.fn.caret,input,next),0);
        }else{
          input.caret(next);
        }

        if (settings.completed && next >= len) {
          settings.completed.call(input);
        }
      }
    }
    e.preventDefault();
  }
}

export function setCaret(begin, end) {
  var range;

  if (this.length === 0) {
    return
  }
  //
  if (typeof begin == 'number') {
    end = (typeof end === 'number') ? end : begin;
    if (this.setSelectionRange) {
      this.setSelectionRange(begin, end);
    } else if (this.createTextRange) {
      range = this.createTextRange();
      range.collapse(true);
      range.moveEnd('character', end);
      range.moveStart('character', begin);
      range.select();
    }
  } else {
    if (this.setSelectionRange) {
      begin = this.selectionStart;
      end = this.selectionEnd;
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      begin = 0 - range.duplicate().moveStart('character', -100000);
      end = begin + range.text.length;
    }
    return { begin, end }
  }
}


function seekNext(pos) {
  while (++pos < len && !tests[pos]);
  return pos;
}

function seekPrev(pos) {
  while (--pos >= 0 && !tests[pos]);
  return pos;
}

function shiftL(begin,end) {
  var i,
    j;

  if (begin<0) {
    return;
  }

  for (i = begin, j = seekNext(end); i < len; i++) {
    if (tests[i]) {
      if (j < len && tests[i].test(buffer[j])) {
        buffer[i] = buffer[j];
        buffer[j] = settings.placeholder;
      } else {
        break;
      }

      j = seekNext(j);
    }
  }
  writeBuffer();
  input.caret(Math.max(firstNonMaskPos, begin));
}

function shiftR(pos) {
  var i,
    c,
    j,
    t;

  for (i = pos, c = settings.placeholder; i < len; i++) {
    if (tests[i]) {
      j = seekNext(i);
      t = buffer[i];
      buffer[i] = c;
      if (j < len && tests[j].test(t)) {
        c = t;
      } else {
        break;
      }
    }
  }
}
