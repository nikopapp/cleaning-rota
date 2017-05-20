let currentCleanerId = -1;
let residents = [];
let cleanTypes= [];
function init() {
  const residentsPromise = fetch("api/residents").then((response) => {
    return response.json();
  });
  const cleanTypesPromise = fetch("api/cleantypes").then((response)=>{
    return response.json();
  });
  const cleanlogPromise = fetch("api/cleanlog").then((response)=>{
    return response.json();
  });
  Promise.all([residentsPromise,cleanTypesPromise, cleanlogPromise]).then((values) => {

    cleanTypes = values[1].slice();
    createMenu(cleanTypes);

    residents = values[0].slice();
    buildPage(residents);

    appendCleanLog(values[2].slice());
    appendBadges(values[2].slice());

  });
}
function appendCleanLog(cleanlog){
  let cleanlogDiv = document.getElementById("cleanlogDiv") || document.createElement("div");
  cleanlogDiv.id="cleanlogDiv";
  let body = document.getElementById("top");
  let ul = document.getElementById("cleanlogUl")||document.createElement("ul");
  ul.id = "cleanlogUl";
  ul.innerHTML="";
  let i = 0;
  for(item of cleanlog){
    console.log(item);
    let li = document.getElementById(item.weeknum+"") || document.createElement("li");
    li.id = item.weeknum+"";
    li.className="li"+item.residentId;
    // console.log((new Date(parseInt(item.weeknum))).toString()  +" "+ residents[item.residentId] +" " + cleanTypes[item.cleanTypeId]);
    li.innerHTML = (new Date(parseInt(item.weeknum))).toString().substring(0,25)  +"<br/> "+ residents[item.residentId-1].name +" " + cleanTypes[item.cleanTypeId-1].name;
    ul.appendChild(li);
  }
  cleanlogDiv.appendChild(ul);
  if(!document.getElementById("cleanlogDiv")){
    body.appendChild(cleanlogDiv);
  }
}
function buildPage(response) {
  const body = document.getElementById("top");
  let ul = document.createElement("ul");
  ul.id = "resList";
  for(let i of response){
    let li = document.createElement("li");
    let img = document.createElement("img");
    img.src = i.avatarUrl;
    img.id = i.id;
    img.alt = i.name;
    img.addEventListener("click",(event) =>{
      openMenu(event);
    });
    li.appendChild(img);
    ul.appendChild(li);
  }
  body.appendChild(ul);
}
function appendBadges(cleanlog){
  let cleanMax = 0;
  const cleanHisto = new Array(6);
  const ul = document.getElementById('resList').children;
  for(item of cleanlog){
      cleanHisto[item.residentId] = (cleanHisto[item.residentId]+1)||1;
      if(cleanMax<=cleanHisto[item.residentId]){
        cleanMax = cleanHisto[item.residentId];
      }
  }
  for( li of ul){
    li.children.length=0;
    const span = document.getElementById("badge"+li.children[0].id) || document.createElement("span");
    span.innerHTML = cleanHisto[li.children[0].id]||0;
    span.className="badge";
    span.id = "badge"+li.children[0].id;
    li.style.transform = "translate("+(35*cleanHisto[li.children[0].id]/cleanMax||0)+"vw,0vh)";
    li.appendChild(span);
  }
}

function createMenu(response){
  const cleanTypes = response;
  const body = document.getElementById("top");
  let modalCleaned = document.createElement("div");
  modalCleaned.id="modalCleaned";
  modalCleaned.className="hidden";
  let closeMenuBut = document.createElement("span");
  closeMenuBut.innerHTML="x";
  closeMenuBut.onclick = closeMenu;
  modalCleaned.appendChild(closeMenuBut);
  let modalTitle = document.createElement("h2");
  modalTitle.id="modTitle";
  modalTitle.innerHTML="Hoy he limpiado...";
  modalCleaned.appendChild(modalTitle);
  const menu = document.createElement("ul");
  for(item of cleanTypes){
    const menuItem = document.createElement("li");
    menuItem.innerHTML = item.name;
    menuItem.id=item.id;
    menuItem.className = "menuItem";
    menuItem.addEventListener("click",(event) =>{
      console.log(event.target);
      sendCleanedSignal(currentCleanerId,event.target.id);
      closeMenu();
    });
    // const menuItemImg = document.createElement("img");
    // menuItem.appendChild(menuItemImg)
    menu.appendChild(menuItem);
  }
  modalCleaned.appendChild(menu);
  body.appendChild(modalCleaned);
}
function openMenu(event){
  document.getElementById("modalCleaned").className = "";
  currentCleanerId = event.target.id;
}
function closeMenu(){
  document.getElementById("modalCleaned").className = "hidden";
}
function sendCleanedSignal(id,cleanTypes){
  const fetchParams = {
    method: "POST",
    body: JSON.stringify({id:id,cleanTypeId:cleanTypes}),
    headers:{
      "Content-Type": "application/json"
    }
  };
  fetch("/api/cleanlog",fetchParams).then((response) =>{
    return response.json();
  }).then(response => {
    appendCleanLog(response);
    appendBadges(response);
  });
}
window.onload = init;
