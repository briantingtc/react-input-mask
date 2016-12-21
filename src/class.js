import { buildInfoFromOptions, setCaret } from './helpers.js'

export function createInputMaskController(options){
  return function (inputEl){
    class InputMaskController {
      constructor({
        mask,
        definitions,
        placeholder,
        value,
      }){
        // pure function building out app variables
        const app_variables = buildInfoFromOptions(mask, definitions, placeholder)

        // constant variables
        this.MASK_LENGTH = app_variables.MASK_LENGTH
        this.PARTIAL_POSITION = app_variables.PARTIAL_POSITION
        this.FIRST_NON_MASK_POSITION = app_variables.FIRST_NON_MASK_POSITION
        this.PLACEHOLDER = placeholder
        // array of regex for checking string that wont be mutated
        this.TESTS = app_variables.TESTS


        // buffer array to insert placeholder characters
        this.buffer = app_variables.buffer
        // dom element
        this.inputEl = inputEl
      }

      parseKeyPressEvent(e) {
        const { MASK_LENGTH, TESTS } = this
        let keyCode = e.which,
          pos = setCaret(inputEl)(),
          nextPos,
          charStr,
          next;

        if (e.ctrlKey || e.altKey || e.metaKey || keyCode < 32) {
          e.preventDefault();
          return

        } else if (keyCode) {
          if (pos.end - pos.begin !== 0){
            this.clearBuffer(pos.begin, pos.end);
            return this.shiftL(pos.begin, pos.end-1);
          }

          nextPos = this.seekNext(pos.begin - 1);
          if (nextPos < MASK_LENGTH) {
            charStr = String.fromCharCode(keyCode);

            if (TESTS[nextPos].test(charStr)) {
              this.shiftR(nextPos);
              this.buffer[nextPos] = charStr;
              next = this.seekNext(nextPos);

              e.preventDefault();
              return this.writeBuffer(next);
              // if(android){
              //   // setTimeout($.proxy($.fn.caret,input,next),0);
              // }else{
              // setCaret(inputEl)(next);
              // }
              // if (settings.completed && next >= len) {
              //   settings.completed.call(input);
              // }
            }
          }
          e.preventDefault();
        }
      }

      parseKeyDownEvent(e) {
        let k = e.which,
          pos,
          begin,
          end;

        //backspace, delete, and escape get special treatment
        if (k === 8 || k === 46 || ( k === 127)) {
          e.preventDefault();
        // if (k === 8 || k === 46 || (iPhone && k === 127)) {
          pos = setCaret(inputEl)();
          begin = pos.begin;
          end = pos.end;

          if (end - begin === 0) {
            begin=k!==46? this.seekPrev(begin) : (end=this.seekNext(begin-1));
            end=k===46? this.seekNext(end) : end;
          }

          this.clearBuffer(begin, end);
          return this.shiftL(begin, end - 1);

        } else if (k == 27) {//escape
          // input.val(focusText);
          // input.caret(0, this.checkVal());
          e.preventDefault();
        } else {
          return null
        }
      }

      seekNext(pos) {
        const { MASK_LENGTH, TESTS } = this

        while (++pos < MASK_LENGTH && !TESTS[pos]);
        return pos;
      }

      seekPrev(pos) {
        const { MASK_LENGTH, TESTS } = this

        while (--pos >= 0 && !TESTS[pos]);
        return pos;
      }

      shiftL(begin,end) {
        const { TESTS, MASK_LENGTH, PLACEHOLDER, FIRST_NON_MASK_POSITION } = this
        let index, nextPos;

        if (begin < 0) {
          return;
        }

        for(index = begin, nextPos = this.seekNext(end); index < MASK_LENGTH; index++) {
          if (TESTS[index]) {
            if (nextPos < MASK_LENGTH && TESTS[index].test(this.buffer[nextPos])) {
              this.buffer[index] = this.buffer[nextPos];
              this.buffer[nextPos] = PLACEHOLDER;
            } else {
              break;
            }

            nextPos = this.seekNext(nextPos);
          }
        }

        return this.writeBuffer(Math.max(FIRST_NON_MASK_POSITION, begin));
      }

      writeBuffer(position){
        return {
          value: this.buffer.join(''),
          callback: () => setCaret(inputEl)(position),
        }
      }

      shiftR(pos) {
        const { PLACEHOLDER, MASK_LENGTH, TESTS } = this
        let nextPosition,
          bufferChar;

        for (let i = pos, placeholder = PLACEHOLDER; i < MASK_LENGTH; i++) {
          if (TESTS[i]) {
            nextPosition = this.seekNext(i);
            bufferChar = this.buffer[i];
            this.buffer[i] = placeholder;
            if (nextPosition < MASK_LENGTH && TESTS[nextPosition].test(bufferChar)) {
              placeholder = bufferChar;
            } else {
              break;
            }
          }
        }
      }

      clearBuffer(start, end) {
        const { PLACEHOLDER, MASK_LENGTH, TESTS } = this

        for (let i = start; i < end && i < MASK_LENGTH; i++) {
          if (TESTS[i]) {
            this.buffer[i] = PLACEHOLDER;
          }
        }
        return {
          value: ''
        }
      }

      checkVal(allow) {
        //try to place characters where they belong
        const {
          PLACEHOLDER,
          MASK_LENGTH,
          TESTS,
          PARTIAL_POSITION,
          FIRST_NON_MASK_POSITION
        } = this

        let inputValue = inputEl.value,
          lastMatch = -1,
          index,
          char;

        for (let index = 0, pos = 0; index < MASK_LENGTH; index++) {
          if (TESTS[index]) {
            this.buffer[index] = PLACEHOLDER;
            while (pos++ < inputValue.length) {
              char = inputValue.charAt(pos - 1);
              if (TESTS[index].test(char)) {
                this.buffer[index] = char;
                lastMatch = index;
                break;
              }
            }
            if (pos > inputValue.length) {
              break;
            }
          } else if (this.buffer[index] === inputValue.charAt(pos) && index !== PARTIAL_POSITION) {
            pos++;
            lastMatch = index;
          }
        }
        if (allow) {
          return this.writeBuffer();
        } else if (lastMatch + 1 < PARTIAL_POSITION) {
          inputEl.value = "";
          return this.clearBuffer(0, MASK_LENGTH);
        } else {
          inputEl.value = inputEl.value.substring(0, lastMatch + 1);
          return this.writeBuffer();
        }
        return (PARTIAL_POSITION ? index : FIRST_NON_MASK_POSITION);
      }
    }

    return new InputMaskController(options)
  }
}
