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
