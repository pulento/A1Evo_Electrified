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
