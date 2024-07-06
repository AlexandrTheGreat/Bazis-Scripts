Model.forEachPanel(function(obj) {
    if (obj.Cuts != 0){
        for (i=0; i<obj.Cuts.Count; i++){
            if (obj.Cuts[i].Name.substring(0, 7) == 'Профиль')
                obj.Selected = true;
        }
    }
});