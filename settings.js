/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */
 

function settingsChanged() {
    
  pref_forceMLP = document.getElementById('forceMLP_set').checked;
  pref_forceSmall = document.getElementById('forceSmall_set').checked;
  pref_forceWeak = document.getElementById('forceWeak_set').checked;
  pref_forceCentre = document.getElementById('forceCentre_set').checked;
  pref_forceLarge = document.getElementById('forceLarge_set').checked;
  pref_noInversion = document.getElementById('noInversion_set').checked;
  pref_limitLPF = document.getElementById('limitLPF_set').checked;

  pref_endFrequency = document.getElementById("endFreq_set").value;
  pref_maxBoost = document.getElementById("maxBoost_set").value;
  pref_omaxBoost = document.getElementById("omaxBoost_set").value;

  /*
  console.log(`============`);
  console.log(`Preferences:`);
  console.log(`forceSmall: ${pref_forceSmall}`);
  console.log(`forceWeak: ${pref_forceWeak}`);
  console.log(`forceCentre: ${pref_forceCentre}`);
  console.log(`forceLarge: ${pref_forceLarge}`);
  console.log(`noInversion: ${pref_noInversion}`);
  console.log(`limitLPF: ${pref_limitLPF}`);
  console.log(`forceMLP: ${pref_forceMLP}`);
  console.log(`End Frequency: ${pref_endFrequency}`);
  console.log(`Max Boost: ${pref_maxBoost}`);
  console.log(`Overall Max Boost: ${pref_omaxBoost}`);
  */
};
