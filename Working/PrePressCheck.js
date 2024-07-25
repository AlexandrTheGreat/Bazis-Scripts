if (!system.fileExists('MaterialsNames.js')) 
    system.writeTextFile('MaterialsNames.js', 'var MaterialsNames = [];');
system.include('MaterialsNames.js')

order = Action.ModelFilename;
startIndex = order.lastIndexOf('\\\\') + 2;
order = order.slice(startIndex, startIndex + 11);
Article.OrderName = order;
Article.Name = order;

var OversizeDVPOm2 = false;
var ModelMaterials =[];

Model.forEachPanel(function(obj) {

    if (ModelMaterials.indexOf(obj.MaterialName) == -1)
        ModelMaterials.push(obj.MaterialName);

    mtName = obj.MaterialName.replace('\r', ' ');
    mtIndex = MaterialsNames.indexOf(mtName);
    if ( mtIndex > -1) 
        if (Number(MaterialsNames[mtIndex+1]) == 0) obj.TextureOrientation = 0;

    if (obj.Name.indexOf("О", 0) > -1) 
        obj.Name = obj.Name.toLowerCase();

    if (obj.IsContourRectangle)
        obj.Selected = false;
    else
        obj.Selected = true;

    if (obj.Cuts != 0){
        for (i=0; i<obj.Cuts.Count; i++){
            if (obj.Cuts[i].Sign.substring(0, 2) == '45' ||
                obj.Cuts[i].Sign.substring(0, 2) == '22' ||
                obj.Cuts[i].Sign.indexOf('выборка', 0) > -1 ||
                obj.Cuts[i].Name.indexOf('выборка', 0) > -1 ||
                obj.Cuts[i].Sign.indexOf('четв.', 0) > -1 ||
                obj.Cuts[i].Name.substring(0, 7) == 'Профиль' ||
                obj.Cuts[i].Sign.indexOf('.паз ', 0) > -1 &&
                    obj.Cuts[i].Sign.indexOf('.паз 4х', 0) == -1)
                obj.Selected = true;
         }
    }

    if (obj.Butts.Count > 0)
        for (i=0; i<obj.Butts.Count; i++)
            if (obj.Butts[i].Sign.toUpperCase().indexOf('РУЧКА') > -1 )
                obj.Selected = true;

    if (obj.MaterialName.indexOf('(пленка)', 0) > -1 ||
        obj.MaterialName.indexOf('(краска)', 0) > -1 ||
        obj.MaterialName.indexOf('Хром', 0) > -1 ||
        obj.MaterialName.indexOf('Белый Метал', 0) > -1 ||
        obj.MaterialName.indexOf('Пластик', 0) > -1 ||
        obj.MaterialName.indexOf('с пленкой безопасности', 0) > -1 ||
        obj.MaterialName.indexOf('метал', 0) > -1)
        obj.Selected = false;

    if (obj.MaterialName.substring(0, 10) == 'Столешница' ||
        obj.MaterialName.indexOf('(для приклейки)', 0) > -1)
        obj.Selected = true;
    
    if (obj.MaterialName.indexOf('ДВПО м2', 0) > -1 &&
        obj.MaterialName.indexOf('Белый', 0) > -1 &&
        (obj.ContourHeight > 800) && (obj.ContourWidth > 800))
            OversizeDVPOm2 = true;

    //Выделение фурнитуры
    //if (obj.Selected) obj.FindConnectedFasteners(obj).forEach(furn => {
        //furn.Selected = true;
        //});
});

if (OversizeDVPOm2){
    Btn = NewButtonInput("Детали ДВПО м² Белый больше 800 мм");
    Btn.OnChange = function(){
        Model.Selected = false;
        Model.forEachPanel(function(obj){
            if (obj.MaterialName.indexOf('ДВПО м2', 0) > -1 &&
            obj.MaterialName.indexOf('Белый', 0) > -1 &&
            (obj.ContourHeight > 800) && (obj.ContourWidth > 800))
                obj.Selected = true;
        })
    }
    alert('Детали ДВПО м² Белый больше 800 мм');
};



if (ModelMaterials.length > 0){
    
    ModelMaterials.forEach(function(name){
        if (name.indexOf('ЛДСП') > -1 || name.indexOf('Панель МДФ') > -1 ||
        name.indexOf('ДВП') > -1 || name.indexOf('ХДФ') > -1 ){
            if (name.indexOf('\r')>-1) 
                name = name.replace('\r', ' ');
            index = MaterialsNames.indexOf(name);
            if (index == -1){
                MaterialsNames.push(name, 1);
            } else
                if (Number(MaterialsNames[index+1]) > 0)
                    MaterialsNames[index+1] = Number(MaterialsNames[index+1])+1;
        }    
    });
    
    Sorted =[];
    while (MaterialsNames.length > 0){
        max = -2;
        maxi = 0;
        for (i=0; i<MaterialsNames.length; i=i+2){
            if (Number(MaterialsNames[i+1]) > max){
                max = Number(MaterialsNames[i+1]);
                maxi = i;
            }
        }
        Sorted.push(MaterialsNames[maxi], MaterialsNames[maxi+1]);
        MaterialsNames.splice(maxi, 2);
    }

    MaterialsNames = 'var MaterialsNames = [\n"' + Sorted.join('", \n"');
    system.writeTextFile('MaterialsNames.js', MaterialsNames + '"\n];');
};

Action.Hint = 'Выделено деталей' + Model.SelectionCount;
SetCamera(p3dIsometric);  //8
Action.Control.ViewAll();
Action.Continue();