String.prototype.float = function() {
  return parseFloat(this.replace(',', '.'));
}

function ltrim(s) {
  return s.replace(/^\s+/, '');
}

function rtrim(s) {
  return s.replace(/\s+$/, '');
}

function trim(s) {
  return rtrim(ltrim(s));
}

Make();
Action.Finish();

function Make() {
  file = system.askReadTextFile('obl');
  arr = file.split('\n');
  TekMat = '';
  TekThick = 16;
  np = 0;
  PosX = -100;
  PosZ = -100;
  PX = 0;
  GSx = 0;
  DeleteNewObjects();
  for (k = 0; k < arr.length; k++) {
    val = arr[k];
    if (val.length > 300) continue;
    vals = val.split('\t');
    if (((vals[0] == "Material") || (vals[0] == "Material ")) && (vals[2] == "Slab")) {
      if (TekMat != vals[1]) {
        if (TekMat != '') PosZ = Model.GSize.z;
        if (vals[4] != 0) TekThick = vals[4];
        PX = 0;
        GSx = -100;
        PosX = -100;
      }
      TekMat = vals[1];
      continue;
    }

    if (((vals[0] == "Material") || (vals[0] == "Material ")) && (vals[2] != "Slab")) TekMat = "";
//alert('111 "' + vals[0] + '" "' + vals[2] + '" "' + TekMat + '"');

    if (TekMat == "") continue;
    if (trim(val) == "") continue;

    Poz = vals[0];
    Dl = vals[1].float();
    Sh = vals[2].float();
    Kol = vals[3].float();
    Orient = vals[4];
    Name = vals[5];

    L1Name = vals[7];
    L1Obozn = vals[8];
    L1Thickness = vals[9].float();
    L1Sves = vals[26].float();

    W1Name = vals[10];
    W1Obozn = vals[11];
    W1Thickness = vals[12].float();
    W1Sves = vals[27].float();

    L2Name = vals[13];
    L2Obozn = vals[14];
    L2Thickness = vals[15].float();
    L2Sves = vals[28].float();

    W2Name = vals[16];
    W2Obozn = vals[17];
    W2Thickness = vals[18].float();
    W2Sves = vals[29].float();

    if (TekMat != "") {
      for (k2 = 0; k2 < Kol; k2++) {
        DeleteNewObjects();
        Panel = AddHorizPanel(0, 0, Dl, Sh, 0);
        Panel.Thickness = TekThick;
        if ((trim(L1Obozn) != "")) {
          Butt = Panel.Butts.Add();
          Butt.ElemIndex = 2;
          Butt.Material = L1Name;
          Butt.Sign = L1Obozn;
          Butt.Thickness = L1Thickness;
          Butt.Overhung = L1Sves;
          Butt.ClipPanel = false;
        }
        if ((trim(W1Obozn) != "")) {
          Butt = Panel.Butts.Add();
          Butt.ElemIndex = 3;
          Butt.Material = W1Name;
          Butt.Sign = W1Obozn;
          Butt.Thickness = W1Thickness;
          Butt.Overhung = W1Sves;
          Butt.ClipPanel = false;
        }
        if ((trim(L2Obozn) != "")) {
          Butt = Panel.Butts.Add();
          Butt.ElemIndex = 0;
          Butt.Material = L2Name;
          Butt.Sign = L2Obozn;
          Butt.Thickness = L2Thickness;
          Butt.Overhung = L2Sves;
          Butt.ClipPanel = false;
        }
        if ((trim(W2Obozn) != "")) {
          Butt = Panel.Butts.Add();
          Butt.ElemIndex = 1;
          Butt.Material = W2Name;
          Butt.Sign = W2Obozn;
          Butt.Thickness = W2Thickness;
          Butt.Overhung = W2Sves;
          Butt.ClipPanel = false;
        }
        Panel.Name = Name;
        Panel.MaterialName = TekMat;
        Panel.Thickness = TekThick;
        if (Orient != " ") Panel.TextureOrientation = TextureOrientation.None
        else Panel.TextureOrientation = TextureOrientation.Horizontal;
        Panel.PositionX = PosX + 100;
        Panel.PositionY = k2 * TekThick;
        Panel.PositionZ = PosZ + 100;
        PX = Panel.PositionX;
        GSx = Panel.GSize.x;
        Action.Commit();
      }
      PosX = PX + GSx;
    }
  }
}