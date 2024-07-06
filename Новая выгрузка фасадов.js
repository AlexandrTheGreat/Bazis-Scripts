Action.Continue();
// 2823420
if(Model.SelectionCount == 0) {alert("Не выделены панели!"); Action.Cancel();}

//-- window Window1
Window1 = { Form : NewForm() };
Props = Window1.Form.Properties;
Window1.Form.Width = 369;
Window1.Form.Height = 66;
Window1.Form.Caption = "Выгрузка в 1с";
Window1.Form.MinHeight = 20;
Window1.Form.MinWidth = 20;
//-- window Window1 properties
Window1.Form.OnClose = function() {
    if(server && server.listening){
        server.close();
    }
    // ОБЯЗАТЕЛЬНО!!!
    setInterval(function() {Action.Cancel()}, 0.5)

};

Window1.Label1 = Props.NewLabel("Твой айпи адрес уже скопирован. Вставь его в мастер создания фасадов.");
Window1.Label1.SetLayout(0, 0, 368, 44);
Window1.Label1.Alignment = AlignmentType.Center;
Window1.Label1.WordWrap = true;
//-- window Window1 events

//-- window Window1 ends




var http = require('http');
var server = undefined;
var IP = "";
const port = 55555;
var hostname = require('os').hostname();
var JSONTo1c = {};


function copyToClipboard(text){
    require('child_process').exec('cmd.exe /C echo '+ IP + ' | clip', function (p,o,x){});
}

function getPanelSize() {
    //let JSONTo1c = {};
    Model.forEachPanel(function(pan) {
        if (pan.Selected) {

            let panPos = pan.ArtPos; //Номер позиции
            let panH = pan.ContourHeight.toFixed(2); // Высота панели
            let panW = pan.ContourWidth.toFixed(2); // Ширина панели
            let panT = pan.Thickness;
            let panOrientation = undefined; // Ориентация панели
            let panPlastic = undefined; // Облицовка(и) панели
            let panMaterialArticle = ""; // код материала
            let panMaterialName = "";
            try {
                panMaterialName = pan.MaterialName.split('\r')[0];
                panMaterialArticle =  pan.MaterialName.split('\r')[1];
            } catch (error) {
                panMaterialName = "";
                panMaterialArticle = "";
            }
            let plasticKey = ""; // Строка, состоящая из облицовок: Код+наименование. Используется при создании ключа объекта, чтобы отличать похожие панели
            let userProperties = [];

            if(pan.TextureOrientation == 0){
                    panOrientation = "";
            }
            else if(pan.TextureOrientation ==1){
                    panOrientation = "ПУС-185";
            }
            else if(pan.TextureOrientation == 2){
                    panOrientation = "ПУС-184";
            }
            // если есть облицовка панели
            if(pan.Plastics.Count > 0){
                // если облицовка одна
                if(pan.Plastics.Count == 1){
                    let plasticMaterial = pan.Plastics.Plastics[0].Material; // Наименование\rАртикул
                    let plasticArticle = ""; // Артикул
                    let plasticName = ""; // Наименование
                    let plasticNameAndArticle = plasticMaterial.split('\r'); // разделим наименование и артикул
                    plasticName = plasticNameAndArticle[0]; // наименование будет всегда
                    // если у материала есть артикул
                    if(plasticNameAndArticle.length == 2){
                        plasticArticle = plasticNameAndArticle[1]; // артикул
                    }
                    plasticKey += plasticArticle + "+" + plasticName; // создаем ключ для этой панели
                    let plasticObject = {"Код": plasticArticle, "Наименование": plasticName}; // объект для передачи в 1с
                    panPlastic = plasticObject;
                }
                // если облицовки две
                else if(pan.Plastics.Count == 2){
                    let plasticArray = []; // массив облицовок
                    // для каждой облицовки
                    for(let i=0; i< pan.Plastics.Count; i++){
                        let curPlasticMaterial = pan.Plastics.Plastics[i].Material; // Наименование\rАртикул
                        let curPlasticArticle = ""; // Артикул
                        let curPlasticName = ""; // Наименование
                        let plasticNameAndArticle = curPlasticMaterial.split('\r'); // разделим наименование и артикул
                        curPlasticName = plasticNameAndArticle[0]; // наименование будет всегда
                        // если у материала есть артикул
                        if(plasticNameAndArticle.length == 2){
                            curPlasticArticle = plasticNameAndArticle[1]; // артикул
                        }
                        plasticKey += curPlasticArticle + "+" + curPlasticName; // создаем ключ для этой панели
                        let plasticObject = {"Код": curPlasticArticle, "Наименование": curPlasticName}; // объект для передачи в 1с
                        plasticArray.push(plasticObject);
                    }
                    panPlastic = plasticArray;
                }
                // Макс говорит, что облицовок не может быть больше двух
                else {// если количество облицовок на панели больше двух (что?)
                }

             }

             // чтобы дополнить ключ отличия панелей друг от друга
             propertyKey = "";

            // массив пользовательских свойств
             for(let i=0; i<pan.UserPropCount; i++){
                 currentPropName = pan.UserPropertyName[i];
                 propObject = {[currentPropName]: pan.UserProperty[currentPropName]};
                 propertyKey += pan.UserProperty[currentPropName] + "_";
                 userProperties.push(propObject);
             }

            let key = panW + "x" + panH + "_" + panOrientation + "_" + plasticKey + "_" + propertyKey + "_" + panPos; // Ключ отличия панелей с разными характеристиками + Номер позиции

            // если такая панель уже есть, то увеличиваем количество на 1
            if (JSONTo1c[key]) {
                JSONTo1c[key]["Количество"]++;
            } else { // если такой панели еще нет
                JSONTo1c[key] = {
                    "КодМатериала": panMaterialArticle,
                    "НаименованиеМатериала": panMaterialName,
                    "Количество": 1,
                    "Ширина": panW,
                    "Высота": panH,
                    "Толщина": panT,
                    "Ориентация": panOrientation,
                    "Декор": panPlastic,
                    "ПользовательскиеСвойства": userProperties,
                    "НомерПозиции": panPos

                }
            }
        }
    });
    //Json = JSON.stringify(JSONTo1c);
    //return Json;
}

