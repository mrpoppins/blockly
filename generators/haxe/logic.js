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
 * @fileoverview Generating Haxe for logic blocks.
 * @author mrpoppins@tutanota.com (mrpoppins)
 */
'use strict';

goog.provide('Blockly.Haxe.logic');

goog.require('Blockly.Haxe');


Blockly.Haxe['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var code = '', branchCode, conditionCode;
  if (Blockly.Haxe.STATEMENT_PREFIX) {
    // Automatic prefix insertion is switched off for this block.  Add manually.
    code += Blockly.Haxe.injectId(Blockly.Haxe.STATEMENT_PREFIX,
        block);
  }
  do {
    conditionCode = Blockly.Haxe.valueToCode(block, 'IF' + n,
        Blockly.Haxe.ORDER_NONE) || 'false';
    branchCode = Blockly.Haxe.statementToCode(block, 'DO' + n);
    if (Blockly.Haxe.STATEMENT_SUFFIX) {
      branchCode = Blockly.Haxe.prefixLines(
          Blockly.Haxe.injectId(Blockly.Haxe.STATEMENT_SUFFIX,
          block), Blockly.Haxe.INDENT) + branchCode;
    }
    code += (n > 0 ? ' else ' : '') +
        'if (' + conditionCode + ') {\n' + branchCode + '}';
    ++n;
  } while (block.getInput('IF' + n));

  if (block.getInput('ELSE') || Blockly.Haxe.STATEMENT_SUFFIX) {
    branchCode = Blockly.Haxe.statementToCode(block, 'ELSE');
    if (Blockly.Haxe.STATEMENT_SUFFIX) {
      branchCode = Blockly.Haxe.prefixLines(
          Blockly.Haxe.injectId(Blockly.Haxe.STATEMENT_SUFFIX,
          block), Blockly.Haxe.INDENT) + branchCode;
    }
    code += ' else {\n' + branchCode + '}';
  }
  return code + '\n';
};

Blockly.Haxe['controls_ifelse'] = Blockly.Haxe['controls_if'];

Blockly.Haxe['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Haxe.ORDER_EQUALITY : Blockly.Haxe.ORDER_RELATIONAL;
  var argument0 = Blockly.Haxe.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Haxe.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Haxe['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Haxe.ORDER_LOGICAL_AND :
      Blockly.Haxe.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Haxe.valueToCode(block, 'A', order);
  var argument1 = Blockly.Haxe.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'false';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Haxe['logic_negate'] = function(block) {
  // Negation.
  var order = Blockly.Haxe.ORDER_LOGICAL_NOT;
  var argument0 = Blockly.Haxe.valueToCode(block, 'BOOL', order) ||
      'true';
  var code = '!' + argument0;
  return [code, order];
};

Blockly.Haxe['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Haxe.ORDER_ATOMIC];
};

Blockly.Haxe['logic_null'] = function(block) {
  // Null data type.
  return ['null', Blockly.Haxe.ORDER_ATOMIC];
};

Blockly.Haxe['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Haxe.valueToCode(block, 'IF',
      Blockly.Haxe.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.Haxe.valueToCode(block, 'THEN',
      Blockly.Haxe.ORDER_CONDITIONAL) || 'null';
  var value_else = Blockly.Haxe.valueToCode(block, 'ELSE',
      Blockly.Haxe.ORDER_CONDITIONAL) || 'null';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.Haxe.ORDER_CONDITIONAL];
};
