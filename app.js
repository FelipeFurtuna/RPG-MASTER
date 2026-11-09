(() => {
"use strict";
const KEY="rpgMasterDnd5e_v1";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-4);
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mod=n=>Math.floor((Number(n??10)-10)/2), modText=n=>(n>=0?"+":"")+n;
const profBonus=l=>Math.floor((Math.max(1,Math.min(20,Number(l)||1))-1)/4)+2;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):min));
const defaults=()=>({campaigns:[],characters:[],creatures:[
{id:uid(),name:"Lobo das Cinzas",type:"Animal",cr:"1/2",ac:13,hp:22,speed:"12 m",description:"Predador de pelagem cinzenta que caça em silêncio nas florestas queimadas.",actions:"Mordida: +4 para atingir, 2d4+2 de dano perfurante."},
{id:uid(),name:"Sentinela de Bronze",type:"Constructo",cr:"2",ac:16,hp:45,speed:"9 m",description:"Guardião mecânico de uma cripta esquecida, obediente a comandos gravados na couraça.",actions:"Golpe pesado: +5 para atingir, 1d10+3 de dano contundente."},
{id:uid(),name:"Vulto do Brejo",type:"Morto-vivo",cr:"1",ac:12,hp:27,speed:"9 m",description:"Silhueta envolta em névoa que protege ruínas alagadas.",actions:"Toque gélido: +4 para atingir, 2d6 de dano necrótico."}
],notes:[],activeCampaignId:null});
function load(){try{const v=JSON.parse(localStorage.getItem(KEY));return v?{...defaults(),...v}:defaults()}catch{return defaults()}}
let S=load(), selectedNote=null, submitModal=null, toastTimer;
delete S.sessions;delete S.combatants;delete S.round;delete S.turnIndex;delete S.combatStarted;delete S.rolls;
S.characters=(S.characters||[]).map(c=>({id:c.id||uid(),name:c.name||"",player:c.player||"",race:c.race||"",className:c.className||"",level:c.level||"",background:c.background||"",campaignId:c.campaignId||"",notes:c.notes||""}));
function persist(){localStorage.setItem(KEY,JSON.stringify(S))}
function toast(m){const e=$("#toast");e.textContent=m;e.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove("show"),2500)}
function campaignName(id){return S.campaigns.find(c=>c.id===id)?.name||"Sem campanha"}
function navigate(v){$$(".view").forEach(x=>x.classList.toggle("active",x.id===`view-${v}`));$$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.view===v));const names={dashboard:"VISÃO GERAL",campaigns:"CAMPANHAS",characters:"AVENTUREIROS",bestiary:"BESTIÁRIO",generator:"GERADORES",notes:"DIÁRIO DO MESTRE"};$("#pageCrumb").textContent=names[v]||"RPG MASTER";$("#sidebar").classList.remove("open");({dashboard:renderDashboard,campaigns:renderCampaigns,characters:renderCharacters,bestiary:renderCreatures,notes:renderNotes}[v]||(()=>{}))()}
function renderDashboard(){
 $("#statCampaigns").textContent=S.campaigns.length;$("#statCharacters").textContent=S.characters.length;$("#statCreatures").textContent=S.creatures.length;$("#statNotes").textContent=S.notes.length;
 $("#todayLabel").textContent=new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
 const c=S.campaigns.find(x=>x.id===S.activeCampaignId)||S.campaigns[0];
 $("#featuredCampaign").innerHTML=c?`<div class="featured-emblem">♜</div><div><h4>${esc(c.name)}</h4><p>${esc(c.description||"Uma nova lenda está prestes a começar.")}</p><div class="featured-meta">${esc(c.setting||"Cenário não definido")} · ${S.characters.filter(x=>x.campaignId===c.id).length} personagem(ns)</div></div>`:`<div class="featured-emblem">✦</div><div><h4>Nenhuma campanha criada</h4><p>Seu próximo mundo começa com uma ideia. Crie uma campanha para organizar aventureiros, criaturas e histórias.</p><button class="text-btn" data-action="new-campaign">Criar primeira campanha →</button></div>`;
 const notes=[...S.notes].sort((a,b)=>b.updatedAt-a.updatedAt).slice(0,4);
 $("#recentNotes").innerHTML=notes.length?notes.map(n=>`<div class="recent-item"><b>${esc(n.title)}</b><small>${new Date(n.updatedAt).toLocaleDateString("pt-BR")}</small></div>`).join(""):`<div class="empty-state">Seu diário ainda está em branco.</div>`;
}
function renderCampaigns(){
 $("#campaignList").innerHTML=S.campaigns.length?S.campaigns.map(c=>`<article class="entity-card"><div class="eyebrow">CAMPANHA ${c.id===S.activeCampaignId?"· ATIVA":""}</div><h3>${esc(c.name)}</h3><p>${esc(c.description||"Uma aventura esperando para acontecer.")}</p><div class="entity-meta"><span class="meta-chip">${esc(c.setting||"Cenário livre")}</span><span class="meta-chip">${S.characters.filter(x=>x.campaignId===c.id).length} herói(s)</span></div><div class="card-actions"><button class="mini-btn" data-action="activate-campaign" data-id="${c.id}">${c.id===S.activeCampaignId?"Campanha ativa":"Definir ativa"}</button><button class="mini-btn" data-action="edit-campaign" data-id="${c.id}">Editar</button><button class="mini-btn danger" data-action="delete-campaign" data-id="${c.id}">Excluir</button></div></article>`).join(""):`<div class="empty-state" style="grid-column:1/-1">Nenhuma campanha por enquanto. Crie sua primeira aventura.</div>`;
}

