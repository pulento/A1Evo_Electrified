/* 
  Copyright (c) [2024] [Pulento - https://github.com/pulento]

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, and to permit persons to
  whom the Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  Redistribution and use in source and binary forms, with or without
  modification, are not permitted for commercial purposes without the explicit
  permission of the author.
*/

const forceMLPCheckbox_set = document.getElementById('forceMLP_set');
const forceSmallCheckbox_set = document.getElementById('forceSmall_set');
const forceWeakCheckbox_set = document.getElementById('forceWeak_set');
const forceCentreCheckbox_set = document.getElementById('forceCentre_set');
const forceLargeCheckbox_set = document.getElementById('forceLarge_set');
const noInversionCheckbox_set = document.getElementById('noInversion_set');
const limitLPFCheckbox_set = document.getElementById('limitLPF_set');
const endFrequencyInput_set = document.getElementById("endFreq_set");
const maxBoostInput_set = document.getElementById("maxBoost_set");
const omaxBoostInput_set = document.getElementById("omaxBoost_set");
const targetcurveInput_set = document.getElementById("targetCurve_set");

let SpeakerXOSearchRange = { 
  "BDL":  [],       //Left & Right pair
  "C":    [],       
  "CH":   [],
  "FDL":  [],       //Left & Right pair
  "FHL":  [],       //Left & Right pair
  "FL":   [],       //Left & Right pair
  "FWL":  [],       //Left & Right pair
  "RHL":  [],       //Left & Right pair
  "SBL":  [],       //Left & Right pair
  "SDL":  [],       //Left & Right pair
  "SLA":  [],       //Left & Right pair
  "TFL":  [],       //Left & Right pair
  "TML":  [],       //Left & Right pair
  "TRL":  [],       //Left & Right pair
  "TS":   [],
};

const targetCurveDialog = {
  title: 'Select a Target Curve',
  filters: [{ name: 'Target Curves', extensions: ['txt'] },],
  properties: ['openFile'],
};

async function targetDialog() {
  const targetDir = await window.electronAPI.getTargetDir();
  targetCurveDialog.defaultPath = targetDir;
  const result = await window.electronAPI.openDialog('showOpenDialogSync', targetCurveDialog);
  if (result) {
    console.log(`Target Curve selected; ${result}`);
    targetcurveInput_set.value = result;
    targetcurveInput_set.dispatchEvent(new Event('change'));
  }
}

async function getSettingsConfig() {
  forceMLPCheckbox_set.checked = await window.electronAPI.getConfigKey('forceMLP');
  forceSmallCheckbox_set.checked = await window.electronAPI.getConfigKey('forceSmall');
  forceWeakCheckbox_set.checked = await window.electronAPI.getConfigKey('forceWeak');
  forceCentreCheckbox_set.checked = await window.electronAPI.getConfigKey('forceCentre');
  forceLargeCheckbox_set.checked = await window.electronAPI.getConfigKey('forceLarge');
  noInversionCheckbox_set.checked = await window.electronAPI.getConfigKey('noInversion');
  limitLPFCheckbox_set.checked = await window.electronAPI.getConfigKey('limitLPF');

  endFrequencyInput_set.value = await window.electronAPI.getConfigKey('endFrequency');
  maxBoostInput_set.value = await window.electronAPI.getConfigKey('maxBoost');
  omaxBoostInput_set.value = await window.electronAPI.getConfigKey('omaxBoost');
  targetcurveInput_set.value = await window.electronAPI.getConfigKey('targetcurve');

  SpeakerXOSearchRange = await window.electronAPI.getConfigKey('XO');
  for (key in SpeakerXOSearchRange) {
    if (SpeakerXOSearchRange[key][0]) document.getElementById(key + 'Lo').value = SpeakerXOSearchRange[key][0];
    if (SpeakerXOSearchRange[key][1]) document.getElementById(key + 'Hi').value = SpeakerXOSearchRange[key][1];
  }
  checkSettings();
}

