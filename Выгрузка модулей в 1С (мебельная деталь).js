const fs = require('fs');
let finalString = "";
for(let i = 0; i < Model.Count; i++){
    const currentObj = Model.Objects[i];


    if(currentObj instanceof TFurnBlock && currentObj.List){
        finalString += currentObj.Name.replace('\r', '\t') + "\r\n";
        for (let y = 0; y < currentObj.Count; y++) {
            const innerObj = currentObj.Objects[y];
            if(innerObj instanceof TModelLimits || innerObj.Name == "НЕ НАДО - УДАЛИ") continue;
            if(innerObj instanceof TFurnBlock){
                for (let z = 0; z < innerObj.Count; z++) {
                    const innerInnerObj = innerObj.Objects[z];
                    if(innerInnerObj instanceof TModelLimits) continue;
                    finalString += "\t" + innerInnerObj.Name.replace('\r', '\t') + "\r\n";
                }
            }
            else{
                if(innerObj.AsAsm)
                    finalString += "\t" + innerObj.Name.replace('\r', '\t') + "\r\n";
            }
        }
        finalString += "\r\n";
    }

}
system.askWriteTextFile(".txt", finalString)
