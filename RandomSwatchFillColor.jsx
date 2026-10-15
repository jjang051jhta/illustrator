//////////////////////
//© www.illustratorScripts.com
//aivaras gontis

//MIT
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//////////////////////



////////////////// this script takes selection and randomises its fill color from selected swatches in swatch panel //////////////////////////

function pc(item){

  var i = Math.round(Math.random() * (selSwatches.length - 1 ));

  if(item.typename == "PathItem"){
    item.filled = true;
    item.fillColor = selSwatches[i].color;
  }else{
    item.pathItems[0].filled = true;
    item.pathItems[0].fillColor = selSwatches[i].color;
  }

}

function iterateGroupsAndSubLayers(o, pathAndCompoundCheck, groupCheck, this_) {
    //layers
    if (o.layers) {
        for (var i = 0; i < o.layers.length; i++) {
            if (o.layers[i].visible) {
                // trace(" sublayer:", o.layers[i].name)
                iterateGroupsAndSubLayers(o.layers[i], pathAndCompoundCheck, groupCheck, this_)
            }
        }
    }
    //groups
    var items = o.pageItems;

    if(items)
    for (var i = 0; i < items.length; i++) {

        if (items[i].typename == "GroupItem") {
            if (!items[i].hidden) {
                //trace(" group>");
                  var check = groupCheck&&groupCheck(items[i], this_)
                  if (!check) iterateGroupsAndSubLayers(items[i], pathAndCompoundCheck, groupCheck, this_)

            }
        } else if (items[i].typename == "PathItem" || items[i].typename == "CompoundPathItem") {
            if (!items[i].hidden) {
                //trace(items[i]);
                pathAndCompoundCheck && pathAndCompoundCheck(items[i], this_)
            }
        }
    }else
      pathAndCompoundCheck(o,this_)

}


var doc = app.activeDocument;
var sel = doc.selection;
var selSwatches = doc.swatches.getSelected();

if(sel.length==0)
        alert("select something, duh")
else
if(selSwatches.length > 0){
  for (var i=0; i<sel.length; i++)
    iterateGroupsAndSubLayers(sel[i],pc)
}else
      alert("SHIFT+select few swatches from swatch palette")
