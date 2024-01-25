let saved = true;
let open_file = -1;
let open_storage = {'type':null}
window.onload=function(){
	document.addEventListener('touchmove', function(event){event.preventDefault();}, { passive: false });
	if(!storageAvailable('localStorage')){
		alert('Sorry.Can\'t use WebSiteMaker.(localStorage can\'t use.)');
		location.href='../index.html'
	}
	let url = new URL(window.location.href);
	let name = url.searchParams.get('project');
	if(name!=null){
		let prj = getProjects();
		if(prj.indexOf(name)==-1){alert('Error:Can\'t find project!');return;}
		let project = getProject(prj.indexOf(name));
		/*{
					"type":"storage",
					"name":steps[1],
					"item":[
						{"type":"file","name":"index.html","value":"<!DOCTYPE html>"+
						"<html><head><meta charset='utf-8'>"+
"<meta name='viewport' content='width=device-width, initial-scale=1'>"+
	"<title></title></head><body></body></html>"},
						{"type":"file","name":"script.js","value":""},
						{"type":"file","name":"style.css","value":""}
					],
					"item-names":['index.html','script.js','style.css']
				}
*/		
		closepage(0);
		openpage(2,project);
	}
}
function popups(i){
	let popupwindow;
	let pr;
	switch(i){
	case 1:
		pr = document.getElementById('popup-button1').getBoundingClientRect();
		popupwindow = document.getElementById('popup-window-select1');
		if(popupwindow.className=='hide popup-select'){popupwindow.className='popup-select';}else{
			popupwindow.className='hide popup-select';
		}
		popupwindow.style.top=(pr.top+pr.height)+'px';
		popupwindow.style.left=pr.left+'px';
		break;
	case 2:
		pr = document.getElementById('popup-button2').getBoundingClientRect();
		popupwindow = document.getElementById('popup-window-select2');
		if(popupwindow.className=='hide popup-select'){popupwindow.className='popup-select';}else{
			popupwindow.className='hide popup-select';
		}
		popupwindow.style.top=(pr.top+pr.height)+'px';
		popupwindow.style.left=pr.left+'px';
		break;
	case 3:
		popupwindow = document.getElementById('popup-window-selectfile');
		if(popupwindow.className=='hide popup-alert'){
			popupwindow.className='popup-alert';
			let proj = getProjects();
			let scroll = popupwindow.getElementsByClassName('scroll')[0];
			scroll.innerHTML='';
			for (var i = 0; i < proj.length; i++) {
				let data = proj[i].split('/');
				let r = '<li onclick="selectfile('+i+')" class="p-name"><p>'+data[0]+'</p></li>';
				scroll.insertAdjacentHTML("beforeend",r);
			}
			popups(1);
		}else{
			popupwindow.className='hide popup-alert';
		}
		break;
	}
}
function jumpsite(url){
	if(saved==true){location.href=url;}else{
		if (window.confirm("Project is not saved.Do you really want to leave?")) {
		  window.open(url, "Thanks for Visiting!");
		}
	}
}
function refreshpages(){
	let editor = document.getElementsByClassName('page');
	for (var i = 0; i < editor.length; i++) {
		let element = editor.item(i);
		element.id='pageid-'+i;
		element.children.item(0).children.item(1).setAttribute('onclick','closepage('+i+');');
	}
}
function openpage(type,arg=null){
	let editor = document.getElementById('editor');
	editor.insertAdjacentHTML("beforeend",'<div class="page page-first" id="pageid-x" style="width: 50%;"><header class="page-header"><p>HelloWorld</p>	<button onclick="closepage(null);">×</button></header>	</div>');
	let el = document.getElementById('pageid-x');
	switch(type){
		case 1:
			el.children.item(0).children.item(0).innerHTML='HelloWorld'
			el.insertAdjacentHTML("beforeend",'<h1 style="text-align: center;font-size: 500%;">Hello!</h1>'+
			'<p style="text-align: center;font-size: 200%;">'+
				'How to use WSM(WebSiteMaker):<br>'+
				'1.Open File by WSMEditor menu "File" button and Click "Open File"<br>'+
				'(If use first this,Click "New File")<br>'+
				'2.Have Fun!'+
			'</p>');
			break;
		case 2:
			el.insertAdjacentHTML("beforeend",'<div class="fbzone"></div>')
			let el2 = el.getElementsByClassName('fbzone').item(0);
			el.children.item(0).children.item(0).innerHTML='File Browser'
			el2.insertAdjacentHTML("beforeend",'<div class="fbfile"><div class="fbtitle"><img class="fbimg" src="../images/storage.png"></img><p>Storage#'+arg.name+'<p></div></div>');
			el2.insertAdjacentHTML("beforeend",'<div class="fbfile"><img class="fbimg" src="../images/folder.png"></img><p>main<p></div>');
			el2.insertAdjacentHTML("beforeend",'<div class="fbfile"><img class="fbimg" src="../images/file.png"></img><p>index.html<p></div>');
		break;
	}
	
	
	setTimeout(() => {
	refreshpages();
	});
}
function closepage(id){
	let rmv = document.getElementById('pageid-'+id);
	let p = rmv.parentNode;
	if(p.id=='editor'){
		let owid = rmv.style.width;
		let editor = document.getElementById('editor');
		if(editor.getElementsByClassName('page').length>1){
			if(id==0){
				let nxt = document.getElementById('pageid-'+(id+1)).style.width;
				nxt = (parseInt(nxt.split('%')[0])+parseInt(owid))+"%";
				document.getElementById('pageid-'+(id+1)).style.width=nxt;
			}else{
				let nxt = document.getElementById('pageid-'+(id-1)).style.width;
				nxt = (parseInt(nxt.split('%')[0])+parseInt(owid))+"%";
				document.getElementById('pageid-'+(id-1)).style.width=nxt;
			}
		}
		setTimeout(() => {
		  rmv.remove();
		  refreshpages();
		});
	}else if(p.children.length==2){
		//document.getElementById('editor').insertAdjacentHTML("beforeend",p.innerHTML);
		//p.innerHTML
	}
	
}
function selectfile(id){
	let scroll = document.body.getElementsByClassName('scroll')[0];
	if(open_file!=-1){scroll.children[open_file].style.border='';}
	scroll.children[id].style.border='solid 1px red';
	open_file = id;
}
function openfile(){
	let pn = getProjects()[open_file];
	location.href = './editor.html?project='+pn;
}