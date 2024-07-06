Model.forEachPanel(function(obj) {
    if (obj.IsContourRectangle)
        obj.Selected = false;
    else {
        obj.Selected = true;
        obj.FindConnectedFasteners(obj).forEach(furn => {
            furn.Selected = true;
        });
    }

});