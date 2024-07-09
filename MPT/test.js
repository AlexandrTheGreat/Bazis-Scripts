var DVPOm2 = [];
var index = 0;
Model.forEachPanel(function(obj) {
    if (obj.MaterialName.indexOf('ДВПО м2', 0) > -1 &&
        obj.MaterialName.indexOf('Белый', 0) > -1 &&
        (obj.ContourHeight > 800) && (obj.ContourWidth > 800))
            DVPOm2.push(index);
    index++;
})

//alert(DVPOm2);
console.log(DVPOm2[0], Model.Objects[DVPOm2[i]].MaterialName);
for(var i=0; i<DVPOm2.length; i++){
    Model.Objects[DVPOm2[i]].Selected = true;
}