function getProfileSize(){
    let currentBlockID = undefined;
    let prevPosition = undefined;
    // для каждого выделенного объекта (в данном случае (если выделять по материалу) это профили)
    for(let i = 0; i < Model.SelectionCount; i++){
        let currentObj = Model.Selections[i];
        // если тип объекта - профиль
        if(currentObj instanceof TExtrusionBody){
            //currentObj.Selected = false;
            let parentObj = currentObj.Owner;
            // если владелец профиля - блок
            if(parentObj instanceof TFurnBlock){ 
                // если это новый блок (ну т.е. фасад), иначе смотрим след профиль
                // фрагмент, который на верхнем уровне иерархии по структуре
                let superParent = parentObj.Owner; 
                // смотрим по координатам объекта. Раньше было по айдишнику объекта, но не судьба
                if( (prevPosition == undefined) || (prevPosition.x != superParent.PositionX || prevPosition.y != superParent.PositionY || prevPosition.z != superParent.PositionZ)){
                    prevPosition = superParent.Position;
                    currentBlockID = Math.random() * Date.now();
                    let currentBlockWidth = Math.round(parentObj.GSize.x); // ширина
                    let currentBlockHeight = Math.round(parentObj.GSize.y); // высота
                    let currentBlockMaterial = parentObj.Name; // наименование материала
                    let currentBlockArticle = currentBlockMaterial.split('\r'); // пытаемся вытащить код материала
                    // если получился массив из 2х элементов, то 2 элемент - это код
                    if(currentBlockArticle.length == 2){
                        currentBlockArticle = currentBlockArticle[1];
                    }
                    else{ // иначе кода нет (спасибо, Максим, что правильно заполнил базу материалов)
                        currentBlockArticle = "";
                    }
                    // пользовательские свойства блока
                    let userProperties = [];
                    for(let i=0; i<parentObj.UserPropCount; i++){
                        currentPropName = parentObj.UserPropertyName[i];
                        propObject = {[currentPropName]: parentObj.UserProperty[currentPropName]};
                        userProperties.push(propObject);
                    }
                    JSONTo1c[currentBlockID] = {
                        "КодМатериала": currentBlockArticle,
                        "НаименованиеМатериала": currentBlockMaterial,
                        "Количество": 1,
                        "Ширина": currentBlockWidth,
                        "Высота": currentBlockHeight,
                        "ПользовательскиеСвойства": userProperties
                    }
                }
                else{
                    continue;
                }
            }
        }
    }

}



function runServer(IP){
    var http = require('http');
    server = http.createServer(function (req, res) {
      if(req.url == "/") { // чтоб из браузера favicon запрос не отрабатывал еще раз. На самом деле не мешает
          res.writeHead(200, {'Content-Type': 'application/json'});
          getPanelSize();
          getProfileSize();
          
          let response = JSON.stringify(JSONTo1c)//getPanelSize();
          res.write(response);
          res.end();
          server.close();
          Window1.Form.Close();
      }
    });
    server.listen(port);
    copyToClipboard(IP);
    Window1.Form.ShowModal();
}


require('dns').lookup(hostname, {all: true, family: 4}, function(err, addrs) {
    let addrResults = addrs.filter(item => item.address.startsWith("192.168"));
    IP = addrResults[0].address.trim();
    runServer(IP);

});