Model.forEachPanel(function(obj) {
    if (obj.MaterialName.substring(0, 10) == 'Столешница') obj.Selected = true;
});