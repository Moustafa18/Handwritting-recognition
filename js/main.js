
window.onload = function () {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName === "back"){
		try {
		    tizen.application.getCurrentApplication().exit();
		} catch (ignore) {
		}
	}
    });

    var secondsLabel = document.getElementById('seconds');
    var minutesLabel = document.getElementById('minutes');
    var hoursLabel = document.getElementById('hours');
    var totalSeconds = 0;
    var startButton = document.getElementById('start'); 
    var stopButton = document.getElementById('stop');
    var evaluateButton = document.getElementById('evaluate');
    var timer = null;
    var stopListening=true;
    var txtfield = document.getElementById('char');
    var serverip=document.getElementById('serverip');
    var counter=0;
    var ms=0;
    var data="";   
    var invocation = new XMLHttpRequest();
    var noOfSamples=document.getElementById('noOfSamples');
    var eventTime= 0;
	var dT=0;
	var rotx,roty,rotz,curAnglex=0,curAngley=0,curAnglez=0;
    
    //var url = 'http://localhost:8081/store';
   // var body = '<?xml version="1.0"?><person><name>Arun</name></person>';
    var obj ="{\"fileName\":\"a\", \"data\":\"1\"} ";

	var header= "seconds, ax, ay, az, amag, lax, lay, laz, lamag, gyrox, gyroy, gyroz, rotaionx, rotaiony, rotaionz \\r\\n";
	data=header;
	
    function callOtherDomain(){
    	var url = 'http://'+serverip.value+':8081/store';
    	if(invocation)
        {
    		invocation.open('POST', url, true);
    		invocation.setRequestHeader('X-PINGOTHER', 'pingpong');
    		invocation.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    		//invocation.onreadystatechange = handler;
    		//invocation.send(JSON.stringify(obj));
    		invocation.send(obj);
       	}
    }
