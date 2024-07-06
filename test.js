Model.forEachPanel(function(obj) {
    //if (obj.Cuts.Count != 0)
    //    console.log(obj.Cuts.Count, obj.Cuts[0].Name, obj.Cuts[0].Sign);
    if (obj.Cuts.Count > 1){
        console.log(obj.Cuts[1].Name, obj.Cuts[1].Sign)
        if (obj.Cuts[1].Name = 'Профиль 2409' ) {
        console.log(obj.Cuts[1].Name.prototype.lastIndexOf("2409", 0))
        obj.Selected = true;
        }
     }
});

//  obj.Cuts[0].Name obj.Cuts[0].Sign