function setup() {
	var canvas = createCanvas(600,300);

	background(255);
	canvas.parent('EMdrawing');
}

function drawMagnet(Ds,Dc,Lt) {
	clear();
	
	// we want the drawings to be proportional to the dimensions but still fit within the canvas dimensions
	let diaSol = Ds;
	let diaCore = Dc;
	let height = Lt;
	var wireGuage = 1.0;
	var spacingY = wireGuage+0.5;
	var coreHeight = 0;
	var coreWidth = 0;
	var coilHeight = 0;
	var coilWidth = 0;
	var drawSize = 160;
	print(diaSol,diaCore,height);
	
	if (height > diaSol) {
		coreHeight = drawSize;
		coreWidth = drawSize * (diaCore/height);
		coilHeight = drawSize;
		coilWidth = drawSize * diaSol / height; 
		print("tall")
	} else {
		coreHeight = drawSize * height / diaSol;
		coreWidth = drawSize * diaCore / diaSol;
		coilHeight = drawSize * height / diaSol;
		coilWidth = drawSize; 
		print("wide")
	}
	
	let coreStartX = 150 - (coreWidth/2);
	let coreStartY = 150 - (coreHeight/2);

	let coilStartX = 150 - (coilWidth/2);
	let coilStartY = 150 - (coilHeight/2);
	
	background(255);
	
	stroke(155,155,155);
	line(300,0,300,300);
	
	noStroke();
	fill(155,155,155);
	rect(coreStartX,coreStartY,coreWidth,coreHeight);
	
	rect(450-(coreWidth/2),150-(coreWidth/2),coreWidth,coreWidth);
	
	for (i=0;i<coilHeight;i+=spacingY) {
		stroke(184, 115, 51);
		line(coilStartX,coilStartY+i,coilStartX+coilWidth,coilStartY+i);
	}

	for (i=coreWidth;i<coilWidth;i+=2*spacingY) {
		noFill();
		stroke(184, 115, 51);
		rect(450-(i/2),150-(i/2),i,i);
	}

	stroke(0);
	fill(0);
	textAlign(LEFT);
	
	//XY01
	line(10,290,10,260);
	text('Y',7,255);
	line(10,290,40,290);
	text('X',45,293);
	
	//XZ02
	line(590,290,590,260);
	text('Z',586,255);
	line(560,290,590,290);
	text('X',548,293);

	stroke(0)
	fill(0)
	textAlign(RIGHT);
	
	//Dim 1.1
	var dim1txt = height+' mm';
	line(coilStartX-20,coilStartY,coilStartX-20,(coilStartY+coilHeight));
	line(coilStartX-25,coilStartY,coilStartX-15,coilStartY);
	line(coilStartX-25,(coilStartY+coilHeight),coilStartX-15,(coilStartY+coilHeight));
	text(dim1txt,coilStartX-25,(coilStartY+(coilHeight/2)));
	
	//Dim 1.2
	var dim2txt = diaSol + ' mm';
	line(coilStartX,coilStartY-20,coilStartX+coilWidth,coilStartY-20);
	line(coilStartX,coilStartY-25,coilStartX,coilStartY-15);
	line(coilStartX+coilWidth,coilStartY-25,coilStartX+coilWidth,coilStartY-15);
	text(dim2txt,coilStartX+(coilWidth/2),(coilStartY-25));
	
	
	//Dim 2.1
	var dim4txt = diaCore + ' mm';
	line(300+coreStartX,150-(coilWidth/2)-15,300+coreStartX+coreWidth,150-(coilWidth/2)-15);
	line(300+coreStartX,150-(coilWidth/2)-20,300+coreStartX,150-(coilWidth/2)-10);
	line(300+coreStartX+coreWidth,150-(coilWidth/2)-20,300+coreStartX+coreWidth,150-(coilWidth/2)-10);
	text(dim4txt,450,150-(coilWidth/2)-20);
}

function Calculate() {
	
	// This is to calculate the turns and length of copper wiring for electromagents
	var Lt = parseFloat(document.getElementById("Lt").value); //traverse height of solenoid mm
	var Dw = parseFloat(document.getElementById("Dw").value); //diameter of wire mm
	var Rn; //level radius
	var Dc = parseFloat(document.getElementById("Dc").value); //core diameter mm
	var n; // number of solenoid levels
	var Lw = 0; //length of wire
	var Ds = parseFloat(document.getElementById("Ds").value); //Diameter of Solenoid mm
	var Lp; //loops per level
	//var Uc = (4*3.1415)*(1e-7) ;//permativity of free space (H/m)
	//var Us = 0.0025132; //permativity of mild steel
	var Ui = 6.3*(1e-3); //permativity of iron
	var Rw = parseFloat(document.getElementById("Rw").value); //resistance of wire per 1000 m
	var I = parseFloat(document.getElementById("I").value); //max safe amp
	var Vm; //volt variable	
	var Dg = parseFloat(document.getElementById("Dg").value); //gap between electromagnet surface and magnetic object
	
	if (Lt && Ds && Dc && Dw && Rw && I && Dg) {
		
		drawMagnet(Ds,Dc,Lt);

		n = Math.floor(((Ds - Dc)/2)/Dw);
		Lp = Math.floor(Lt/Dw);
			
		for (i=1;i<=n;i++) {
			Rn = ((i-1)*(Dw/2)*(Math.sqrt(3)))+(Dw/2)+(Dc/2);
			length = (2)*(3.1415)*(Rn)*Lp;
			Lw= Lw + length;
		}
		Lw = Lw/1000;
		Ntotal = Lp * n;
			
		Res = (Rw/1000)*(Lw);
		Vm = I * Res;
		var MFS = Ui * (Ntotal/(Lt/1000)) * I; // B = (T * m /A)(turns/m)(Amps) Magnetic Field Strength
		var HFC = (Ntotal * I)**2 * Ui * ((Dc/1000)**2) / (2 * ((Dg/1000)**2)); // F = (turns * Amps)^2 (Uo)(m^2)/(2*m^2) Magnetic Force at distance
				
		document.getElementById("myText").innerText = Math.round(Lw * 100)/100;
		document.getElementById("that").innerText = Ntotal;
		document.getElementById("res").innerText = Math.round(Res * 100)/100;
		document.getElementById("Volt").innerText = Math.round(Vm * 100)/100;
		document.getElementById("MFS").innerText = Math.round(MFS * 100)/100;
		document.getElementById("HFC").innerText = Math.round(HFC * 100)/100;
			
		resetInput();
	} else {
		inputError();
	}
}
	
function inputError() {
	document.getElementById("input_box").style.color = 'red'
	document.getElementById("input_box").innerText = "Fill in All Inputs"
}
function resetInput () {
	document.getElementById("input_box").style.color = 'black'
	document.getElementById("input_box").innerText = "Inputs"
}