//    function makeTextFile(text) {
//    	var data = new Blob([text], {type: 'text/plain'});
//    	textFile = window.URL.createObjectURL(data);
//    	// textFile = window.URL.createObjectURL(new Blob([text], {type: "data:attachment/text"}));
//    	return textFile;
//     }
// window.URL.revokeObjectURL(textFile);
// };
    		 
    		 
//     create.onclick = function () {
//    	 var link = document.getElementById('downloadlink');
//    	 link.href = makeTextFile("Helloooo");
//    	 //link.style.display = 'block';
//     };
    	

    
    function setTime() {
    	  totalSeconds++;
    	  secondsLabel.innerHTML = pad(totalSeconds % 60);
    	  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
    	  hoursLabel.innerHTML = pad(parseInt(totalSeconds / 3600));
    }

	startButton.onclick = function() {
		if (!timer) {
		    timer = setInterval(setTime, 1000);
		 } 
		 data=header;
		 stopListening=false;
		 //counter=0;
			
		//curAnglex=0,curAngley=0,curAnglez=0,eventTime= 0, dT=0;
		  
	};

	stopButton.onclick = function() {
		if(stopListening!=true){
			obj ="{\"fileName\":\""+txtfield.value+"\", \"data\":\""+data+" \"} ";
			callOtherDomain();
			if (timer) {
				clearInterval(timer);
				timer = null;
				//stop();
			}
			stopListening=true;
			  
	//		  var link = document.getElementById('downloadlink');
	//		  link.innerHTML = makeTextFile("Helloooo");
	//		  link.style.display = 'block';
			counter=0;
			data=header;
			curAnglex=0,curAngley=0,curAnglez=0,eventTime= 0, dT=0;
			//ms=0;
			
	//		document.getElementById("xaccel").innerHTML = 'AccX : ' ;
	//		document.getElementById("yaccel").innerHTML = 'AccY : ' ;
	//		document.getElementById("zaccel").innerHTML = 'AccZ : ' ;
//		  	  
		}
	};

	evaluateButton.onclick = function() {
		// put the result on the text of id evaluation (true or false)
		
		

		
		
		
		if (timer) {
			totalSeconds = 0;
			stop();
		}
		counter=0;
		ms=0;
		data="";
		txtfield.value="";
		curAnglex=0,curAngley=0,curAnglez=0,eventTime= 0, dT=0;
		/*document.getElementById("xaccel").innerHTML = 'AccX : ' ;
		document.getElementById("yaccel").innerHTML = 'AccY : ' ;
		document.getElementById("zaccel").innerHTML = 'AccZ : ' ;*/

	};

	function pad(val) {
	  var valString = val + "";
	  if (valString.length < 2) {
	    return "0" + valString;
	  } else {
	    return valString;
	  }
	}


    function getMagnitude(x,y,z){
    	return Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2)+Math.pow(z, 2));
    	
    }
    window.addEventListener('devicemotion', function(e) {
    	
    	if(!stopListening && counter <= parseInt(noOfSamples.value)){
    		var d = new Date(); // for now
    		//ms=d.getMilliseconds();
    		//console.log(d.getTime());
    		//acceleration m/ s^2
    		//x - Represents the acceleration upon the x axis which is the west to east axis
    		//y - Represents the acceleration upon the y axis which is the south to north axis
    	    //z - Represents the acceleration upon the z axis which is the down to up axis 
    		
    		var ax = e.accelerationIncludingGravity.x;
			var ay = e.accelerationIncludingGravity.y;
			var az = e.accelerationIncludingGravity.z;
			
			var lax = e.acceleration.x;
			var lay = e.acceleration.y;
			var laz = e.acceleration.z;
			
			var gyrox = e.rotationRate.beta  //beta : The amount of rotation around the X axis, in degrees per second.
			var gyroy = e.rotationRate.gamma;//gamma : The amount of rotation around the Y axis, in degrees per second
			var gyroz = e.rotationRate.alpha;//alpha : The amount of rotation around the Z axis, in degrees per second
			
			
    		if(eventTime !=0 ){
    			//console.log("last time"+eventTime);
    			//console.log("current time "+d.getTime());
	    		dT = (d.getTime() - eventTime) * 0.001;
	    		rotx = e.rotationRate.alpha ;
	    		roty = e.rotationRate.beta ;
	    		rotz = e.rotationRate.gamma ;
	    		//console.log("curAnglex k "+curAnglex);
	    		curAnglex = getNewCurrentAngle(curAnglex, rotx, dT);
				curAngley = getNewCurrentAngle(curAngley, roty, dT);
				curAnglez = getNewCurrentAngle(curAnglez, rotz, dT);
	    		
	    		eventTime= d.getTime();
	    		
    		}else{
    			eventTime= d.getTime();
    			//console.log("eventTime"+eventTime);
    			/*curAnglex = e.rotationRate.alpha;
    				//((e.rotationRate.alpha * 180.0 )/ (22/7))%360 ;
    			curAngley = e.rotationRate.beta;
    				//((e.rotationRate.beta * 180.0 )/ (22/7)) %360 ;
    			curAnglez = e.rotationRate.gamma;
    				//((e.rotationRate.gamma * 180.0)/ (22/7))%360 ;
    			console.log("curAnglex "+curAnglex);
    			*/
    		}
    		
    		
    		if(ms===0 || (ms+10)<=d.getTime()){
    			//console.log("diff= "+(10*counter));
	    		ms = d.getTime();
	    		
	//    		var timeString=d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();
	    		//var timeString=d.getMinutes()+":"+d.getSeconds()+":"+d.getMilliseconds();
	    		var timeString=10*counter;
	    		counter++;
			
							
//				document.getElementById("xaccel").innerHTML = 'AccX : ' +  ax;
//				document.getElementById("yaccel").innerHTML = 'AccY : ' + ay;
//				document.getElementById("zaccel").innerHTML = 'AccZ : ' + az;
//		       
				document.getElementById("xaccel").innerHTML = 'gyrox : ' + gyrox;
				document.getElementById("yaccel").innerHTML = 'gyroy : ' + gyroy;
				document.getElementById("zaccel").innerHTML = 'gyroz : ' + gyroz;
				
//				document.getElementById("rotx").innerHTML = 'Rot X : ' + rotx ;
//				document.getElementById("roty").innerHTML = 'Rot Y : ' + roty ;
//				document.getElementById("rotz").innerHTML = 'Rot Z : ' + rotz ;
				var header= "ax, ay, az, amag, lax, lay, laz, lamag, gyrox, gyroy, gyroz, rotaionx, rotaiony, rotaionz \\r\\n";


				record=timeString+",  "+ax.toFixed(6)+",  "+ay.toFixed(6)+",   "+az.toFixed(6)+"  ,  "+getMagnitude(ax,ay,az);
				record=record+",  "+lax.toFixed(6)+",  "+lay.toFixed(6)+",   "+laz.toFixed(6)+"  ,  "+getMagnitude(lax,lay,laz);
				record=record+",  "+gyrox.toFixed(6)+"  ,  "+gyroy.toFixed(6)+" ,   "+gyroz.toFixed(6);
				record=record+",  "+curAnglex.toFixed(6)+"  ,  "+curAngley.toFixed(6)+" ,   "+curAnglez.toFixed(6)+"\\r\\n";
				data=data+record;
			
				
				console.log(record);
				//console.log("---------");
				//console.log(timeString+"   "+ax.toFixed(6)+"   "+ay.toFixed(6)+"   "+az.toFixed(6)+"   "+getMagnitude(ax,ay,az));
	
    		}
    	}
}); 
    
    function getNewCurrentAngle(curAngle, eventAngle, dt){
    	/*console.log("curAngle "+curAngle);
    	console.log("eventAngle "+eventAngle);
    	console.log("eventAngle "+(eventAngle * dt));
    	*/
    	//console.log("eventAngle "+((eventAngle * dt * 180.0) / (22/7)));
    	
    	var currentAngle = (curAngle + (eventAngle *dt))%360
    		//(curAngle + (eventAngle * dt * 180.0) / (22/7)) % 360;
    	//console.log("out Angle "+ Math.round(currentAngle));
    	//return currentAngle;
    	return currentAngle;
    }
    // Sample code
//    var textbox = document.querySelector('.contents');
//    textbox.addEventListener("click", function(){
//    	var box = document.querySelector('#textbox');
//    	box.innerHTML = box.innerHTML === "Basic" ? "Sample" : "Basic";
//    });
//    
};
