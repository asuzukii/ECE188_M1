import Point from "./Point";

//
// Rectangle class
//
class Rectangle {
    constructor(x, y, width, height) {
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
    }
}

//
// Unistroke class: a unistroke template
//
class Unistroke {
    constructor(name, points) {
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
    }
}

//
// Result class
//
class Result {
    constructor(name, score, ms) {
	this.Name = name;
	this.Score = score;
	this.Time = ms;
    }
}

//
// DollarRecognizer constants
//
const NumUnistrokes = 16;
const NumPoints = 64;
const SquareSize = 250.0;
const Origin = new Point(0,0);
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = 0.5 * Diagonal;
const AngleRange = Deg2Rad(45.0);
const AnglePrecision = Deg2Rad(2.0);
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
class DollarRecognizer {
    constructor() {
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = [NumUnistrokes];
	this.Unistrokes[0] = new Unistroke("frown", [new Point(-126,0),new Point(-119,-7),new Point(-112,-15),new Point(-106,-22),new Point(-99,-29),new Point(-93,-37),new Point(-86,-44),new Point(-79,-51),new Point(-72,-58),new Point(-65,-65),new Point(-58,-73),new Point(-51,-80),new Point(-44,-87),new Point(-37,-94),new Point(-30,-100),new Point(-23,-107),new Point(-16,-114),new Point(-8,-120),new Point(-2,-124),new Point(0,-116),new Point(1,-106),new Point(1,-96),new Point(2,-86),new Point(3,-76),new Point(3,-66),new Point(4,-56),new Point(5,-46),new Point(5,-36),new Point(5,-26),new Point(5,-16),new Point(4,-6),new Point(3,4),new Point(3,14),new Point(3,24),new Point(2,34),new Point(1,44),new Point(0,54),new Point(-1,64),new Point(-1,74),new Point(-3,84),new Point(-3,94),new Point(-4,104),new Point(-5,114),new Point(-5,124),new Point(-2,126),new Point(4,118),new Point(9,110),new Point(15,103),new Point(22,95),new Point(29,88),new Point(35,80),new Point(42,73),new Point(49,66),new Point(56,59),new Point(63,52),new Point(70,45),new Point(76,37),new Point(84,31),new Point(91,24),new Point(98,16),new Point(105,10),new Point(112,3),new Point(119,-4),new Point(124,-8)]);
	this.Unistrokes[1] = new Unistroke("smile", [new Point(-142,0),new Point(-136,4),new Point(-130,8),new Point(-124,14),new Point(-119,19),new Point(-114,25),new Point(-108,32),new Point(-103,38),new Point(-98,45),new Point(-93,51),new Point(-90,59),new Point(-86,66),new Point(-82,73),new Point(-78,80),new Point(-73,87),new Point(-69,94),new Point(-65,101),new Point(-60,105),new Point(-59,99),new Point(-56,92),new Point(-52,85),new Point(-47,79),new Point(-42,73),new Point(-35,68),new Point(-29,62),new Point(-23,57),new Point(-17,52),new Point(-11,46),new Point(-5,41),new Point(2,36),new Point(8,31),new Point(14,26),new Point(21,22),new Point(28,17),new Point(34,13),new Point(41,8),new Point(47,4),new Point(54,-1),new Point(60,-5),new Point(67,-9),new Point(73,-14),new Point(80,-17),new Point(86,-19),new Point(92,-24),new Point(98,-29),new Point(103,-35),new Point(108,-41),new Point(108,-45),new Point(103,-51),new Point(98,-58),new Point(93,-64),new Point(88,-71),new Point(83,-77),new Point(77,-82),new Point(72,-89),new Point(67,-96),new Point(62,-102),new Point(57,-109),new Point(51,-115),new Point(46,-120),new Point(40,-126),new Point(34,-131),new Point(29,-138),new Point(25,-145)]);
    this.Unistrokes[2] = new Unistroke("zzz", [new Point(-121,0),new Point(-114,-8),new Point(-107,-17),new Point(-101,-25),new Point(-93,-33),new Point(-85,-41),new Point(-77,-49),new Point(-69,-57),new Point(-61,-64),new Point(-52,-71),new Point(-44,-78),new Point(-35,-84),new Point(-26,-91),new Point(-17,-97),new Point(-8,-103),new Point(0,-110),new Point(10,-116),new Point(19,-121),new Point(18,-113),new Point(16,-103),new Point(15,-92),new Point(14,-82),new Point(13,-73),new Point(12,-62),new Point(11,-50),new Point(8,-40),new Point(6,-29),new Point(3,-18),new Point(0,-7),new Point(-3,4),new Point(-5,15),new Point(-8,26),new Point(-11,36),new Point(-13,47),new Point(-15,58),new Point(-17,69),new Point(-20,80),new Point(-22,91),new Point(-25,101),new Point(-28,111),new Point(-33,121),new Point(-37,129),new Point(-31,125),new Point(-25,116),new Point(-18,108),new Point(-11,100),new Point(-3,92),new Point(5,84),new Point(13,76),new Point(21,69),new Point(29,61),new Point(37,53),new Point(46,45),new Point(54,38),new Point(62,30),new Point(70,22),new Point(79,15),new Point(87,8),new Point(96,1),new Point(104,-7),new Point(112,-14),new Point(121,-21),new Point(129,-29),new Point(128,-26)]);
    this.Unistrokes[3] = new Unistroke("cry", [new Point(-133,0),new Point(-126,-5),new Point(-117,-11),new Point(-108,-17),new Point(-98,-23),new Point(-89,-29),new Point(-80,-35),new Point(-70,-41),new Point(-61,-46),new Point(-52,-53),new Point(-42,-59),new Point(-33,-65),new Point(-23,-71),new Point(-14,-77),new Point(-5,-83),new Point(5,-89),new Point(14,-95),new Point(24,-100),new Point(34,-105),new Point(44,-109),new Point(53,-114),new Point(63,-117),new Point(62,-106),new Point(58,-94),new Point(53,-82),new Point(47,-71),new Point(41,-60),new Point(35,-50),new Point(29,-39),new Point(23,-28),new Point(17,-16),new Point(12,-5),new Point(6,6),new Point(1,18),new Point(-5,29),new Point(-10,41),new Point(-15,53),new Point(-20,65),new Point(-25,77),new Point(-30,89),new Point(-35,100),new Point(-41,111),new Point(-46,122),new Point(-50,133),new Point(-43,126),new Point(-36,117),new Point(-28,109),new Point(-20,101),new Point(-12,93),new Point(-4,84),new Point(4,76),new Point(12,68),new Point(21,61),new Point(30,53),new Point(38,46),new Point(47,39),new Point(56,32),new Point(65,25),new Point(74,18),new Point(83,12),new Point(92,5),new Point(101,-1),new Point(110,-6),new Point(117,-6)]);
    this.Unistrokes[4] = new Unistroke("check", [new Point(-120,0),new Point(-111,1),new Point(-103,3),new Point(-98,9),new Point(-91,13),new Point(-85,18),new Point(-81,25),new Point(-77,31),new Point(-73,38),new Point(-69,44),new Point(-66,51),new Point(-64,58),new Point(-60,65),new Point(-56,71),new Point(-53,78),new Point(-51,85),new Point(-49,92),new Point(-45,99),new Point(-42,105),new Point(-38,112),new Point(-35,117),new Point(-36,110),new Point(-35,103),new Point(-34,95),new Point(-33,88),new Point(-32,81),new Point(-31,74),new Point(-29,66),new Point(-28,59),new Point(-26,52),new Point(-24,45),new Point(-21,38),new Point(-18,31),new Point(-15,24),new Point(-12,17),new Point(-9,11),new Point(-5,4),new Point(-1,-3),new Point(3,-9),new Point(8,-15),new Point(13,-21),new Point(19,-26),new Point(25,-32),new Point(30,-38),new Point(35,-44),new Point(41,-49),new Point(47,-55),new Point(52,-60),new Point(57,-66),new Point(63,-72),new Point(69,-77),new Point(76,-82),new Point(82,-87),new Point(88,-92),new Point(94,-98),new Point(99,-103),new Point(105,-109),new Point(111,-114),new Point(117,-120),new Point(122,-125),new Point(127,-131),new Point(130,-133),new Point(125,-128),new Point(118,-123)]);

    //
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points) {
		var t0 = Date.now();
		var candidate = new Unistroke("", points);

		var u = -1;
		var b = +Infinity;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke template
		{
			var d = DistanceAtBestAngle(candidate.Points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision); // Golden Section Search (original $1)
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke index
			}
		}
		var t1 = Date.now();
		return (u === -1) ? new Result("No match.", 0.0, t1-t0) : new Result(this.Unistrokes[u].Name, (1.0 - b / HalfDiagonal), t1-t0);
	}
	this.AddGesture = function(name, points) {
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name === name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = () => {
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
}
//
// Private helper functions from here on down
//
function Resample(points, n) {
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = [points[0]];
	for (var i = 1; i < points.length; i++) {
		var d = Distance(points[i-1], points[i]);
		if ((D + d) >= I) {
			var qx = points[i-1].X + ((I - D) / d) * (points[i].X - points[i-1].X);
			var qy = points[i-1].Y + ((I - D) / d) * (points[i].Y - points[i-1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length === n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}

function IndicativeAngle(points) {
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}

function RotateBy(points, radians) { // rotates points around centroid
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = [];
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}

function ScaleTo(points, size) { // non-uniform scale; assumes 2D gestures (i.e., no lines)
	var B = BoundingBox(points);
	var newpoints = [];
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) {
	var c = Centroid(points);
	var newpoints =[];
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}

function Vectorize(points) {
	var sum = 0.0;
	var vector = [];
	for (let i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (let i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}

function DistanceAtBestAngle(points, T, a, b, threshold) {
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold) {
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}

function DistanceAtAngle(points, T, radians) {
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}

function Centroid(points) {
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}

function BoundingBox(points) {
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}

function PathDistance(pts1, pts2) {
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}

function PathLength(points) {
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}

function Distance(p1, p2) {
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}

function Deg2Rad(d) { return (d * Math.PI / 180.0); }

export default DollarRecognizer;