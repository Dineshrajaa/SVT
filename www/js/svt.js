$(document).ready(function(){
	function calculate(){
		var p1=$("#pw1").val();
		var p2=$("#pw2").val();
		if (p1!=0&&p2!=0) {
			var op=(p1/p2)*2.54*2+2;
			$("#result").text(op);
		}
	}

	$("#calcbtn").tap(calculate);
//Loaded all DOM elements
});