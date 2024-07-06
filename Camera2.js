var Views = [{X: 50, Y: 35, Proj: 8, All: 1}
           , {X: 50, Y: -35, Proj: 7, All: 1}
           , {X: -50, Y: -35, Proj: 8, All: 1}
           , {X: -50, Y: 35, Proj: 8, All: 0}]

var match = ''

ADS = Action.DS.Camera
X = ADS.AngleX
Y = ADS.AngleY
Proj = Action.Control.Projection

for (var key in Views) {
    obj = Views[key]
    if (obj.X == X && obj.Y == Y && obj.Proj == Proj) {
        match = key
        break
    }
};

match = (match == '') ? 0 : (match == (Views.length - 1)) ? 0 : (++match)

obj = Views[match]
ADS.AngleX = obj.X
ADS.AngleY = obj.Y
SetCamera(obj.Proj)
if (obj.All)
    Action.Control.ViewAll()