$(document).ready(function(){
	var dbName=window.openDatabase("SVTDB",1.0,"SVTDB",5242880);
	var gId;
	var lid;
	//Method to Initialize DB
	function dbtInitialize(){
		if (window.openDatabase) {
			dbName.transaction(function(tx){
				tx.executeSql("create table if not exists svtwtable(wId integer primary key,wName text,wMobile text,wSalary real)");
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
			$("#wplist").append("<li id='"+row.wId+"' class='wl'><a href='#'>"+row.wName+"</a></li>");
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
		toastAlert("Saved Profile");
		$("#wplist").html("");			
		$(":mobile-pagecontainer").pagecontainer("change","#wp-page");
		readProfile();
	}

	//Method to Print Selected Weaver Profile
	function printProfile(transaction,results){
		var row=results.rows.item(0);
		$(":mobile-pagecontainer").pagecontainer("change","#wsal-page");		
		$("#dname").text("Name: "+row.wName);
		$("#dmbl").text("Mobile: "+row.wMobile);
		$("#dsal").text("Wage: "+row.wSalary);		
		$("#salcalbtn").tap(function(){
			var workeDays=$("#wdays").val();
			if (workeDays!==0) {
				var netPayable=workeDays*row.wSalary;
				$("#payable").text("Amount Payable: "+netPayable);
			}
		});
	}

	function updateProfile(transaction,results){
		var row=results.rows.item(0);
		$(":mobile-pagecontainer").pagecontainer("change","#wpedit-page");
		gId=row.wId;
		$("#nname").val(row.wName);
		$("#nsal").val(row.wSalary);
		$("#nmbl").val(row.wMobile);
		
	}
	//Updates the Table row
	$("#updbtn").tap(function(){
			var uname=$("#nname").val();
			var usal=$("#nsal").val();
			var umbl=$("#nmbl").val();
			dbName.transaction(function(tx){
				tx.executeSql("update svtwtable set wName=?,wMobile=?,wSalary=? where wId='"+gId+"'",[uname,umbl,usal]);
			});
			toastAlert("Updated Successfully");
			$(":mobile-pagecontainer").pagecontainer("change","#wp-page");
			$("#wplist").html("");
			readProfile();
		});
	//Method to Read Selected Weaver Profile for Editing
	function editProfile(sid){
		dbName.transaction(function(tx){			
			tx.executeSql('SELECT * from svtwtable Where wId = "'+ sid+ '"', [], updateProfile);
		});
	}

	//Method to Read Selected Weaver Profile for Displaying
	function viewProfile(sid){
		dbName.transaction(function(tx){			
			tx.executeSql('SELECT * from svtwtable Where wId = "'+ sid+ '"', [], printProfile);
		});
	}

	//Method to List for delete
	function listforDelete(transaction,results){
		for(var i=0;i<results.rows.length;i++){
			var row=results.rows.item(i);
			$("#wpdlist").append("<li id='"+row.wId+"' class='wl'><a href='#'>"+row.wName+"</a></li>");
		}
		$("#wpdlist").listview("refresh");
	}
	//Method to Read for delete
	function readforDelete(){		
		dbName.transaction(function(tx){
			tx.executeSql("select * from svtwtable",[],listforDelete);
		});		
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

	//Method to display Toast Alerts

	function toastAlert(msg){
		window.plugins.toast.showLongBottom(msg);
	}

	//Method to refresh pw-page
	function reloadPage(){
		$("#pw1").val("");
		$("#pw2").val("");
		$("#result").text("");
	}

	//On Promptbox Success
	function onConfirm(buttonIndex) {
    if (buttonIndex==1) {
    	deleteProfile(lid);
    }
    else {
    	toastAlert("No Profiles Deleted");
    	$("#wpdlist").html(" ");
		readforDelete();
    }
}

function deleteProfile(lid){
	dbName.transaction(function(tx){
					tx.executeSql("delete from svtwtable where wId='"+lid+"'");					
				});
				toastAlert("Deleted Profile");
				$("#wpdlist").html("");
				readforDelete();
}

	

	//Initialize DB on Starting
	dbtInitialize();
	readProfile();
	//Displays Weavers Page
	$("#wpbtn").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#wp-page");
		$("#wplist").html("");
		readProfile();		
	});

	//Save Weaver Profile
	$("#savebtn").tap(saveProfile);

	//Displays Home Page
	$(".home").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#home-page");
	});

	//Displays the details of the selected Weaver	
	$(document).on("click","#wplist li",function(){
				viewProfile($(this).attr('id'));
		});

	//Displays the details of the selected Weaver	
	$(document).on("taphold","#wplist li",function(){
				editProfile($(this).attr('id'));
		});

	//Used to deleteinfo on Swipe
	$(document).on("tap","#wpdlist li",function(){				
				lid=$(this).closest('li').attr('id');
				//Display an Alert before Delete
				navigator.notification.confirm(
					'Do You Want to Delete?',
					onConfirm,
					'Delete Profile Confirmation'
					);
				/*dbName.transaction(function(tx){
					tx.executeSql("delete from svtwtable where wId='"+lid+"'");					
				});
				toastAlert("Deleted Profile");
				$("#wpdlist").html("");
				readforDelete(); */
		});
	//Displays Pick Wheel Page
	$("#pwbtn").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#pw-page");		
	});

	//Displays Delete Page
	$("#dpbtn").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#wpdelete-page");
		$("#wpdlist").html(" ");
		readforDelete();		
	});
	
	//Reloads the Pick Wheel Page
	$("#refbtn").tap(reloadPage);
	//Calls calculate method
	$("#calcbtn").tap(calculate);
//Loaded all DOM elements
});
