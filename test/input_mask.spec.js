import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import { InputMask } from '../src/index.js'
import { expect, should, assert } from 'chai'
import chai from 'chai'

const container = document.getElementById('root');;

function createInput(component, cb) {
    return (done) => {
        ReactDOM.unmountComponentAtNode(container);
        var input = ReactDOM.render(component, container);

        // IE can fail if executed synchronously
        setImmediate(() => {
            cb(input);
            done();
        });
    };
};

describe('Input', () => {
    it('Init format', createInput(
        <InputMask mask="(999) 999 9999" value="6042448969" />, (input) => {
        var inputNode = ReactDOM.findDOMNode(input);
        console.log(inputNode.value)
        expect(inputNode.value).equal('6042448969');
    }))
});
