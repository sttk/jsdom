console.log("Script-external-file-2");

var script0 = document.getElementById("script-0");
document.head.appendChild(script0);

var script1 = document.getElementById("script-1");
script1.setAttribute("src", "./states-for-external-files-1.js");

var script1a = document.getElementById("script-1a");
script1.setAttribute("src", "./states-for-external-files-1a.js");

var script3 = document.createElement("script");
script3.id = "script-3";
script3.setAttribute("src", "./states-for-external-files-3.js");
document.head.appendChild(script3);

script0.setAttribute("src", "./states-for-external-files-0a.js");
document.head.appendChild(script0);
