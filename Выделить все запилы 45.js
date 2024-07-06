Model.forEachPanel(function(obj) {
    if (obj.Cuts != 0){
        for (i=0; i<obj.Cuts.Count; i++){
            if (obj.Cuts[i].Sign.substring(0, 2) == '45')
                obj.Selected = true;
        }
    }
});