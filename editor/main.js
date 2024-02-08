let saved = true;
let open_file = -1;
let open_storage = {'type':null}
let acenum = -1;
let mx = 0;
let my = 0;
window.onload=function(){
	window.addEventListener("beforeunload", (event) => {
		if(!saved){
		  	// Cancel the event as stated by the standard.
		  	event.preventDefault();
		  	// Chrome requires returnValue to be set.
		  	event.returnValue = "";
		}
	});
	document.addEventListener("contextmenu", (event) => {
		mx = event.clientX;
		my = event.clientY;
		if(event.target.className=='fbtitle'){
			clickedFb(event.target.children.item(0).name,1);
		}else if(event.target.parentNode.className=='fbtitle'){
			clickedFb(event.target.parentNode.children.item(0).name,1);
		}
		event.preventDefault();
	});
	document.addEventListener('touchmove', function(event){event.preventDefault();}, { passive: false });
	document.addEventListener('click',function(){document.getElementById('popup-window-contextwindow').className='popup-select hide';});
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
		open_storage = project;

		closepage(0);
		setTimeout(()=>{
		openpage(2,project);
		});	
	}
}
function changeSaved(bool){
	saved = bool;
	if(saved){
		document.getElementById('saved-checker').innerHTML = 'Project Saved.';
	}else{
		document.getElementById('saved-checker').innerHTML = 'Project Not Saved!';
	}
}
function saveToStorage(){
	let url = new URL(window.location.href);
	let name = url.searchParams.get('project');
	if(name!=null){
		let prj = getProjects();
		if(prj.indexOf(name)==-1){alert('Error:Can\'t find project!');return;}
		setProject(prj.indexOf(name),open_storage);
	}
}
function popups(i, arg=null){
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
	case 4:
		popupwindow = document.getElementById('popup-window-contextwindow');
		if(popupwindow.className=='hide popup-select'){popupwindow.className='popup-select';}else{
			popupwindow.className='hide popup-select';
		}
		popupwindow.style.top=my+'px';
		popupwindow.style.left=mx+'px';
		popupwindow.innerHTML = '';
		if(arg[0].type=='storage'||arg[0].type=='folder'){
			popupwindow.innerHTML='<p>New File</p>';
		}else{
			popupwindow.innerHTML='<p>Open</p>';
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
function createFb(file,path=''){
	if(path==''){
		path = file.name;
	}
	let f = document.createElement('div');
	f.className = "fbfile";
	let titles = document.createElement('label');
	let inner;
	if(file.type=="folder"||file.type=="storage"){
		titles.insertAdjacentHTML('beforeend','<input type="button" class="hide expan_button">');
		inner = document.createElement('div');
		inner.className="fbinner";
		for (var i = 0; i < file.item.length; i++) {
			inner.appendChild(createFb(file.item[i],path+'/'+file.item[i].name));
		}
		
	}else{
		titles.insertAdjacentHTML('beforeend','<input type="button" class="hide select_button">');
	}
	titles.children.item(0).name = path;
	titles.className = "fbtitle";
	titles.insertAdjacentHTML('beforeend','<img class="fbimg" src="../images/'+file.type+'.png">');
	titles.insertAdjacentHTML('beforeend','<p>'+file.name+'</p>');
	f.appendChild(titles);
	if(file.type=="folder"||file.type=="storage"){f.appendChild(inner);}
	return f;
}
function clickedFb(name,t){
	//console.log(name,t);
	let path = name.split('/');
		let tgt = open_storage;
		for (var i = 1; i < path.length; i++) {
			let j = tgt["item-names"].indexOf(path[i]);
			tgt = tgt["item"][j];
		}
	if(t==0){
		//console.log(tgt);
		if(tgt.name.split('.')[1]=='html'){
			openpage(3,tgt);
		}else{
			openpage(4,[tgt,path]);
		}
	}else{
		popups(4,[tgt,name]);
	}
}
function openpage(type,arg=null,replace=-1){
	let el;
	if(replace==-1){
		let bwid = document.getElementById("pageid-"+(document.getElementsByClassName('page').length-1));
		let bwidth = 0;
		if(bwid!=undefined){
			console.log(bwid.style.width.split('%')[0]);
			bwidth = parseInt(bwid.style.width.split('%')[0]);
			bwid.style.width = bwidth/2+"%";
		}else{
			bwidth = 200;
		}
		let editor = document.getElementById('editor');
		editor.insertAdjacentHTML("beforeend",'<div class="page page-first" id="pageid-x" style="width: '+bwidth/2+'%;"><header class="page-header"><p>HelloWorld</p>	<button onclick="closepage(null);">×</button></header>	</div>');
		el = document.getElementById('pageid-x');
	}else{
		el = document.getElementById('pageid-'+replace);
		el.innerHTML = '';
	}
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
			el.children.item(0).children.item(0).innerHTML='File Browser';
			el2.appendChild(createFb(arg));
			let buttons = document.getElementsByClassName('expan_button');
			for (var i = 0; i < buttons.length; i++) {
				buttons.item(i).addEventListener('click', function(){
					let inner = event.target.parentNode.parentNode.children.item(1);
					if(inner.style.display == ''){
						inner.style.display="block"
					}else{
						inner.style.display="";
					}
					});
			}
			let files = document.getElementsByClassName('select_button');
			for (var i = 0; i < files.length; i++) {
				files.item(i).addEventListener('click', function(e){
					clickedFb(event.target.name,e.button);
				});
				files.item(i).addEventListener( "contextmenu", (event) => {console.log('');event.preventDefault()} );
			}
			document.getElementsByClassName('fbzone')[0].children[0].children[0].click();
		break;
	case 3:
		el.children.item(0).children.item(0).innerHTML='PreView'
			el.insertAdjacentHTML("beforeend",'<iframe class="preview" srcdoc='+arg.value+'></iframe>');
			break;
	case 4:
		acenum++;
		el.children.item(0).children.item(0).innerHTML='TextEditor(Ace)';
		el.insertAdjacentHTML("beforeend",'<div class="ace-tool"><p></p></div>');
			el.insertAdjacentHTML("beforeend",'<div id=ace-editor-'+acenum+' class="ace-editor"></div>');
			let editora = ace.edit('ace-editor-'+acenum);
			editora.$blockScrolling = Infinity;
		    editora.setOptions({
		      enableBasicAutocompletion: true,
		      enableSnippets: true,
		      enableLiveAutocompletion: true
		    });
		    editora.setTheme("ace/theme/monokai");
			el.addEventListener('keydown',
			    event => {
			        if (event.key === 's' && event.ctrlKey) {
			           let file = editor.getValue();
			           let tgt = open_storage;
						for (var i = 1; i < arg[1].length; i++) {
							let j = tgt["item-names"].indexOf(arg[1][i]);
							tgt = tgt["item"][j];
						}
						tgt.value = file;
						saveToStorage();
			           changeSaved(true);
			        }else{
			        	changeSaved(false);
			        }
			    });
			if(arg!=null){
				let type = arg[0].name.split('.')[1];
				switch(type){
				case 'js':
					editora.getSession().setMode("ace/mode/javascript");
					break;
				case 'html':
					editora.getSession().setMode("ace/mode/html");
				case 'css':
					editora.getSession().setMode("ace/mode/css");
				}

				editora.insert(arg[0].value);
				el.getElementsByClassName('ace-tool').item(0).innerHTML= '<p>'+arg[0].name+'</p>';
			}
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