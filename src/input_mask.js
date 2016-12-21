import React from 'react';
import ReactDOM from 'react-dom';
import { maskInput } from './helpers.js'

export class InputMask extends React.Component {
  constructor(props, context){
    super(props, context)

    this.MASK_LENGTH = null
    this.PARTIAL_POSITION = null
    this.FIRST_NON_MASK_POSITION = null
    this.buildTestsFromMask(props.mask, props.definitions)
    this.buffer = props.mask.split('').map( (c, i) => {
      if (c != '?') {
        return props.definitions[c] ? props.placeholder : c;
      }
    })

    this.state = {
      rawInput: '',
      maskedInput: '',
      value: props.value,
    }

  }

  setInputElement(el){ this.inputEl = el }

  buildTestsFromMask(mask, definitions){
    this.MASK_LENGTH = mask.length

    let tests = []
    mask.split('').forEach((char, index) => {
      if (char == '?') {
        this.MASK_LENGTH--
        this.PARTIAL_POSITION = index

      } else if (definitions[char]) {
        tests.push(new RegExp(definitions[char]))

        if (this.FIRST_NON_MASK_POSITION === null) {
          this.FIRST_NON_MASK_POSITION = tests.length - 1;
          console.log('being hit', this.FIRST_NON_MASK_POSITION)
        }

      } else {
        tests.push(null)
      }
    })

    this.tests = tests
  }

  onKeyPress(e){
    const lastChar = String.fromCharCode(e.which)
    // console.log(e.which,this.state.value.concat(lastChar))
    this.setState({
      value: this.state.value.concat(lastChar),
    })
    // window.test = e
  }

  onKeyDown(e){
    const lastChar = String.fromCharCode(e.which)
    if (e.which === 8) {
      this.setState({value: this.state.value.slice(0,-1)})
    }
  }

  onFocus(e){

  }

  onBlur(e){

  }

  keypressEvent(e) {
    var k = e.which,
      pos = this.setCaret(),
      p,
      c,
      next;

    if (e.ctrlKey || e.altKey || e.metaKey || k < 32) {
      return

    } else if (k) {
      if (pos.end - pos.begin !== 0){
        this.clearBuffer(pos.begin, pos.end);
        this.shiftL(pos.begin, pos.end-1);
      }

      p = this.seekNext(pos.begin - 1);
      if (p < this.MASK_LENGTH) {
        c = String.fromCharCode(k);

        if (this.tests[p].test(c)) {
          this.shiftR(p);
          this.buffer[p] = c;
          console.log('hitting write buffer', p)
          next = this.seekNext(p);
          this.writeBuffer(next);

          // if(android){
          //   // setTimeout($.proxy($.fn.caret,input,next),0);
          // }else{
          console.log('setting carert from keypressEvent if test matches')

          this.setCaret(next);
          // }

          // if (settings.completed && next >= len) {
          //   settings.completed.call(input);
          // }
        }
      }
      e.preventDefault();
    }
  }

  keydownEvent(e) {
    var k = e.which,
      pos,
      begin,
      end;

    //backspace, delete, and escape get special treatment
    if (k === 8 || k === 46 || ( k === 127)) {
    // if (k === 8 || k === 46 || (iPhone && k === 127)) {
      pos = this.setCaret();
      begin = pos.begin;
      end = pos.end;

      if (end - begin === 0) {
        begin=k!==46? this.seekPrev(begin) : (end=this.seekNext(begin-1));
        end=k===46? this.seekNext(end) : end;
      }
      this.clearBuffer(begin, end);
      this.shiftL(begin, end - 1);

      e.preventDefault();
    } else if (k == 27) {//escape
      // input.val(focusText);
      // input.caret(0, this.checkVal());
      e.preventDefault();
    }
  }

  seekNext(pos) {
    while (++pos < this.MASK_LENGTH && !this.tests[pos]);
    return pos;
  }

  seekPrev(pos) {
    while (--pos >= 0 && !this.tests[pos]);
    return pos;
  }

  shiftL(begin,end) {
    var i, j;

    if (begin < 0) {
      return;
    }

    for(i = begin, j = this.seekNext(end); i < this.MASK_LENGTH; i++) {
      if (this.tests[i]) {
        if (j < this.MASK_LENGTH && this.tests[i].test(this.buffer[j])) {
          this.buffer[i] = this.buffer[j];
          this.buffer[j] = this.props.placeholder;
        } else {
          break;
        }

        j = this.seekNext(j);
      }
    }

    this.writeBuffer(Math.max(this.FIRST_NON_MASK_POSITION, begin));
  }

  writeBuffer(test){
    console.log(test)
    const callback = () => {console.log('being called',test);this.setCaret(test)}
    this.setState({value: this.buffer.join('')}, callback)

  }
  shiftR(pos) {
    var i,
      c,
      j,
      t;

    for (i = pos, c = this.props.placeholder; i < this.MASK_LENGTH; i++) {
      if (this.tests[i]) {
        j = this.seekNext(i);
        t = this.buffer[i];
        this.buffer[i] = c;
        if (j < this.MASK_LENGTH && this.tests[j].test(t)) {
          c = t;
        } else {
          break;
        }
      }
    }
  }

  clearBuffer(start, end) {
    console.log('hitting clearbuffer', start, end)

    var i;
    for (i = start; i < end && i < this.MASK_LENGTH; i++) {
      if (this.tests[i]) {
        this.buffer[i] = this.props.placeholder;
      }
    }
  }

  setCaret(begin, end) {
    console.log('setting caret', begin, end)
    let range,
        input = this.inputEl
    if (typeof begin == 'number') {
      end = (typeof end === 'number') ? end : begin;
      if (input.setSelectionRange) {
        input.setSelectionRange(begin, end);
      } else if (input.createTextRange) {
        range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', begin);
        range.select();
      }
    } else {
      if (input.setSelectionRange) {
        begin = input.selectionStart;
        end = input.selectionEnd;
      } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        begin = 0 - range.duplicate().moveStart('character', -100000);
        end = begin + range.text.length;
      }
      return { begin, end }
    }
  }

  render(){
    console.log('rerendered')
    window.test = this
    if(this.inputEl && this.state.value){
      console.log('settingSelectionRange now')
      this.inputEl.setSelectionRange(2,2)
    }
    // partialPosition = len = this.props.mask.length;
    return React.createElement('input', {
      ref: this.setInputElement.bind(this),
      value: this.state.value,
      // onChange: this.onChange,
      onFocus: this.onFocus.bind(this),
      onBlur: this.onBlur.bind(this),
      // onKeyPress: this.onKeyPress.bind(this),
      onKeyPress: this.keypressEvent.bind(this),
      onKeyDown: this.keydownEvent.bind(this),
    })
  }
}

InputMask.defaultProps = {
  definitions: {
      '9': "[0-9]",
      'a': "[A-Za-z]",
      '*': "[A-Za-z0-9]"
  },
  dataName: "rawMaskFn",
  placeholder: '_',
  value: '',
}
