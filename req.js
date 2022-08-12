let headerstr = '{"indent":true,"unescapeJson":true,"mode":"Auto","attributePrefix":"@","textPropertyName":"#text","input":"'

let divStr = '<div id="c2" square="1" clm="c" lndx="2" style="position: absolute; margin-left: 480px; margin-top: 480px; color: black;" class="lightsquarecolor" bgc="lightsquarecolor" tlsq="d1" trsq="b1" brsq="b3" blsq="d3" tsq="c1" bsq="c3" lsq="d2" rsq="b2" sqtype="BLANK" sqcolor="0" kapos="e1" prow="8" mvtsq="1" mvbsq="1" mvtlsq="1" mvbrsq="1" mvblsq="1" mvtrsq="1" range="2"></div>';

divStr = divStr.replaceAll(' ', '+');


divStr = divStr.replaceAll('"', '\\\"');

divStr = headerstr + divStr + '"}&pageVisitId='

let finalStr = encodeURI(divStr)

finalStr = "tool=data-html-to-json-converter&parameters=" + finalStr;


	https://toolslick.com/api/process