function updateCharacterFilters(){const el=$("#characterCampaignFilter"),old=el.value;el.innerHTML='<option value="">Todas as campanhas</option>'+S.campaigns.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");el.value=old}
function renderCharacters(){
 updateCharacterFilters();
 const q=($("#characterSearch").value||"").toLowerCase(),camp=$("#characterCampaignFilter").value;
 const list=S.characters.filter(c=>(!camp||c.campaignId===camp)&&`${c.name} ${c.player} ${c.className} ${c.race}`.toLowerCase().includes(q));
 $("#characterList").innerHTML=list.length?list.map(c=>`<article class="entity-card">
  <div class="character-card-top"><div class="character-avatar">${esc((c.name||"?").slice(0,1).toUpperCase())}</div><div><h3>${esc(c.name)}</h3><small>${esc(c.race||"Raça não definida")} · ${esc(c.className||"Classe não definida")}</small></div></div>
  <div class="entity-meta"><span class="meta-chip">${esc(c.player||"Jogador não definido")}</span><span class="meta-chip">${esc(campaignName(c.campaignId))}</span>${c.level?`<span class="meta-chip">Nível ${esc(c.level)}</span>`:""}</div>
  ${c.background?`<p><b style="color:#d3bc83">Antecedente:</b> ${esc(c.background)}</p>`:""}
  ${c.notes?`<p>${esc(c.notes)}</p>`:""}
  <div class="card-actions"><button class="mini-btn" data-action="edit-character" data-id="${c.id}">Editar perfil</button><button class="mini-btn" data-action="send-character" data-id="${c.id}">Enviar à Mesa</button><button class="mini-btn danger" data-action="delete-character" data-id="${c.id}">Remover</button></div>
 </article>`).join(""):`<div class="empty-state" style="grid-column:1/-1">Nenhum aventureiro cadastrado. Adicione somente nome, jogador, raça e classe — as fichas continuam com os jogadores.</div>`;
}

function renderCreatures(){
 const q=($("#creatureSearch").value||"").toLowerCase(),type=$("#creatureTypeFilter").value;
 const list=S.creatures.filter(c=>(!type||c.type===type)&&`${c.name} ${c.type} ${c.description}`.toLowerCase().includes(q));
 $("#creatureList").innerHTML=list.length?list.map(c=>`<article class="entity-card"><div class="eyebrow">BESTIÁRIO · ${esc(c.type||"CRIATURA")}</div><h3>${esc(c.name)}</h3><p>${esc(c.description||"Sem descrição.")}</p><div class="entity-meta"><span class="meta-chip">ND ${esc(c.cr||"—")}</span><span class="meta-chip">CA ${c.ac||"—"}</span><span class="meta-chip">${c.hp||"—"} PV</span><span class="meta-chip">${esc(c.speed||"—")}</span></div><p><b style="color:#d3bc83">Ações:</b> ${esc(c.actions||"Não definidas.")}</p><div class="card-actions"><button class="mini-btn" data-action="send-creature" data-id="${c.id}">Enviar à Mesa</button><button class="mini-btn" data-action="edit-creature" data-id="${c.id}">Editar</button><button class="mini-btn danger" data-action="delete-creature" data-id="${c.id}">Excluir</button></div></article>`).join(""):`<div class="empty-state" style="grid-column:1/-1">Nenhuma criatura encontrada.</div>`;
}
function renderNotes(){
 const sorted=[...S.notes].sort((a,b)=>b.updatedAt-a.updatedAt);
 $("#notesList").innerHTML=sorted.length?sorted.map(n=>`<div class="note-row ${n.id===selectedNote?"selected":""}" data-action="select-note" data-id="${n.id}"><b>${esc(n.title)}</b><small>${new Date(n.updatedAt).toLocaleString("pt-BR")} · ${esc(campaignName(n.campaignId))}</small></div>`).join(""):`<div class="empty-state">Nenhuma anotação criada.</div>`;
 const n=S.notes.find(x=>x.id===selectedNote);
 if(n){$("#noteEditorTitle").textContent=n.title;$("#noteEditorBody").innerHTML=`<div class="note-body-text">${esc(n.body||"")}</div><div class="note-editor-actions"><button class="mini-btn" data-action="edit-note" data-id="${n.id}">Editar</button><button class="mini-btn danger" data-action="delete-note" data-id="${n.id}">Excluir</button></div>`}
 else{$("#noteEditorTitle").textContent="Selecione uma anotação";$("#noteEditorBody").textContent="Escolha uma anotação à esquerda ou crie uma nova para começar a escrever."}
}

function renderAll(){renderDashboard();renderCampaigns();renderCharacters();renderCreatures();renderNotes()}
function field(label,name,value="",type="text",full=false,placeholder=""){const input=type==="textarea"?`<textarea class="form-textarea" name="${name}" placeholder="${esc(placeholder)}">${esc(value)}</textarea>`:`<input class="form-input" name="${name}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}">`;return `<div class="form-field ${full?"full":""}"><label>${label}</label>${input}</div>`}
function selectField(label,name,opts,value="",full=false){return `<div class="form-field ${full?"full":""}"><label>${label}</label><select class="form-select" name="${name}">${opts.map(o=>`<option value="${esc(o.value)}" ${String(value)===String(o.value)?"selected":""}>${esc(o.label)}</option>`).join("")}</select></div>`}
function openModal(title,body,fn){$("#modalTitle").textContent=title;$("#modalBody").innerHTML=body;submitModal=fn;$("#modalBackdrop").classList.add("open");$("#modalBackdrop").setAttribute("aria-hidden","false")}
function closeModal(){$("#modalBackdrop").classList.remove("open");$("#modalBackdrop").setAttribute("aria-hidden","true");submitModal=null}
const data=form=>Object.fromEntries(new FormData(form).entries());
function campaignForm(c={}){openModal(c.id?"Editar campanha":"Nova campanha",field("NOME DA CAMPANHA","name",c.name||"","text",true,"Ex.: A Maldição do Farol")+field("CENÁRIO / REGIÃO","setting",c.setting||"Forgotten Realms")+field("DESCRIÇÃO","description",c.description||"","textarea",true,"Premissa, tom da aventura e objetivo do grupo..."),d=>{if(!d.name.trim())return toast("Informe o nome da campanha.");if(c.id)Object.assign(c,d);else{const x={id:uid(),...d,createdAt:Date.now()};S.campaigns.push(x);S.activeCampaignId=x.id}persist();renderCampaigns();renderDashboard();toast("Campanha salva.");closeModal()})}

function characterForm(c={}){
 openModal(c.id?"Editar perfil do aventureiro":"Cadastrar aventureiro",
  field("NOME DO PERSONAGEM","name",c.name||"")+
  field("JOGADOR","player",c.player||"")+
  field("RAÇA / ESPÉCIE","race",c.race||"")+
  field("CLASSE","className",c.className||"")+
  field("NÍVEL (OPCIONAL)","level",c.level||"","number")+
  field("ANTECEDENTE / PAPEL NA HISTÓRIA","background",c.background||"")+
  selectField("CAMPANHA","campaignId",[{value:"",label:"Sem campanha"},...S.campaigns.map(x=>({value:x.id,label:x.name}))],c.campaignId||"")+
  field("OBSERVAÇÕES DO MESTRE","notes",c.notes||"","textarea",true,"Personalidade, objetivo, segredo conhecido pelo mestre...")+
  `<div class="modal-help">Este cadastro é apenas uma referência narrativa. Atributos, PV, equipamentos, perícias e demais regras ficam na ficha física do jogador.</div>`,
  d=>{
   if(!d.name.trim())return toast("Informe o nome do personagem.");
   const obj={...d,level:d.level?clamp(d.level,1,20):""};
   if(c.id)Object.assign(c,obj);else S.characters.push({id:uid(),...obj});
   persist();renderCharacters();renderDashboard();toast("Perfil salvo.");closeModal();
  }
 );
}
function creatureForm(c={}){openModal(c.id?"Editar criatura":"Nova criatura",field("NOME","name",c.name||"")+selectField("TIPO","type",["Aberração","Animal","Constructo","Dragão","Elemental","Fada","Gigante","Humanoide","Morto-vivo","Monstruosidade","Planta","Outro"].map(x=>({value:x,label:x})),c.type||"Monstruosidade")+field("NÍVEL DE DESAFIO (ND)","cr",c.cr||"1/4")+field("CLASSE DE ARMADURA","ac",c.ac??12,"number")+field("PONTOS DE VIDA","hp",c.hp??10,"number")+field("DESLOCAMENTO","speed",c.speed||"9 m")+field("DESCRIÇÃO","description",c.description||"","textarea",true)+field("AÇÕES / ATAQUES","actions",c.actions||"","textarea",true),d=>{if(!d.name.trim())return toast("Informe o nome da criatura.");const o={...d,ac:clamp(d.ac,0,40),hp:clamp(d.hp,1,9999)};if(c.id)Object.assign(c,o);else S.creatures.push({id:uid(),...o,source:"Personalizada"});persist();renderCreatures();renderDashboard();toast("Criatura salva no bestiário.");closeModal()})}

function noteForm(n={}){openModal(n.id?"Editar anotação":"Nova anotação",field("TÍTULO","title",n.title||"","text",true,"Ex.: O segredo do velho farol")+selectField("CAMPANHA","campaignId",[{value:"",label:"Anotação geral"},...S.campaigns.map(c=>({value:c.id,label:c.name}))],n.campaignId||"")+field("CONTEÚDO","body",n.body||"","textarea",true,"Registre pistas, NPCs, acontecimentos, ideias e segredos..."),d=>{if(!d.title.trim())return toast("Dê um título à anotação.");if(n.id)Object.assign(n,{...d,updatedAt:Date.now()});else{const x={id:uid(),...d,updatedAt:Date.now()};S.notes.push(x);selectedNote=x.id}persist();renderNotes();renderDashboard();toast("Anotação salva.");closeModal()})}





const pick=a=>a[Math.floor(Math.random()*a.length)];
function generateNPC(){$("#npcOutput").innerHTML=`<b>${pick(["Aldren Voss","Mira Valen","Tomas Greymark","Seraphine Dusk","Borin Martelo-Forte","Lysandra Vale","Edrik Thorn","Nalia Ventobravo","Kael Morcant","Iria Solstício"])}</b>, ${pick(["humano","elfo","anão","halfling","tiefling","gnomo","meio-orc","draconato"])} e ${pick(["mercador itinerante","batedora da guarda","curandeiro de aldeia","cartógrafo recluso","nobre em decadência","artesã de armas","mensageiro da guilda","eremita das montanhas"])}.<br><br><b>Traço:</b> ${pick(["fala baixo e observa tudo antes de responder","tem uma risada contagiante e inadequada","nunca olha diretamente nos olhos","coleciona moedas de reinos desaparecidos","é cordial, mas evita falar do passado"])}.<br><br><b>Segredo:</b> ${pick(["deve um favor a uma entidade desconhecida","esconde uma carta que pode mudar a sucessão local","já encontrou um dos vilões e sobreviveu","protege secretamente alguém procurado","não é quem afirma ser"])}.`}
function generateQuest(){$("#questOutput").innerHTML=`<b>Chamado:</b> ${pick(["uma prefeita assustada","um sacerdote sem fé","uma criança que não aceita a versão oficial","um mercador à beira da falência","um espírito preso a uma promessa"])} pede ajuda para ${pick(["recuperar um artefato desaparecido","escoltar uma testemunha até outra cidade","investigar luzes sob as ruínas","encontrar uma pessoa que sumiu na estrada","impedir um acordo realizado à meia-noite"])}.<br><br><b>Complicação:</b> ${pick(["o contratante omitiu parte da verdade","o alvo está protegendo a região de algo pior","um aliado do grupo está envolvido","o artefato escolhe quem pode tocá-lo","o prazo termina antes do próximo amanhecer"])}.<br><br><b>Recompensa:</b> ${pick(["uma relíquia de família e 150 PO","um mapa com uma rota secreta","abrigo e contatos em uma cidade importante","um favor político difícil de conseguir","uma recompensa em ouro negociável"])}.`}
function generateEncounter(){$("#encounterOutput").innerHTML=`<b>Local:</b> ${pick(["uma ponte estreita coberta por névoa","um salão de banquete abandonado","uma trilha tomada por raízes","um mercado durante uma tempestade","uma capela com velas recém-acesas"])}.<br><br><b>O que acontece:</b> ${pick(["um pedido de socorro vem de dentro de uma armadura vazia","um grupo rival oferece uma aliança duvidosa","o chão começa a ceder lentamente","um animal ferido carrega um símbolo conhecido","uma voz anuncia o nome de um dos aventureiros"])}.<br><br><b>Risco:</b> ${pick(["se falharem, um contato será capturado","o barulho pode atrair algo maior","a escolha revela a posição do grupo","há pouco tempo antes que a passagem se feche","o encontro pode ser resolvido sem violência"])}.`}

const BRIDGE_KEY="RPG_MASTER_BRIDGE_v1";
function buildBridge(selection={}){
 const campaign=S.campaigns.find(x=>x.id===S.activeCampaignId)||S.campaigns[0]||null;
 const chars=(selection.characters||[]).map(c=>({id:c.id,name:c.name,player:c.player||"",race:c.race||"",className:c.className||"",level:c.level||"",background:c.background||"",notes:c.notes||""}));
 const creatures=(selection.creatures||[]).map(c=>({id:c.id,name:c.name,type:c.type||"Monstro",cr:c.cr||"",ac:Number(c.ac)||10,hp:Number(c.hp)||10,maxHp:Number(c.hp)||10,speed:c.speed||"",description:c.description||"",actions:c.actions||""}));
 return {app:"RPG_MASTER_BRIDGE",version:1,exportedAt:new Date().toISOString(),campaign:campaign?{id:campaign.id,name:campaign.name,setting:campaign.setting||""}:null,characters:chars,creatures};
}
function downloadBridge(selection){
 const payload=buildBridge(selection),blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="rpg-master-para-mesa.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 toast("Pacote de integração baixado. Na Mesa Virtual, clique em Importar do RPG MASTER.");
}
function publishBridge(selection,alsoDownload=false){
 const payload=buildBridge(selection);
 try{localStorage.setItem(BRIDGE_KEY,JSON.stringify(payload));}catch{}
 try{if("BroadcastChannel" in window){const channel=new BroadcastChannel("RPG_MASTER_MESA");channel.postMessage(payload);channel.close()}}catch{}
 if(alsoDownload)downloadBridge(selection);else toast("Grupo enviado para a sincronização da Mesa Virtual.");
}

function exportBackup(){const blob=new Blob([JSON.stringify({app:"RPG MASTER",version:1,exportedAt:new Date().toISOString(),state:S},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`rpg-master-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Backup exportado.")}
function importBackup(file){const reader=new FileReader();reader.onload=()=>{try{const o=JSON.parse(reader.result),v=o.state||o;if(!v||!Array.isArray(v.campaigns)||!Array.isArray(v.characters))throw Error();S={...defaults(),...v};delete S.sessions;delete S.combatants;delete S.round;delete S.turnIndex;delete S.combatStarted;delete S.rolls;
S.characters=(S.characters||[]).map(c=>({id:c.id||uid(),name:c.name||"",player:c.player||"",race:c.race||"",className:c.className||"",level:c.level||"",background:c.background||"",campaignId:c.campaignId||"",notes:c.notes||""}));
persist();renderAll();toast("Backup importado com sucesso.")}catch{toast("Arquivo de backup inválido.")}};reader.readAsText(file)}
function handle(btn){
 const a=btn.dataset.action,id=btn.dataset.id;
 if(a==="sync-party")publishBridge({characters:S.characters,creatures:[]},false);
 if(a==="export-bridge")downloadBridge({characters:S.characters,creatures:[]});
 if(a==="new-campaign")campaignForm();
 if(a==="edit-campaign"){const c=S.campaigns.find(x=>x.id===id);if(c)campaignForm(c)}
 if(a==="delete-campaign"&&confirm("Excluir esta campanha? Os personagens não serão excluídos.")){S.campaigns=S.campaigns.filter(x=>x.id!==id);if(S.activeCampaignId===id)S.activeCampaignId=S.campaigns[0]?.id||null;persist();renderCampaigns();renderDashboard();toast("Campanha excluída.")}
 if(a==="activate-campaign"){S.activeCampaignId=id;persist();renderCampaigns();renderDashboard();toast("Campanha ativa definida.")}
 if(a==="new-character")characterForm();
 if(a==="edit-character"){const c=S.characters.find(x=>x.id===id);if(c)characterForm(c)}
 if(a==="send-character"){const c=S.characters.find(x=>x.id===id);if(c)publishBridge({characters:[c],creatures:[]},true)}
 if(a==="delete-character"&&confirm("Remover este perfil de aventureiro?")){S.characters=S.characters.filter(x=>x.id!==id);persist();renderCharacters();renderDashboard();toast("Personagem removido.")}
 if(a==="new-creature")creatureForm();
 if(a==="edit-creature"){const c=S.creatures.find(x=>x.id===id);if(c)creatureForm(c)}
 if(a==="send-creature"){const c=S.creatures.find(x=>x.id===id);if(c)publishBridge({characters:S.characters,creatures:[c]},true)}
 if(a==="delete-creature"&&confirm("Excluir esta criatura do bestiário?")){S.creatures=S.creatures.filter(x=>x.id!==id);persist();renderCreatures();renderDashboard();toast("Criatura removida.")}
 if(a==="generate-npc")generateNPC();if(a==="generate-quest")generateQuest();if(a==="generate-encounter")generateEncounter();
 if(a==="new-note")noteForm();
 if(a==="select-note"){selectedNote=id;renderNotes()}
 if(a==="edit-note"){const n=S.notes.find(x=>x.id===id);if(n)noteForm(n)}
 if(a==="delete-note"&&confirm("Excluir esta anotação?")){S.notes=S.notes.filter(x=>x.id!==id);selectedNote=null;persist();renderNotes();renderDashboard();toast("Anotação excluída.")}
}
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-view]");if(nav){navigate(nav.dataset.view);return}
 const link=e.target.closest("[data-view-link]");if(link){navigate(link.dataset.viewLink);return}
 const act=e.target.closest("[data-action]");if(act){handle(act);return}

});
$("#modalForm").addEventListener("submit",e=>{e.preventDefault();if(submitModal)submitModal(Object.fromEntries(new FormData(e.currentTarget).entries()))});
$("#closeModal").addEventListener("click",closeModal);$("#cancelModal").addEventListener("click",closeModal);$("#modalBackdrop").addEventListener("click",e=>{if(e.target===$("#modalBackdrop"))closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#characterSearch").addEventListener("input",renderCharacters);$("#characterCampaignFilter").addEventListener("change",renderCharacters);$("#creatureSearch").addEventListener("input",renderCreatures);$("#creatureTypeFilter").addEventListener("change",renderCreatures);
$("#exportBtn").addEventListener("click",exportBackup);$("#importBtn").addEventListener("click",()=>$("#importFile").click());$("#importFile").addEventListener("change",e=>{if(e.target.files[0])importBackup(e.target.files[0]);e.target.value=""});
$("#mobileMenu").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
renderAll();
})();