const spotMaterials = ['ЛДСП 22 Белый 1850 ШПОН ТИС. \r293308)',];

Model.forEachPanel(function(obj) {
    if (spotMaterials.indexOf(obj.Materialname) > -1) obj.TextureOrientation = 2;
    console.log(obj.TextureOrientation, obj.MaterialName);
    obj.TextureOrientation = 0;

})