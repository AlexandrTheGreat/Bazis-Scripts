Model.forEachPanel(function(obj) {

    if (obj.Name.indexOf("О", 0) > -1){
    newName = "";
    for (i = 0; i < obj.Name.length; i++){
        if (obj.Name.charAt(i) == "О")
            newName = newName + "о"
        else
            newName = newName + obj.Name.charAt(i);
        }
    obj.Name = newName;
    }

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

    //Выделение фурнитуры
    //if (obj.Selected) obj.FindConnectedFasteners(obj).forEach(furn => {
        //furn.Selected = true;
        //});
});

SetCamera(p3dIsometric);  //8
Action.Control.ViewAll();