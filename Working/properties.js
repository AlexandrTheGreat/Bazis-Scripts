/*
http://promebelclub.ru/forum/showthread.php?p=501293#post501293

Просмотр свойств объекта

typeobject - объект исследования
    1 - выделенный
    2 - по указанию
    3 - указанный в переменной myobject

FunctionInclude - нужно ли отображать функции в результатах

Кнопки на панели инструментов
    Owner - перейти к родительскому объекту
    Return - вернутся к предыдущему
    Export - сохраняет данные в файл
*/

var typeobject = 2

if (typeobject == 3)
    var myobject = Action.Properties

var FunctionInclude = 1

// -------------------------------------------------

if (typeobject == 1 && !Model.Selected) {
    alert('Нужно выделить панели')
    Action.Finish();
}
if (typeobject == 1)
    var targetobject = Model.Selected
else if (typeobject == 2)
    var targetobject = GetObject("Укажите объект")
else if (typeobject == 3)
    var targetobject = myobject

if (!(targetobject instanceof Object))
    Action.Cancel();

var history = [];
var InputParam = [];
var argslenght = 0;
var text = '';
var Prop = Action.Properties;
parse();
NewButtonInput('Owner').OnChange = ButtonOwner
NewButtonInput('Return').OnChange = ButtonReturn
NewButtonInput('Update').OnChange = function () {parse()}
NewButtonInput('Export').OnChange = ButtonExport
NewButtonInput('Exit').OnChange = function () {Action.Finish()}
ButtonCall = NewButtonInput('Call')
ButtonCall.Visible = 0
ButtonCall.OnChange = OnButtonCall
ButtonCallCancel = NewButtonInput('Cancel')
ButtonCallCancel.Visible = 0
ButtonCallCancel.OnChange = CallBarHide
Action.Continue();


function parse() {
    text = targetobject + '\r\n\r\n';
    Prop.Capacity = 0
    Prop.NewString(targetobject)
    for (var key in targetobject) {
        obj = targetobject[key]
        if (!FunctionInclude && (obj instanceof Function))
            continue
        if ((obj instanceof Function)) {
            c = Prop.NewButton(obj)
            c.Name = key
            c.OnClick = OnClickFunction.bind(c, obj)
        } else if (obj instanceof Object) {
            c = Prop.NewButton(obj)
            c.Name = key
            c.OnClick = OnClick.bind(c, obj)
        } else {
            c = Prop.NewString(key, obj)
            c.OnChange = OnChange.bind(c, key)
        }
        text += key + '\t\t\t' + obj + '\r\n'
    }
}

function OnChange(key) {
    if (isNaN(Number(this.Value)))
        Value = this.Value
    else
        Value = parseFloat(this.Value)
    targetobject[key] = Value
    if (typeof targetobject.Build == 'function')
        targetobject.Build()
    Action.Commit();
}

function OnClick(obj) {
    history.push(targetobject)
    targetobject = obj
    parse();
}

function ButtonReturn() {
    if (!history.length)
        return alert('история пуста')
    targetobject = history.pop(targetobject)
    parse();
}

function ButtonOwner() {
    if (!targetobject.Owner)
        return alert('родительский объект отсутствует')
    history.push(targetobject)
    targetobject = targetobject.Owner
    parse();
}

function OnClickFunction(obj) {
    if (obj.length > 0)
        return CallBarShow(obj)
    argslenght = 0;
    FunctionCall(obj)
}

function FunctionCall(obj) {
    try {
        if (argslenght) {
            args = []
            for (var k = 0; k < argslenght; k++) {
                args.push(InputParam[k].Value)
            }
            r = obj.apply(targetobject, args);
        }
        else
            r = obj.call(targetobject)
    }
    catch (e) {
        alert(e)
        return 1
    }
    if (r instanceof Object) {
        b = confirm('Перейти к ' + r);
        if (b)
            return OnClick(r)
        return 1
    }
    alert(r)
}

function CallBarShow(obj) {
    CallBarObj = obj
    CallBarCheck(obj.length)
    for (var k = 0; k < obj.length; k++) {
        InputParam[k].Value = 0
        InputParam[k].Visible = 1;
    }
    ButtonCall.Visible = 1;
    ButtonCallCancel.Visible = 1;
}

function CallBarCheck(i) {
    argslenght = i;
    if (InputParam.length >= i)
        return
    for (var k = InputParam.length; k < i; k++) {
        InputParam[k] = NewNumberInput('arg ' + (k + 1));
        InputParam[k].Visible = 0;
    }
}

function CallBarHide() {
    for (var k = 0; k < InputParam.length; k++) {
        InputParam[k].Visible = 0
    }
    ButtonCall.Visible = 0
    ButtonCallCancel.Visible = 0
}

function OnButtonCall() {
    CallBarHide()
    FunctionCall(CallBarObj)
}

function ButtonExport() {
    shell = NewCOMObject('WScript.Shell')
    system.writeTextFile('export.txt', text);
    shell.run('explorer export.txt');
}