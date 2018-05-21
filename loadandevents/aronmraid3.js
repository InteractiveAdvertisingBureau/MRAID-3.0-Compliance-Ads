/* Copywrite Aron Schatz 2018
 * 
 * 
 */


function $(element)
{
	element = document.getElementById(element);
	return element;
}
var head = document.getElementsByTagName("head")[0];
var scr = document.createElement("script");
scr.setAttribute('src', 'mraid.js');
scr.setAttribute('type', 'text/javascript');
head.appendChild(scr);
var style = document.createElement('style');
style.setAttribute('type', 'text/css')
style.appendChild(document.createTextNode('input{vertical-align:middle;} body{padding:5px;} a{color:#d00;  text-decoration:none;} #aroniabmraid3ad{background:#ddd; color:#000; position:relative; font-size:14px; height:100%;} #checklog{position:absolute; right:0; bottom:0; font-size:24px; height:50px; display:flex; align-items:center;} #checklog a{outline:1px solid #a00; background:#fff; display:block; height:44px; line-height:44px; text-align:center; padding:0 3px;} #checklog a#expand{width:100px;} #step{} #step a{font-size:20px;} div#log{display:none; position:absolute; bottom:0; width:100%; height:150px; background:#111; color:#ddd; overflow-y:scroll; font-size:12px;}'));
head.appendChild(style);
window._adclose=false;
window._step=0;
window._logclose=0;
window._log=[];
// Viewport setup
var meta = document.querySelector("meta[name=viewport]");
if (!meta)
{
  meta = document.createElement("meta");
  meta.name = "viewport";
  meta.content = "width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1";
  head.appendChild(meta);
}
else
{
  meta.content = "width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1";
}
var checkenv=false;
var checkload=false;
var checkready=false;
var checkdefault=false;

function logmessage(message)
{ //Dual logging. It will show in the console and in the ad.
	console.log(message);
	var logdiv = $('log');
	if(logdiv)
	{
            if(Array.isArray(window._log))
            {
                var msg='';
                while(window._log.length)
                {
                    msg=window._log.shift();
                    logdiv.insertBefore(document.createElement("br"),logdiv.firstChild);
                    logdiv.insertBefore(document.createTextNode(msg),logdiv.firstChild);
                }
                window._log=null;
            }
            logdiv.insertBefore(document.createElement("br"),logdiv.firstChild);
            logdiv.insertBefore(document.createTextNode(new Date().getTime()+": "+message),logdiv.firstChild);
	}
	else
        {
            window._log.push(new Date().getTime()+": "+message);
        }
}


//Check MRAID_ENV
if(typeof window.MRAID_ENV!='undefined')
{
    checkenv=true;
    logmessage("CHECK: Detected MRAID_ENV");
    logmessage("Version: "+window.MRAID_ENV.version+" SDK: "+window.MRAID_ENV.sdk+" SDKv: "+window.MRAID_ENV.sdkVersion);
}
else
{
     logmessage("FAIL: window.MRAID_ENV is not detected");
}



function readycheck()
{
	logmessage('window.onload() triggered.');
	if(mraid.getState() == 'loading') 
	{
                logmessage("CHECK: In loading state.");
		mraid.addEventListener("ready", ready);  
	}
	else
	{
		initad();
	}
	mraid.addEventListener('error', mraiderror);
	mraid.addEventListener('stateChange', statechange);
	mraid.addEventListener('sizeChange', sizechange);
        if(mraid.getVersion=='3.0') //To get by with MRAID 2 SDK for now
        {
            mraid.addEventListener('audioVolumeChange', volumechange);
        }
	mraid.removeEventListener('stateChange', statechange);
	mraid.addEventListener('stateChange', statechange); //Just to check that removing and adding the same event listener works.
}

function ready()
{
	//Inject a style
	logmessage('Ready event fired.');
	initad();
}