async function checkSettings() {
  forceSmallCheckbox_set.disabled = false;
  forceWeakCheckbox_set.disabled = false;
  forceCentreCheckbox_set.disabled = false;
  forceLargeCheckbox_set.disabled = false;

  if (forceSmallCheckbox_set.checked) {
    forceWeakCheckbox_set.checked = false;
    forceWeakCheckbox_set.disabled = true;
    forceLargeCheckbox_set.checked = false;
    forceLargeCheckbox_set.disabled = true;
    forceCentreCheckbox_set.checked = false;
    forceCentreCheckbox_set.disabled = true;
  }
  if (forceWeakCheckbox_set.checked) {
    forceSmallCheckbox_set.checked = true;
    forceSmallCheckbox_set.disabled = true;
    forceLargeCheckbox_set.checked = false;
    forceLargeCheckbox_set.disabled = true;
    forceCentreCheckbox_set.checked = false;
    forceCentreCheckbox_set.disabled = true;
  }
  if (forceLargeCheckbox_set.checked) {
    forceSmallCheckbox_set.checked = false;
    forceSmallCheckbox_set.disabled = true;
    forceWeakCheckbox_set.checked = false;
    forceWeakCheckbox_set.disabled = true;
  }
  if (forceCentreCheckbox_set.checked) {
    forceSmallCheckbox_set.checked = false;
    forceSmallCheckbox_set.disabled = true;
    forceWeakCheckbox_set.checked = false;
    forceWeakCheckbox_set.disabled = true;
    forceLargeCheckbox_set.checked = true;
    forceLargeCheckbox_set.disabled = true;
  }
}

async function settingsChanged() {
  checkSettings();
  await window.electronAPI.setConfigKey('forceMLP', forceMLPCheckbox_set.checked);
  await window.electronAPI.setConfigKey('forceSmall', forceSmallCheckbox_set.checked);
  await window.electronAPI.setConfigKey('forceWeak', forceWeakCheckbox_set.checked);
  await window.electronAPI.setConfigKey('forceCentre', forceCentreCheckbox_set.checked);
  await window.electronAPI.setConfigKey('forceLarge', forceLargeCheckbox_set.checked);
  await window.electronAPI.setConfigKey('noInversion', noInversionCheckbox_set.checked);
  await window.electronAPI.setConfigKey('limitFLP', noInversionCheckbox_set.checked);
  await window.electronAPI.setConfigKey('targetcurve', targetcurveInput_set.value);
  await window.electronAPI.setConfigKey('endFrequency', endFrequencyInput_set.value);
  await window.electronAPI.setConfigKey('maxBoost', maxBoostInput_set.value);
  await window.electronAPI.setConfigKey('omaxBoost', omaxBoostInput_set.value);
};

function showXOSelectors() {
  for (key in SpeakerXOSearchRange) {
    document.write("<p>");
    document.write(`<label>${key}</label>`);
    XOselect(key + 'Lo');
    XOselect(key + 'Hi');
    document.write("</p>");
  };
}

function XOselect(name) {
  document.write(`<select id=${name} name=${name} onchange=XOsettingsChanged(id)>`);
  document.write(['<option value="">None</option>',
      '<option value="40">40Hz</option>',
      '<option value="60">60Hz</option>',
      '<option value="80">80Hz</option>',
      '<option value="90">90Hz</option>',
      '<option value="100">100Hz</option>',
      '<option value="110">110Hz</option>',
      '<option value="120">120Hz</option>',
      '<option value="150">150Hz</option>',
      '<option value="180">180Hz</option>',
      '<option value="200">200Hz</option>',
      '<option value="250">250Hz</option>',]);
  document.write('</select>');
};

async function XOsettingsChanged(id) {
  elem = document.getElementById(id);
  console.log(`Settings ID: ${id} to ${elem.value}`);

  let chan = id.slice(0,-2);
  //console.log(`Channel: ${chan}`);
  for (key in SpeakerXOSearchRange) {
    if (chan == key) {
      let Low, Hi;
      //console.log(`Modify ${key}`);
      if (id.includes('Lo')) {
        Low = elem.value;
        //console.log(`Low: ${Low}`);
        SpeakerXOSearchRange[key][0] = Low;
      } else {
        Hi = elem.value;
        //console.log(`Hi: ${Hi}`);
        SpeakerXOSearchRange[key][1] = Hi;
      }
    }
  }
  //console.log(SpeakerXOSearchRange);
  await window.electronAPI.setConfigKey('XO', SpeakerXOSearchRange);
};
