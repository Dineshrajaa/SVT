$(document).ready(function(){
	var dbName=window.openDatabase("SVTDB",1.0,"SVTDB",5242880);
	//Method to Initialize DB
	function dbtInitialize(){
		if (window.openDatabase) {
			dbName.transaction(function(tx){
				tx.executeSql("create table if not exists svtwtable(wId integer primary key asc,wName text,wMobile text,wSalary real)");
				});
		}
		else{
			alert("Sorry You can't Save data");
		}
	}

	//Method to Read Weaver Profile
	function readProfile(){		
		dbName.transaction(function(tx){
			tx.executeSql("select * from svtwtable",[],listProfile);
		});
	}

	//Method to List Weaver Profile
	function listProfile(transaction,results){
		for(var i=0;i<results.rows.length;i++){
			var row=results.rows.item(i);
			$("#wplist").append("<li id="+row.wId+"><a href='#'>"+row.wName+"</a></li>");
		}
		$("#wplist").listview("refresh");
	}

	//Method to save Weaver Profile
	function saveProfile(){
		var pname=$("#wname").val();
		var pmobile=$("#wmobile").val();
		var psal=$("#wsal").val();
		dbName.transaction(function(tx){
			tx.executeSql("insert into svtwtable(wName,wMobile,wSalary) values(?,?,?)",[pname,pmobile,psal]);
			});
		$(":mobile-pagecontainer").pagecontainer("change","#wp-page");
	}

	//Method to Calculate Pick Wheel Reading
	function calculate(){
		var p1=$("#pw1").val();
		var p2=$("#pw2").val();
		if (p1!==0&&p2!==0) {
			var op=(p1/p2)*254*0.2+2;
			$("#result").text(op);
		}
	}

	

	//Initialize DB on Starting
	dbtInitialize();
	
	//Displays Weavers Page
	$("#wpbtn").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#wp-page");
		readProfile();
	});

	//Save Weaver Profile
	$("#savebtn").tap(saveProfile);

	//Displays Pick Wheel Page
	$("#pwbtn").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#pw-page");
	});

	//Calls calculate method
	$("#calcbtn").tap(calculate);
//Loaded all DOM elements
});