function initad()
{
	//Inject a style
	logmessage('initad() triggered.');
	var gcp = mraid.getCurrentPosition();
        var expp = mraid.getExpandProperties();
        expp.useCustomClose=true;//This should have no effect.
        mraid.setExpandProperties(expp);
	if(mraid.getState()=="default")
        {
         logmessage("CHECK: State is default after ready");   
        }
        logmessage("MRAID Version: "+mraid.getVersion());
        window._maxsize=mraid.getMaxSize();
        //Now setup content
        var head = document.getElementsByTagName("head")[0];
	var style = document.createElement('style');
	style.setAttribute('type', 'text/css')
	style.appendChild(document.createTextNode('body{padding:5px;}'));
	head.appendChild(style);
	var parentdiv = $('aroniabmraid3ad');
	var checklogdiv = document.createElement("div"); //This is where buttons go
	checklogdiv.id = 'checklog';
        var link=document.createElement('a');
        link.setAttribute('onclick',"expand()");
        link.appendChild(document.createTextNode('See Log'))
        link.setAttribute('id',"expand");
        link.style.display='none';
        checklogdiv.appendChild(link);
        var link=document.createElement('a');
        link.setAttribute('onclick',"close()");
        link.appendChild(document.createTextNode('Hide Log To Continue'))
        link.setAttribute('id',"close");
        link.style.display='none';
        checklogdiv.appendChild(link);
	parentdiv.appendChild(checklogdiv);
	var stepdiv = document.createElement("div"); // This is pure information
        stepdiv.setAttribute('id','step');
	parentdiv.appendChild(stepdiv);
	/*var waterdiv = document.createElement("div"); //This is to show how sizing is working, visually
	waterdiv.id = 'waterdiv';
	waterdiv.appendChild(document.createTextNode("IAB MRAID3 Events Compliance Ad."));
	parentdiv.appendChild(waterdiv);*/
	var logdiv = document.createElement("div"); //A generic div for showing logmessage inline...
        logdiv.setAttribute('id','log');
	parentdiv.appendChild(logdiv);
        stepchange(1);
}

function stepchange(step)
{
    //Clear everything from stepdiv, first
    var stepdiv=$('step');
    while (stepdiv.firstChild)
    {
            stepdiv.removeChild(stepdiv.firstChild);
    }
    
    var div=document.createElement('div');

    switch(step)
    {
        case 1:
            var link=document.createElement('a');
            link.setAttribute('onclick',"expandstatecheck()");
            link.appendChild(document.createTextNode('Tap For Expand/stateChange Check'))
            div.appendChild(link);
            break;
        case 2:
            var span=document.createElement('span');
            span.appendChild(document.createTextNode('Tap SDK Close Button'))
            div.appendChild(span);
            break;
        case 3:
            var link=document.createElement('a');
            link.setAttribute('onclick',"expandsizecheck()");
            link.appendChild(document.createTextNode('Tap For Expand/sizeChange Check'))
            div.appendChild(link);
            break;
        case 4:
            var link=document.createElement('a');
            link.setAttribute('onclick',"expandsizeclose()");
            link.appendChild(document.createTextNode('Tap To Close Expand'))
            div.appendChild(link);
            break;
        case 5:
            var link=document.createElement('a');
            link.setAttribute('onclick',"expandlog()");
            link.appendChild(document.createTextNode('Tap To Check Logs'))
            div.appendChild(link);
            break;
        case 6:
            var link=document.createElement('a');
            link.setAttribute('onclick',"unload()");
            link.appendChild(document.createTextNode('Tap To Unload'))
            div.appendChild(link);
            break;
    }
    stepdiv.appendChild(div);
}

function statechange(state)
{
	updateprops("State Change");
        $('log').style.display='none';
        if(window._logclose==1 && state=='default') //Handle the close button case
        {
            $('step').style.display='break';
            $('expand').style.display='block';
            $('close').style.display='none';
            window._logclose=0;
        }
        if(state=='expanded')
        {
         $('log').style.display='block';   
        }
}


function orientationchange()
{
	updateprops("Orientation Change");
}

function mraiderror(message,action)
{
	updateprops("MRAID Error: '"+message+"' From: "+action);
}

function sizechange()
{
    updateprops("Size Change");
}

