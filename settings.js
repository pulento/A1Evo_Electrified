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
const workingdirInput_set = document.getElementById("workingDir_set");
const confXoOptions = document.getElementById("xo-options");

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
  "SHL":  [],       //Left & Right pair
  "TFL":  [],       //Left & Right pair
  "TML":  [],       //Left & Right pair
  "TRL":  [],       //Left & Right pair
  "TS":   [],
};

const SpeakerNames = { 
  "BDL": "Back Dolby Left & Right",
  "C": "Center",       
  "CH": "Center Height",
  "FDL": "Front Dolby Left & Right",
  "FHL": "Front Height Left & Right",
  "FL": "Front Left & Right",
  "FWL": "Front Wide Left & Right",
  "RHL": "Rear Height Left & Right",
  "SBL": "Surround Back Left & Right",
  "SDL": "Surround Dolby Left & Right",
  "SLA": "Surround Left & Right",
  "SHL": "Surround Height Left & Right",
  "TFL":  "Top Front Left & Right",
  "TML":  "Top Middle Left & Right",
  "TRL":  "Top Rear Left & Right",
  "TS":   "Top Surround",
}
const XOfreq = [40, 60, 80, 90, 100, 110, 120, 150, 180, 200, 250];

const targetCurveDialog = {
  title: 'Select a Target Curve',
  filters: [{ name: 'Target Curves', extensions: ['txt'] },],
  properties: ['openFile'],
};

const workingdirDialog = {
  title: 'Select Work Directory',
  filters: [{ name: 'Work Directory' },],
  properties: ['openDirectory'],
};

async function targetDialog() {
  const targetDir = await window.electronAPI.getDir("targetcurve");
  targetCurveDialog.defaultPath = targetDir;
  const result = await window.electronAPI.openDialog('showOpenDialogSync', targetCurveDialog);
  if (result) {
    console.log(`Target Curve selected; ${result}`);
    targetcurveInput_set.value = result;
    targetcurveInput_set.dispatchEvent(new Event('change'));
  }
}

async function workingDialog() {
  const homeDir = await window.electronAPI.getDir("home");
  workingdirDialog.defaultPath = homeDir;
  const result = await window.electronAPI.openDialog('showOpenDialogSync', workingdirDialog);
  if (result) {
    oldworking = await window.electronAPI.getConfigKey('workdirectory');
    if (result !== oldworking ) { 
      await window.electronAPI.setConfigKey('workdirectory', result);
      console.log(`Working directory selected; ${result}`);
      workingdirInput_set.value = result;
      workingdirInput_set.dispatchEvent(new Event('change'));
      window.electronAPI.showRestartDialog("Working directory changed. A1EE will restart");
    }
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

  let tmpXO = await window.electronAPI.getConfigKey('XO');
  if (tmpXO) {
    for (key in SpeakerXOSearchRange) {
      if (tmpXO[key][0]) document.getElementById(key + 'Lo').value = tmpXO[key][0];
      if (tmpXO[key][1]) document.getElementById(key + 'Hi').value = tmpXO[key][1];
      if (tmpXO[key]) SpeakerXOSearchRange[key] = tmpXO[key];
    }
  }
  let workingDir = await window.electronAPI.getConfigKey('workdirectory');
  if (workingDir) {
    workingdirInput_set.value = workingDir;
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

function XOselect(elem, name) {
  const select = document.createElement("select");
  select.id = name;
  select.name = name;
  select.setAttribute("onchange", "XOsettingsChanged(id)")
  select.insertAdjacentHTML("beforeend",'<option value="">None</option>');
  for (freq in XOfreq) {
    select.insertAdjacentHTML("beforeend",`<option value="${XOfreq[freq]}">${XOfreq[freq]}Hz</option>`);  
  }
  elem.appendChild(select);
};

function showXOSelectors(elem) {
  const form = document.createElement("form");
  for (key in SpeakerXOSearchRange) {
    const para = document.createElement("p");
    const label = document.createElement("label");
    const labeltext = document.createTextNode(SpeakerNames[key]);
    label.appendChild(labeltext);
    para.appendChild(label);
    XOselect(para, key + 'Lo');
    XOselect(para, key + 'Hi');
    form.appendChild(para);
  };
  elem.appendChild(form);
}

async function XOsettingsChanged(id) {
  elem = document.getElementById(id);
  console.log(`Settings ID: ${id} to ${elem.value}`);

  let chan = id.slice(0,-2);
  for (key in SpeakerXOSearchRange) {
    if (chan == key) {
      let Low, Hi;
      //console.log(`Modify ${key}`);
      if (id.includes('Lo')) {
        Low = elem.value;
        //console.log(`Low: ${Low}`);
        if (elem.value)
          SpeakerXOSearchRange[key][0] = parseInt(Low);
        else {
          document.getElementById(key + 'Lo').value = "";
          document.getElementById(key + 'Hi').value = "";
          SpeakerXOSearchRange[key] = [];
        }
      } else {
        Hi = elem.value;
        //console.log(`Hi: ${Hi}`);
        if (elem.value) {
          if (!document.getElementById(key + 'Lo').value) {
            document.getElementById(key + 'Lo').value = Hi;
            SpeakerXOSearchRange[key][0] = parseInt(Hi);
          }
          SpeakerXOSearchRange[key][1] = parseInt(Hi);
        } else
          SpeakerXOSearchRange[key].splice(1, 1);
      }
    }
  }
  console.log(SpeakerXOSearchRange);
  await window.electronAPI.setConfigKey('XO', SpeakerXOSearchRange);
};


const node = document.createRange().createContextualFragment("<script>showXOSelectors(confXoOptions)</script>");
confXoOptions.appendChild(node);
