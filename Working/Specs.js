var addMtrls = [];

function getMaterial(materialName){
    mat = 'Unknown';
    firstDigitPos = materialName.search(/\d/);
    endDigitsPos = materialName.indexOf(' ', firstDigitPos);
    thickness = Number(materialName.slice(firstDigitPos, endDigitsPos));
    if (materialName.indexOf('ЛДСП') == 0){
        mat = 'ЛДСП';
        if ( materialName.indexOf('ЛДСП м2') == 0 ) thickness = 16;
    };
    if (materialName.indexOf('Столешница') == 0){
        mat = 'Столешница';
        endDigitsPos = materialName.lastIndexOf('x');
        thickness = Number(materialName.slice(endDigitsPos-2, endDigitsPos));
    };
    if (materialName.indexOf('Панель МДФ') == 0) 
        mat = 'Панель МДФ';
    if (mat == 'Unknown') thickness = 'Unknown';
    return [mat, thickness];
};

function SelectSpecs(addMtrls){
    Model.forEachPanel(function(obj) {
        obj.Selected = false;
        mtrl = getMaterial(obj.MaterialName)[0];
        thck = obj.Thickness;
        if ( ( (mtrl == 'ЛДСП') || (mtrl == 'Панель МДФ') ||
            (addMtrls.indexOf(obj.MaterialName)) > -1 ) && (thck > 10) )
            obj.Selected = true;
        if ( (mtrl == 'Столешница') &&
            (obj.FindConnectedFasteners(obj).length > 0))
            addMtrls.push(obj.MaterialName);
    });
};

SelectSpecs(addMtrls);

if ( addMtrls.length > 0 ) SelectSpecs(addMtrls);