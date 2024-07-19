var ModelMaterials =[];
system.include('MaterialsNames.js');

//if (system.fileExists('MaterialsNames.js')) console.log('ok');

Model.forEachPanel(function(obj) {
    if (ModelMaterials.indexOf(obj.MaterialName) == -1)
        ModelMaterials.push(obj.MaterialName);
});

ModelMaterials.forEach(function(name){
    if (name.indexOf('ЛДСП') > -1 || name.indexOf('Панель МДФ') > -1 ||
    name.indexOf('ДВП') > -1 || name.indexOf('ХДФ') > -1 ){
        if (name.indexOf('\r')>-1) 
            name = name.replace('\r', ' ');
        index = MaterialsNames.indexOf(name);
        if (index == -1){
            MaterialsNames.push(name, 1);
        } else
            if (MaterialsNames[index+1] > 0)
                MaterialsNames[index+1] = Number(MaterialsNames[index+1])+1;
    }    
});

MaterialsNames = 'var MaterialsNames = [\n"' + MaterialsNames.join('", \n"');
console.log(MaterialsNames);
system.askWriteTextFile('js', MaterialsNames + '"\n];');

//console.log('js', );

//function getNames(){
//    return MaterialsNames = [];
//}