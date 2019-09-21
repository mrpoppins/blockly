/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Haxe for procedure blocks.
 * @author mrpoppins@tutanota.com (mrpoppins)
 */
'use strict';

goog.provide('Blockly.Haxe.procedures');

goog.require('Blockly.Haxe');


Blockly.Haxe['procedures_defreturn'] = function(block) {
  // Define a procedure with a return value.
  var funcName = Blockly.Haxe.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var xfix1 = '';
  if (Blockly.Haxe.STATEMENT_PREFIX) {
    xfix1 += Blockly.Haxe.injectId(Blockly.Haxe.STATEMENT_PREFIX,
        block);
  }
  if (Blockly.Haxe.STATEMENT_SUFFIX) {
    xfix1 += Blockly.Haxe.injectId(Blockly.Haxe.STATEMENT_SUFFIX,
        block);
  }
  if (xfix1) {
    xfix1 = Blockly.Haxe.prefixLines(xfix1, Blockly.Haxe.INDENT);
  }
  var loopTrap = '';
  if (Blockly.Haxe.INFINITE_LOOP_TRAP) {
    loopTrap = Blockly.Haxe.prefixLines(
        Blockly.Haxe.injectId(Blockly.Haxe.INFINITE_LOOP_TRAP,
        block), Blockly.Haxe.INDENT);
  }
  var branch = Blockly.Haxe.statementToCode(block, 'STACK');
  var returnValue = Blockly.Haxe.valueToCode(block, 'RETURN',
      Blockly.Haxe.ORDER_NONE) || '';
  var xfix2 = '';
  if (branch && returnValue) {
    // After executing the function body, revisit this block for the return.
    xfix2 = xfix1;
  }
  if (returnValue) {
    returnValue = Blockly.Haxe.INDENT + 'return ' + returnValue + ';\n';
  }
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.Haxe.variableDB_.getName(block.arguments_[i],
        Blockly.Variables.NAME_TYPE);
  }
  var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
      xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
  code = Blockly.Haxe.scrub_(block, code);
  // Add % so as not to collide with helper functions in definitions list.
  Blockly.Haxe.definitions_['%' + funcName] = code;
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Haxe['procedures_defnoreturn'] =
    Blockly.Haxe['procedures_defreturn'];

Blockly.Haxe['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.Haxe.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var i = 0; i < block.arguments_.length; i++) {
    args[i] = Blockly.Haxe.valueToCode(block, 'ARG' + i,
        Blockly.Haxe.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Haxe.ORDER_FUNCTION_CALL];
};

Blockly.Haxe['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  // Generated code is for a function call as a statement is the same as a
  // function call as a value, with the addition of line ending.
  var tuple = Blockly.Haxe['procedures_callreturn'](block);
  return tuple[0] + ';\n';
};

Blockly.Haxe['procedures_ifreturn'] = function(block) {
  // Conditionally return value from a procedure.
  var condition = Blockly.Haxe.valueToCode(block, 'CONDITION',
      Blockly.Haxe.ORDER_NONE) || 'false';
  var code = 'if (' + condition + ') {\n';
  if (Blockly.Haxe.STATEMENT_SUFFIX) {
    // Inject any statement suffix here since the regular one at the end
    // will not get executed if the return is triggered.
    code += Blockly.Haxe.prefixLines(
        Blockly.Haxe.injectId(Blockly.Haxe.STATEMENT_SUFFIX, block),
        Blockly.Haxe.INDENT);
  }
  if (block.hasReturnValue_) {
    var value = Blockly.Haxe.valueToCode(block, 'VALUE',
        Blockly.Haxe.ORDER_NONE) || 'null';
    code += Blockly.Haxe.INDENT + 'return ' + value + ';\n';
  } else {
    code += Blockly.Haxe.INDENT + 'return;\n';
  }
  code += '}\n';
  return code;
};