function updateprops(event)
{
	var gcp = mraid.getCurrentPosition();
	var gss = mraid.getScreenSize();
	var expp = mraid.getExpandProperties();
	var orient = 'Undefined!';
	switch (window.orientation)
	{
	case 0:
	case 180:
		orient = 'Portrait';
		break;
	case 90:
	case -90:
		orient = 'Landscape';
		break;
	}
	logmessage("[Cur: x: " + gcp.x + ", y: " + gcp.y + ", width: " + gcp.width + ", height: " + gcp.height+"] ["+
	  "Window: x: " + window.innerWidth + ", y: " + window.innerHeight+"] ["+
	  "Scr: width: " + gss.width + ", height: " + gss.height+"] ["+
	  "expProps: width: " + expp.width + ", height: " + expp.height +"] ["+
	  "Current orientation: " + orient+"] ["+
          "State: " + mraid.getState()+"] ["+
          "Last Event: " + event+"]"
	);
}


function expand()
{
    mraid.expand();
    //Show close to continue
    $('step').style.display='none';
    $('expand').style.display='none';
    $('close').style.display='block';
    window._logclose=1;
}

function close()
{
    mraid.close();
    //Show steps again
    $('step').style.display='block';
    $('expand').style.display='block';
    $('close').style.display='none';
}

function unload()
{
    updateprops('Unload');
    mraid.unload();

}

window.addEventListener('orientationchange', orientationchange, false);

if(document.readyState=="complete")
{
	readycheck();
}
else
{
	window.addEventListener('load', readycheck, false); //DOM and MRAID check
}






//Sequenced functions

function expandstatecheck()
{
    //Add an event listener only for state change for this check
    mraid.addEventListener('stateChange',expandstatechecklisten);
    mraid.expand();
}

function expandstatechecklisten()
{
 //Check state, check sizing   
    var curpos=mraid.getCurrentPosition();
    if(curpos.width==mraid.getMaxSize().width && curpos.height==mraid.getMaxSize().height && mraid.getState()=='expanded')
    {
        logmessage('CHECK: Variables check upon stateChange after expand');
    }
    else
    {
        logmessage('FAIL: Variables check upon stateChange after expand');
    }
    mraid.removeEventListener('stateChange',expandstatechecklisten);
    mraid.addEventListener('stateChange',manualclosechecklisten);
    stepchange(2);
}

function manualclosechecklisten()
{
 //Check state, check sizing   
    var curpos=mraid.getCurrentPosition();
    if(curpos.width==mraid.getDefaultPosition().width && curpos.height==mraid.getDefaultPosition().height && mraid.getState()=='default')
    {
        logmessage('CHECK: Variables check upon stateChange after manual close');
    }
    else
    {
        logmessage('FAIL: Variables check upon stateChange after manual close');
    }
    mraid.removeEventListener('stateChange',manualclosechecklisten);
    stepchange(3);
}

function expandsizecheck()
{
    //Add an event listener only for size change for this check
    mraid.addEventListener('sizeChange',expandsizechecklisten);
	mraid.expand();
}

function expandsizechecklisten()
{
 //Check state, check sizing   
    var curpos=mraid.getCurrentPosition();
    if(curpos.width==mraid.getMaxSize().width && curpos.height==mraid.getMaxSize().height && mraid.getState()=='expanded')
    {
        logmessage('CHECK: Variables check upon sizeChange after expand');
    }
    else
    {
        logmessage('FAIL: Variables check upon sizeChange after expand');
    }
    mraid.removeEventListener('sizeChange',expandsizechecklisten);
    stepchange(4);
}

function expandsizeclose()
{
    mraid.addEventListener('sizeChange',adclosesizechecklisten);
    mraid.close();
}

function adclosesizechecklisten()
{
  //Check state, check sizing   
    var curpos=mraid.getCurrentPosition();
    if(curpos.width==mraid.getDefaultPosition().width && curpos.height==mraid.getDefaultPosition().height && mraid.getState()=='default')
    {
        logmessage('CHECK: Variables check upon sizeChange after ad close');
    }
    else
    {
        logmessage('FAIL: Variables check upon sizeChange after ad close');
    }
    mraid.removeEventListener('sizeChange',adclosesizechecklisten);   
    stepchange(5);
}

function expandlog()
{
    stepchange(6);
    $('checklog').style.display='none'; //Last step, remove this
    mraid.expand();
}
