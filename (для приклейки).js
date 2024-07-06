Model.forEachPanel(function(obj) {
    mtrl = obj.MaterialName;
    if (mtrl.indexOf('(для приклейки)', 0) > 0) obj.Selected = true;
});