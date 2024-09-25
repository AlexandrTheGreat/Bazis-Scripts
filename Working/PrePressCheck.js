if (!system.fileExists('MaterialsNames.js')) 
    system.writeTextFile('MaterialsNames.js', 'var MaterialsNames = [];');
system.include('MaterialsNames.js');
system.include('Specs.js');

var OversizeDVPOm2 = false;
var alerts = [];
alertDVPOm2 = 'Детали ДВПО м² Белый больше 800 мм';
alertFrontFace = 'Не указана лицевая сторона';
noFrontFace = [];
var ModelMaterials =[];

Model.forEachPanel(function(obj) {

    if (ModelMaterials.indexOf(obj.MaterialName) == -1)
        ModelMaterials.push(obj.MaterialName);

    mtName = obj.MaterialName.replace('\r', ' ');
    mtIndex = MaterialsNames.indexOf(mtName);
    if ( mtIndex > -1){

        if ( (Number(MaterialsNames[mtIndex+1]) == 0) ||
            (Number(MaterialsNames[mtIndex+1]) == -10) )
                obj.TextureOrientation = 0;

        if ( (Number(MaterialsNames[mtIndex+1]) == -10) ||
            (Number(MaterialsNames[mtIndex+1]) == -11) )
            if ((obj.FrontFace == 2) &&
                (obj.FindConnectedFasteners(obj).length > 0)){
                noFrontFace.push(obj);
                if (alerts.indexOf(alertFrontFace) == -1)
                    alerts.push(alertFrontFace);
            }


    }

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
        obj.MaterialName.indexOf('метал', 0) > -1 ||
        obj.MaterialName.indexOf('Акрил ', 0) == 0 ||
        obj.MaterialName.indexOf('ЗАМЕНИ ТКАНЬ', 0) == 0 ||
        obj.MaterialName.indexOf('Металл,сталь', 0) == 0)
        obj.Selected = false;

    if (obj.MaterialName.indexOf('(для приклейки)') > -1) obj.Selected = true;

    if (obj.MaterialName.substring(0, 10) == 'Столешница'){

        if ( (obj.Name.toLowerCase().indexOf('остаток') == -1) &&
            (obj.Name.toLowerCase().indexOf('обрезок') == -1) ){
                obj.Selected = true;
                if (obj.FrontFace == 2){
                    noFrontFace.push(obj);
                    if (alerts.indexOf(alertFrontFace) == -1)
                        alerts.push(alertFrontFace);
                }

            }

        if (obj.FindConnectedFasteners(obj).length > 0)
            addMtrls.push(obj.MaterialName);

    }

    if ( (obj.MaterialName.indexOf('ДВПО м2', 0) > -1) &&
        (obj.MaterialName.indexOf('Белый', 0) > -1) &&
        (obj.ContourHeight > 800) && (obj.ContourWidth > 800) )
            if (alerts.indexOf(alertDVPOm2, 0) == -1) alerts.push(alertDVPOm2);



    //Выделение фурнитуры
    //if (obj.Selected) obj.FindConnectedFasteners(obj).forEach(furn => {
        //furn.Selected = true;
        //});
});

if (alerts.length > 0){
    if (alerts.indexOf(alertDVPOm2) > -1){
        Btn = NewButtonInput(alertDVPOm2);
        Btn.OnChange = function(){
            Model.Selected = false;
            Model.forEachPanel(function(obj){
                if (obj.MaterialName.indexOf('ДВПО м2', 0) > -1 &&
                obj.MaterialName.indexOf('Белый', 0) > -1 &&
                (obj.ContourHeight > 800) && (obj.ContourWidth > 800))
                    obj.Selected = true;
            })
        }
    }

    if (noFrontFace.length > 0){
        BtnFrontFace = NewButtonInput(alertFrontFace);
        BtnFrontFace.OnChange = function(){
            Model.UnSelectAll();
            noFrontFace.forEach(function(obj){ obj.Selected = true})
        }
    }

    alert(alerts.join('\n'));
};

function isComposite(mtName){
    if ((mtName.indexOf('(') > -1) && 
       (mtName.indexOf('+') > (mtName.indexOf('('))) && 
       (mtName.indexOf(')') > (mtName.indexOf('+')))) 
        return true;
    else
        return false;
};

if (ModelMaterials.length > 0){
    
    ModelMaterials.forEach(function(name){
        if (name.indexOf('ЛДСП') > -1 || name.indexOf('Панель МДФ') > -1 ||
        name.indexOf('ДВП') > -1 || name.indexOf('ХДФ') > -1 )
            if (!isComposite(name)){
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
        Sorted.push('"'+MaterialsNames[maxi]+'", \n', '"'+MaterialsNames[maxi+1]+'", \n');
        MaterialsNames.splice(maxi, 2);
        if (Sorted.length > 2){
            last = Sorted.length - 1;
            if (Number(Sorted[last-2].slice(1,-4)) > -12){
                if (Number(Sorted[last-2].slice(1,-4)) > Number(Sorted[last].slice(1,-4))){

                    if (Number(Sorted[last].slice(1,-4)) == -11)
                        Sorted.splice(last-1, 0, '\n/* Разносторонние материалы с ориентированной текстурой: */ \n');

                    if (Number(Sorted[last].slice(1,-4)) == -10)
                        Sorted.splice(last-1, 0, '\n/* Разносторонние материалы с ненаправленной текстурой: */ \n');

                    if (Number(Sorted[last].slice(1,-4)) == -1)
                        Sorted.splice(last-1, 0, '\n/* Материалы с ориентированной текстурой: */ \n');

                    if (Number(Sorted[last].slice(1,-4)) == 0)
                        Sorted.splice(last-1, 0, '\n/* Материалы с ненаправленной текстурой: */ \n');

                }
            }
        }
    }
    Sorted.splice(0, 0, '\n/* Новые материалы: */ \n');
    MaterialsNames = 'var MaterialsNames = [\n' + Sorted.join('').slice(0, -4);
    system.writeTextFile('MaterialsNames.js', MaterialsNames + '"\n];');
};

today = new Date();
curYear = today.toString().slice(13, 15);
order = Action.ModelFilename;
order = order.slice(0, order.lastIndexOf('\\\\')-1);
startIndex = order.lastIndexOf('\\') + 1;
endIndex = order.lastIndexOf('.')
order = order.slice(startIndex, endIndex);
if (order.length > 2)
    if ( order.slice(order.length-3, order.length) != ('.' + curYear) )
        order = order + '.' + curYear;
Article.OrderName = order;
Article.Name = order;

Action.Hint = 'Чертежи.';
if ( Model.SelectionCount == 0 ){
    SelectSpecs(addMtrls);
    Action.Hint = 'Спецификации.';
}

Action.Hint = Action.Hint + ' Выделено деталей: ' + Model.SelectionCount;
SetCamera(p3dIsometric);  //8
Action.Control.ViewAll();
Action.Continue();