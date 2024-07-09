Edit = NewFloatInput("Ввод числа");
Edit.Value = 12;
Edit.OnChange = function() {
alert('Изменено число');
}

Btn1 = NewButtonInput("кнопка1");
Btn1.OnChange = function() {
alert('Нажата  кнопка1');
}

Btn2 = NewButtonInput("кнопка2");
Btn2.OnChange = function() {
alert('Нажата  кнопка2');
};


Action.OnClick = function() {
alert('Щелчок в области модели ' + Action.MouseX + ' ' + Action.MouseY)
};

Action.Continue();