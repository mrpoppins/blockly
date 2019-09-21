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
 * @fileoverview Generating Haxe for colour blocks.
 * @author mrpoppins@tutanota.com (mrpoppins)
 */
'use strict';

goog.provide('Blockly.Haxe.colour');

goog.require('Blockly.Haxe');


Blockly.Haxe['colour_picker'] = function(block) {
  // Colour picker.
  var code = Blockly.Haxe.quote_(block.getFieldValue('COLOUR'));
  return [code, Blockly.Haxe.ORDER_ATOMIC];
};

Blockly.Haxe['colour_random'] = function(block) {
  // Generate a random colour.
  var functionName = Blockly.Haxe.provideFunction_(
      'colourRandom',
      ['function ' + Blockly.Haxe.FUNCTION_NAME_PLACEHOLDER_ + '() {',
        '  var num = Math.floor(Math.random() * Math.pow(2, 24));',
        '  return \'#\' + (\'00000\' + StringTools.hex(num)).substr(-6);',
        '}']);
  var code = functionName + '()';
  return [code, Blockly.Haxe.ORDER_FUNCTION_CALL];
};

Blockly.Haxe['colour_rgb'] = function(block) {
  // Compose a colour from RGB components expressed as percentages.
  var red = Blockly.Haxe.valueToCode(block, 'RED',
      Blockly.Haxe.ORDER_COMMA) || 0;
  var green = Blockly.Haxe.valueToCode(block, 'GREEN',
      Blockly.Haxe.ORDER_COMMA) || 0;
  var blue = Blockly.Haxe.valueToCode(block, 'BLUE',
      Blockly.Haxe.ORDER_COMMA) || 0;
  var functionName = Blockly.Haxe.provideFunction_(
      'colourRgb',
      ['function ' + Blockly.Haxe.FUNCTION_NAME_PLACEHOLDER_ +
          '(r: Float, g: Float, b: Float) {',
       '  return \'#\' + [for (col in [r, g, b]) StringTools.lpad(',
       '    StringTools.hex(Std.int(Math.min(Math.max(col, 0), 255))), \'0\', 2',
       '  )].join(\'\');',
       '}']);
  var code = functionName + '(' + red + ', ' + green + ', ' + blue + ')';
  return [code, Blockly.Haxe.ORDER_FUNCTION_CALL];
};

Blockly.Haxe['colour_blend'] = function(block) {
  // Blend two colours together.
  var c1 = Blockly.Haxe.valueToCode(block, 'COLOUR1',
      Blockly.Haxe.ORDER_COMMA) || '\'#000000\'';
  var c2 = Blockly.Haxe.valueToCode(block, 'COLOUR2',
      Blockly.Haxe.ORDER_COMMA) || '\'#000000\'';
  var ratio = Blockly.Haxe.valueToCode(block, 'RATIO',
      Blockly.Haxe.ORDER_COMMA) || 0.5;
  var functionName = Blockly.Haxe.provideFunction_(
      'colourBlend',
      ['function ' + Blockly.Haxe.FUNCTION_NAME_PLACEHOLDER_ +
          '(c1: String, c2: String, ratio: Float) {',
       '  ratio = Math.max(Math.min(ratio, 1), 0);',
       '  var c1_rgb = [for (i in [1, 3, 5]) Std.parseInt(\'0x\'+c1.substring(i, i+2))];',
       '  var c2_rgb = [for (i in [1, 3, 5]) Std.parseInt(\'0x\'+c2.substring(i, i+2))];',
       '  var rgb = [for (i in 0...3) Math.round(c1_rgb[i] * (1 - ratio) + c2_rgb[i] * ratio)];',
       '  return \'#\' + [for (col in rgb) (\'0\' + StringTools.hex(Math.isNaN(col) ? 0 : col)).substr(-2)].join(\'\');',
       '}']);
  var code = functionName + '(' + c1 + ', ' + c2 + ', ' + ratio + ')';
  return [code, Blockly.Haxe.ORDER_FUNCTION_CALL];
};
