//@target Illustrator

//  script.name = textBlockLive.jsx; 
//  script.description = converts selected point textFrames into a Block of Text;
//  script.required = one document with at least two selected Point Text frames;
//  script.parent = carlos canto // 12/4/11; Update 03/15/205 added User Defined Units, cosmetics
//  script.modification = sergey osokin // 08/12/23; keep text editable, sort texts by Y, cosmetics
//  script.elegant = false;

function main() {
  if (!app.documents.length) {
    alert("There are no open documents");
    return;
  }

  var sel = app.selection;
  var tfs = getTextFrames(selection);
  if (tfs.length < 2) {
    alert("Select at least 2 Point Text Frames before running");
    return;
  }

  // Sort array by Y and X positions
  tfs.sort(function (a, b) {
    return comparePosition(b.top, a.top, a.left, b.left)
  });

  var width = prompt("Enter desired Text Block width including Units", '300 pt', "Text Block");
  if (width == null) return;

  var widthUV = new UnitValue(width);
  if (widthUV.type == '?') {
    alert('Units were not provided, try again...');
    return;
  }
  var widthPts = widthUV.as("pt") // convert to points

  var spacing = prompt("Enter spacing including Units", '3 mm', "Text Block"); // text lines spacing in mm
  if (spacing == null) return;

  var spcingUV = new UnitValue(spacing);
  if (spcingUV.type == '?') {
    alert('Units were not provided, try again...');
    return;
  }
  var spacingPts = spcingUV.as("pt") // convert to points

  var blockGrp = selection[0].layer.groupItems.add(); // add a group to final output
  blockGrp.name = "Text Block";

  var left = 0;
  var top = 0;
  var firstTop = 0;

  for (var i = tfs.length - 1; i >= 0; i--) { // loop thru selection
    var tf = tfs[i];
    var iText = tf.duplicate(blockGrp, ElementPlacement.PLACEATEND); // duplicate text
    iText.selected = false; // deselect it
    var iOutlined = iText.createOutline(); // create outlines

    var perCent = widthPts / iOutlined.width * 100; // get scaling percentage, based on desired width of block
    var scaleMatrix = app.getScaleMatrix(perCent, perCent);

    iOutlined.remove();
    iText = tf.duplicate(blockGrp, ElementPlacement.PLACEATEND);
    iText.selected = false;
    iText.transform(scaleMatrix);

    iOutlined = iText.duplicate().createOutline();
    var deltaX = iText.left - iOutlined.left;
    var deltaY = iText.geometricBounds[1] - iOutlined.geometricBounds[1];

    iText.left = left + deltaX;
    iText.top = top + deltaY + iOutlined.height + spacingPts;
    top = iText.top - deltaY;
    if (i == 0) firstTop = tf.top + deltaY;

    iOutlined.remove();
  }

  blockGrp.position = [tf.left + tf.width + 40, firstTop];
}

// Get TextFrames array from collection
function getTextFrames(coll) {
  var tfs = [];
  for (var i = 0, len = coll.length; i < len; i++) {
    if (/text/i.test(coll[i].typename)) 
      tfs.push(coll[i]);
    else if (/group/i.test(coll[i].typename)) 
      tfs = tfs.concat(getTextFrames(coll[i].pageItems));
  }
  return tfs;
}

// Compare position of two objects
function comparePosition(a1, b1, a2, b2) {
  return a1 == b1 ? a2 - b2 : a1 - b1;
}

try {
  main();
} catch (e) {}