//-------------------------Скрипт-------------------------------
// Создать файл Setup.xml для сохранения настроек
FileConfig = 'Config.xml';
// Загрузить файл для подтягивания последних сохраненных настроек меню
Action.Properties.Load(FileConfig);
// При завершении активного скрипта сохранить настройки меню в файл
Action.OnFinish = function() {
  Action.Properties.Save(FileConfig);
}
// вызов функции MakeProperties
MakeProperties();
// ожидаем окончания выполнения скрипта
Action.Continue();
var Panel;
//-------------------------ФУНКЦИИ--------------------------------------------------------------------------------------------------------------------------
// функция построения меню
function MakeProperties() {
    Property = Action.Properties;
    Width = Property.NewNumber('Ширина', 300);
    Height = Property.NewNumber('Высота', 300);
    Romb = Property.NewNumber('Сторона ромба/квадрата', 200);
    WidthStroka = Property.NewNumber('Ширина прострочки', 5);
    MatDSP = Property.NewMaterial('ДСП');
    MatSpanbond = Property.NewMaterial('Спанбонд');
    MatPPU = Property.NewMaterial('Поролон');
    MatCloth = Property.NewMaterial('Ткань');
    MatButt = Property.NewButt('Кромка Припуск');
    Tip = Property.NewCombo('Тип стяжки',  'Нет\nКаретная стяжка РОМБ\nКаретная стяжка КВАДРАТ\nУтяжка с прострочкой\nПуговица РОМБ\nПуговица КВАДРАТ');
    // кнопка в меню
    var Btn = Property.NewButton('Построить');
    Btn.OnClick = function() {
        Action.Commit();
        Action.Finish();
    }
//функция перестроения модели при изменении свойств меню
    Property.OnChange = function() {
        if (Width.Value >= 200 && Height.Value >= 200 && ((Width.Value <= 2720 && Height.Value <= 1100) || (Width.Value <= 1100 && Height.Value <= 2720)) && (MatDSP.Thickness == 10 || MatDSP.Thickness == 16) && (MatPPU.Thickness == 10 || MatPPU.Thickness == 20 || MatPPU.Thickness == 40 || MatPPU.Thickness == 50)) {
            DeleteNewObjects();
            // Вызов функции построения мягкого элемента
            BuildPanel();
        }
        else {
            alert("MIN размеры 200х200.\nMAX размеры 2720х1100 или 1100х2720.\nДСП 10, 16 мм.\nПоролон 10, 20, 40, 50 мм.\nИзмените параметры!!\nВНИМАНИЕ!! Модель не перестроена!!");
        }
    }
//функция построения мягкого элемента
    function BuildPanel() {
    DeleteNewObjects();
        var NameElement;
        if (Tip.Value == "Нет") {
            NameElement = "";
        } else {
            NameElement = Tip.Value;
        }
        BeginParametricBlock("Мягкий элемент " + NameElement);
            // построение мягкого элемента
            MatDSP.SetActive();
            Panel = AddFrontPanel(0, 0, Width.Value, Height.Value, 0 + MatSpanbond.Thickness);
            Panel.AddPlastic(MatSpanbond, false);
            Panel.AddPlastic(MatPPU, true);
            Panel.AddPlastic(MatCloth, true);
            Panel.Name = "Мягкий элемент " + NameElement;
                for (var k = 0; k < 4; k++) {
                    Panel.AddButt(MatButt, k)
                }
            Panel.Build();
            Button_ = OpenFurniture('Пуговица d20 мм.f3d');
            if (Tip.Value == 'Каретная стяжка РОМБ') {
                // Построение линий ромба Ромбообразное
                ContRomb = AddContour();
                LineRomb = Math.sqrt(2 * Math.pow(Romb.Value, 2));
                CountLineWidth = Math.floor(Width.Value / LineRomb);    // количество по горизонтали
                CountLineHeight = Math.floor(Height.Value / LineRomb);  // количество по вертикали
                OtstupWidth = (Width.Value - (LineRomb * CountLineWidth)) / 2;  // отступ по ширине с краю
                OtstupHeight = (Height.Value - (LineRomb * CountLineHeight)) / 2;   // отступ по высоте с краю
                PosLineWidth = LineRomb;
                PosLineHeight = LineRomb;
                for (i = 0; i < CountLineWidth; i++) {
                     for (j = 0; j < CountLineHeight; j++) {
                        ContRomb.Contour.AddLine(OtstupWidth + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb / 2, OtstupWidth + LineRomb / 2 + PosLineWidth * i, OtstupHeight + PosLineHeight * j);
                        ContRomb.Contour.AddLine(OtstupWidth + LineRomb / 2 + PosLineWidth * i, OtstupHeight + PosLineHeight * j, OtstupWidth + LineRomb + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb / 2);
                        ContRomb.Contour.AddLine(OtstupWidth + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb / 2, OtstupWidth + LineRomb / 2 + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb);
                        ContRomb.Contour.AddLine(OtstupWidth + LineRomb / 2 + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb, OtstupWidth + LineRomb + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb / 2);
                        // установка пуговиц
                        Button_.Mount1(Panel, OtstupWidth + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb / 2, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + LineRomb / 2 + PosLineWidth * i, OtstupHeight + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + LineRomb / 2 + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + LineRomb + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb / 2, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                     }
                }
                for (i = 0; i < CountLineWidth; i++) {
                        ContRomb.Contour.AddLine(OtstupWidth + PosLineWidth * i + LineRomb / 2, OtstupHeight, OtstupWidth + PosLineWidth * i + LineRomb / 2, 0);
                        ContRomb.Contour.AddLine(OtstupWidth + PosLineWidth * i + LineRomb / 2, Height.Value - OtstupHeight, OtstupWidth + PosLineWidth * i + LineRomb / 2, Height.Value);
                }
                for (j = 0; j < CountLineHeight; j++) {
                        ContRomb.Contour.AddLine(OtstupWidth, OtstupHeight + LineRomb / 2 + PosLineHeight * j, 0, OtstupHeight + LineRomb / 2 + PosLineHeight * j);
                        ContRomb.Contour.AddLine(Width.Value - OtstupWidth, OtstupHeight + LineRomb / 2 + PosLineHeight * j, Width.Value, OtstupHeight + LineRomb / 2 + PosLineHeight * j);
                }
                ContRomb.Name = "Стяжка РОМБ";
                ContRomb.Build();
                ContRomb.Translate(NewVector(0, 0, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness));
            } else if (Tip.Value == 'Каретная стяжка КВАДРАТ') {
                // Построение линий ромба КВАДРАТ
                ContRomb = AddContour();
                CountLineWidth = Math.floor(Width.Value / Romb.Value);    // количество по горизонтали
                CountLineHeight = Math.floor(Height.Value / Romb.Value);  // количество по вертикали
                OtstupWidth = (Width.Value - (Romb.Value * CountLineWidth)) / 2;  // отступ по ширине с краю
                OtstupHeight = (Height.Value - (Romb.Value * CountLineHeight)) / 2;   // отступ по высоте с краю
                PosLineWidth = Romb.Value;
                PosLineHeight = Romb.Value;
                for (i = 0; i < CountLineWidth; i++) {
                     for (j = 0; j < CountLineHeight; j++) {
                        ContRomb.Contour.AddLine(OtstupWidth + PosLineWidth * i, OtstupHeight + PosLineHeight * j, OtstupWidth + Romb.Value / 2 + PosLineWidth * i, OtstupHeight + Romb.Value / 2 + PosLineHeight * j);
                        ContRomb.Contour.AddLine(OtstupWidth + Romb.Value / 2 + PosLineWidth * i, OtstupHeight + Romb.Value / 2 + PosLineHeight * j, OtstupWidth + Romb.Value + PosLineWidth * i, OtstupHeight + PosLineHeight * j);
                        ContRomb.Contour.AddLine(OtstupWidth + PosLineWidth * i, OtstupHeight + Romb.Value + PosLineHeight * j, OtstupWidth + Romb.Value / 2 + PosLineWidth * i, OtstupHeight + Romb.Value / 2 + PosLineHeight * j);
                        ContRomb.Contour.AddLine(OtstupWidth + Romb.Value / 2 + PosLineWidth * i, OtstupHeight + Romb.Value / 2 + PosLineHeight * j, OtstupWidth + Romb.Value + PosLineWidth * i, OtstupHeight + Romb.Value + PosLineHeight * j);
                        // установка пуговиц
                        Button_.Mount1(Panel, OtstupWidth + PosLineWidth * i,  OtstupHeight + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + Romb.Value / 2 + PosLineWidth * i, OtstupHeight + Romb.Value / 2 + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + Romb.Value + PosLineWidth * i, OtstupHeight + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + PosLineWidth * i, OtstupHeight + Romb.Value + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + Romb.Value + PosLineWidth * i, OtstupHeight + Romb.Value + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                     }
                }
                for (i = 0; i <= CountLineWidth; i++) {
                       ContRomb.Contour.AddLine(OtstupWidth + PosLineWidth * i, OtstupHeight, OtstupWidth + PosLineWidth * i, 0);
                       ContRomb.Contour.AddLine(OtstupWidth + PosLineWidth * i, Height.Value - OtstupHeight, OtstupWidth + PosLineWidth * i, Height.Value);
                }
                for (j = 0; j <= CountLineHeight; j++) {
                       ContRomb.Contour.AddLine(OtstupWidth, OtstupHeight + PosLineHeight * j, 0, OtstupHeight + PosLineHeight * j);
                       ContRomb.Contour.AddLine(Width.Value - OtstupWidth, OtstupHeight + PosLineHeight * j, Width.Value, OtstupHeight + PosLineHeight * j);

                }
                ContRomb.Name = "Стяжка КВАДРАТ"
                ContRomb.Build();
                ContRomb.Translate(NewVector(0, 0, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness));
            } else if (Tip.Value == 'Утяжка с прострочкой') {
                ContRomb = AddContour();
                CountLineWidth = Math.floor( (Width.Value - WidthStroka.Value) / (Romb.Value + WidthStroka.Value));    // количество по горизонтали
                CountLineHeight = Math.floor( (Height.Value - WidthStroka.Value) / (Romb.Value + WidthStroka.Value));  // количество по вертикали
                OtstupWidth = (Width.Value - (Romb.Value * CountLineWidth) - (WidthStroka.Value * (CountLineWidth + 1))) / 2;  // отступ по ширине с краю
                OtstupHeight = (Height.Value - (Romb.Value * CountLineHeight) - (WidthStroka.Value * (CountLineHeight + 1))) / 2;   // отступ по высоте с краю
                PosLineWidth = Romb.Value + WidthStroka.Value;
                PosLineHeight = Romb.Value + WidthStroka.Value;
                for (i = 0; i <= CountLineHeight; i++) {
                    ContRomb.Contour.AddLine(0, OtstupHeight + PosLineHeight * i, Width.Value, OtstupHeight + PosLineHeight * i);
                    ContRomb.Contour.AddLine(0, WidthStroka.Value + OtstupHeight + PosLineHeight * i, Width.Value, WidthStroka.Value + OtstupHeight + PosLineHeight * i);
                }
                for (i = 0; i <= CountLineWidth; i++) {
                    ContRomb.Contour.AddLine(OtstupWidth + PosLineWidth * i, 0, OtstupWidth + PosLineWidth * i, Height.Value);
                    ContRomb.Contour.AddLine(WidthStroka.Value + OtstupWidth + PosLineWidth * i, 0, WidthStroka.Value + OtstupWidth + PosLineWidth * i, Height.Value);
                }
                ContRomb.Name = "Утяжка с прострочкой"
                ContRomb.Build();
                ContRomb.Translate(NewVector(0, 0, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness));
                // установка пуговиц
                for (i = 0; i <= CountLineWidth; i++) {
                     for (j = 0; j <= CountLineHeight; j++) {
                        Button_.Mount1(Panel, OtstupWidth + PosLineWidth * i + WidthStroka.Value / 2,  OtstupHeight + PosLineHeight * j + WidthStroka.Value / 2, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                     }
                }

            } else if (Tip.Value == 'Пуговица РОМБ') {
                LineRomb = Math.sqrt(2 * Math.pow(Romb.Value, 2));
                CountLineWidth = Math.floor(Width.Value / LineRomb);    // количество по горизонтали
                CountLineHeight = Math.floor(Height.Value / LineRomb);  // количество по вертикали
                OtstupWidth = (Width.Value - (LineRomb * CountLineWidth)) / 2;  // отступ по ширине с краю
                OtstupHeight = (Height.Value - (LineRomb * CountLineHeight)) / 2;   // отступ по высоте с краю
                PosLineWidth = LineRomb;
                PosLineHeight = LineRomb;
                for (i = 0; i < CountLineWidth; i++) {
                     for (j = 0; j < CountLineHeight; j++) {
                        // установка пуговиц
                        Button_.Mount1(Panel, OtstupWidth + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb / 2, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + LineRomb / 2 + PosLineWidth * i, OtstupHeight + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + LineRomb / 2 + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + LineRomb + PosLineWidth * i, OtstupHeight + PosLineHeight * j + LineRomb / 2, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                     }
                }
            } else if (Tip.Value == 'Пуговица КВАДРАТ') {
                CountLineWidth = Math.floor(Width.Value / Romb.Value);    // количество по горизонтали
                CountLineHeight = Math.floor(Height.Value / Romb.Value);  // количество по вертикали
                OtstupWidth = (Width.Value - (Romb.Value * CountLineWidth)) / 2;  // отступ по ширине с краю
                OtstupHeight = (Height.Value - (Romb.Value * CountLineHeight)) / 2;   // отступ по высоте с краю
                PosLineWidth = Romb.Value;
                PosLineHeight = Romb.Value;
                for (i = 0; i < CountLineWidth; i++) {
                     for (j = 0; j < CountLineHeight; j++) {
                        // установка пуговиц
                        Button_.Mount1(Panel, OtstupWidth + PosLineWidth * i,  OtstupHeight + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + Romb.Value / 2 + PosLineWidth * i, OtstupHeight + Romb.Value / 2 + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + Romb.Value + PosLineWidth * i, OtstupHeight + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + PosLineWidth * i, OtstupHeight + Romb.Value + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                        Button_.Mount1(Panel, OtstupWidth + Romb.Value + PosLineWidth * i, OtstupHeight + Romb.Value + PosLineHeight * j, MatSpanbond.Thickness + MatDSP.Thickness + MatPPU.Thickness + MatCloth.Thickness, 0);
                     }
                }
            }
        EndParametricBlock();
    }
}