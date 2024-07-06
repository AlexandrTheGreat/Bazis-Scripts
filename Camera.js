ADS = Action.DS.Camera;

MyAngleY = 35;
ADS.AngleX = 10;
Step = 45; // Можно указать 45, будет 8 ракурсов

rest = ((ADS.AngleY - MyAngleY) % Step);
ADS.AngleY += rest ? -rest : Step;

if (Action.Control.Projection !== 8)
    SetCamera(8);  // Перспектива
Action.Control.ViewAll(); //Показать все