let cleanlog;
let currentCleanerId = -1;
function init() {
  fetch("api/residents").then((response) => {
    return response.json();
  }).then((response) => {
    buildPage(response);
  });
  fetch("api/cleantypes").then((response)=>{
    return response.json();
  }).then((response) =>{
    createMenu(response);
  });
  fetch("api/cleanlog").then((response)=>{
    return response.json();
  }).then((response) =>{
    appendBadges(response);
  });

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
      cleanHisto[item.residentId] = cleanHisto[item.residentId]+1||1;
      if(cleanMax<=cleanHisto[item.residentId]){
        cleanMax = cleanHisto[item.residentId];
      }
  }
  for( li of ul){
    li.children.length=0;
    const span = document.createElement("span");
    span.innerHTML = cleanHisto[li.children[0].id]||0;
    span.className="badge";
    span.id = "badge"+li.children[0].id;
    li.appendChild(span);
    li.style.transform = "translate("+100*cleanHisto[li.children[0].id]||0+",0)";
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
    appendBadges(response);
  });
}
window.onload = init;
