const storona1 = 0;
const storona2 = 1;
const neZadana = 2;
let finished = false;
let panelsWithNoFrontface = [];

CheckFrontFace();

function CheckFrontFace() {
    Model.UnSelectAll();
    panelsWithNoFrontface = [];
    Model.forEachPanel(pan => {
        if(pan.FrontFace == neZadana && pan.MaterialName.startsWith("Столешница")){
            panelsWithNoFrontface.push(pan);
            pan.Selected = true;
        }
    })
    if(panelsWithNoFrontface.length == 0) {
        finished = true;
    }
    else{
        let infoString = "";
        panelsWithNoFrontface.forEach(function(pan) {
            infoString += pan.AsPanel.Name + "\r\n";
        });
        if(infoString != "")
            alert("ВНИМАНИЕ!!! Не указана лицевая сторона на выделенных панелях: \r\n" + infoString);
    }
}