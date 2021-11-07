dNoteTimes = []
/* Helper Function*/
// Dev.TO: /nombrekeff/download-file-from-blob-21ho
function downloadBlob(blob, name) {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name;
    document.body.appendChild(link);
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );
    document.body.removeChild(link);
}
//------------------------------------------------------------------------------------
/* Normal Note Functions */
function changecolor(color,noteno){
    document.getElementById("note"+noteno).style.backgroundColor = color;
}
function addNewNote(type,title,content,color,crt_on) {
    if (type == 0){
        title = "Notes"
        content = "Notes Content"
        color = "#ffc"
        crt_on = String(Date.now())
    }
    a = document.getElementById("notes")
    a.insertAdjacentHTML('beforeend', '<div class = "notes" id = "note' + crt_on + '"><textarea class = "notes-title" id = "nt' + crt_on + '" placeholder="Note Title" maxlength="20" onchange ="saveDataNote(2)" ></textarea><a class = "closebtn" onclick = "deleteNote(' + crt_on + ');">❌</a><textarea class = "notes-content" id = "nc' + crt_on + '" placeholder="Note Content" onchange ="saveDataNote(2)"></textarea><input type="color" id="favcolor" name="favcolor" value="#ff0000" style = "width:20px;border-radius:30px 30px 30px 30px;background-color:black" onchange = "changecolor(this.value,'+crt_on+')"></div>');
    b = "nt" + crt_on
    c = "nc" + crt_on
    document.getElementById(b).value = title
    document.getElementById(c).value = content
    document.getElementById("note"+crt_on).style.backgroundColor = color
};
function deleteNote(noteno) {
    document.getElementById("note" + noteno).remove();
};
//------------------------------------------------------------------------------------
function addNewDestructNote() {
    dnoteno = String(Date.now())
    a = document.getElementById("notes")
    a.insertAdjacentHTML('beforeend', '<div class = "dnotes" id = "note' + dnoteno + '"><textarea class = "dnotes-title" id = "dnt' + dnoteno + '" placeholder="Note Title" maxlength="20" ></textarea><textarea class = "dnotes-content" id = "dnc' + dnoteno + '" placeholder="Note Content"></textarea><input id = "dntt' + dnoteno + '"><a class = "donebtn" onclick = "addTime(' + dnoteno + ');>✔️</a></div>');
    b = "dnt" + dnoteno
    c = "dnc" + dnoteno
    document.getElementById(b).innerHTML = "Self Destruct Note"
    document.getElementById(c).innerHTML = "This Note Destroys Itself After Certain Interval"
    dNoteTimes.push(dnoteno)
};
//------------------------------------------------------------------------------------
function addToDo(type,description,status,crt_on) {
    if (type == 0){
        description = document.getElementById("newtodotask").value
        crt_on = String(Date.now())
        status = "rgb(0, 139, 139)"
    }
    if (status == "rgb(220, 20, 60)"){
        toclass = "t0d0 t0d0-done"
    }else {
        toclass = "t0d0 t0d0-pending"
    }
    if (description == "") { alert("Please Enter Something"); } else {
        a = document.getElementById("todotasks") 
        a.insertAdjacentHTML('beforeend', '<div class = "'+toclass+'" id = "td-' + crt_on + '" style = "margin: 10px;padding: 5px;border-radius: 20px 20px 20px;">' + description + '<a class = "closebtn" onclick = "removetoDo(' + crt_on + ');">🗑️</a><a class = "donebtn" onclick = "doneToDo(' + crt_on + ');">✔️</a></div>')
        document.getElementById("newtodotask").value = ""
    }
}
function doneToDo(todono) {
    if (document.getElementById("td-" + todono).className == "t0d0 t0d0-done") {
        document.getElementById("td-" + todono).className = "t0d0 t0d0-pending"
    } else {
        document.getElementById("td-" + todono).className = "t0d0 t0d0-done"
    }

}
function removetoDo(todono) {
    document.getElementById("td-" + todono).remove();
}
function tododropper() {
    if (document.getElementById("tododropdown").className == "fa fa-chevron-down") {
        document.getElementById("tododropdown").className = "fa fa-chevron-up"
        document.getElementById("todolist").style.height = "500px"
    } else {
        document.getElementById("tododropdown").className = "fa fa-chevron-down"
        document.getElementById("todolist").style.height = "25px"
        document.getElementById("tododropdown").style.overflow = "hidden"
    }
}
var NoteJSON = []
function saveDataNote(dwndType) {
    NoteJSON = []
    noteno = document.getElementsByClassName("notes").length
    for (var i = 0; i < (noteno); i = i + 1) {
        notesvar = {}
        notesvar["noteno"] = i
        notesvar["type"] = "note"
        notesvar["title"] = document.getElementsByClassName("notes-title")[i].value
        notesvar["content"] = document.getElementsByClassName("notes-content")[i].value
        notesvar["color"] =  window.getComputedStyle(document.getElementsByClassName("notes")[i], null).getPropertyValue("background-color");
        m = document.getElementsByClassName("notes")[i].id
        n = m.replace("note","")
        notesvar["crt_on"] = n
        NoteJSON.push(notesvar)
    }
    todono = document.getElementsByClassName("t0d0").length
    for (var i = 0; i < (todono); i = i + 1) {
        todovar = {}
        todovar["todono"] = i
        todovar["type"] = "todo"
        todovar["description"] = (document.getElementsByClassName("t0d0")[i].innerText).replace("\n🗑️\n✔️","")
        todovar["status"] = window.getComputedStyle(document.getElementsByClassName("t0d0")[i], null).getPropertyValue("background-color");
        m = document.getElementsByClassName("t0d0")[i].id
        n = m.replace("td-","")
        todovar["crt_on"] = n
        NoteJSON.push(todovar)
    }
    const stringifiedjson = JSON.stringify(NoteJSON)
    const bytesjson = new TextEncoder().encode(stringifiedjson);
    const bytestxt = new TextEncoder().encode(btoa(stringifiedjson));
    var byttxt = "MTTNotesV1:" + btoa(stringifiedjson)
    const astxt = btoa(stringifiedjson)
    if (dwndType == "1") {
        let NoteTxt = new Blob([bytestxt], { type: "application/txt;charset=utf-8" })
        downloadBlob(NoteTxt, "notes" + String(Date.now()) + ".mttn")
    } else if (dwndType == "2") {
        localStorage.setItem("svddata", astxt)
    } else if (dwndType == "3"){
        let NoteJSONblob = new Blob([bytesjson], { type: "application/json;charset=utf-8" });
        downloadBlob(NoteJSONblob, "mttnotes" + String(Date.now()) + ".json")
    } else if (dwndType == "4") {
        pswrd = document.getElementById('tt_password').value
        var encrypted
        m = aesGcmEncrypt(byttxt, pswrd)
        m.then(function(result) {encrypted = result;encrypted = new TextEncoder().encode(encrypted); encblob = new Blob([encrypted], { type: "application/txt;charset=utf-8" });downloadBlob(encblob, "notes" + String(Date.now()) + ".mttn")});     
    } else {
        console.log("(C) MTT 2021")
    }
    document.getElementById('tt_password').value = "" 
};
function json2notes(jspn){
    jsondata = jspn
    v = jsondata.length
    for (var i =0; i < v; i= i+1){
        if (jsondata[i].type == "note"){
            title = jsondata[i].title
            content = jsondata[i].content
            crt_on= jsondata[i].crt_on
            color = jsondata[i].color
            addNewNote(1,title,content,color,crt_on)
        } else if (jsondata[i].type == "todo"){
            description = jsondata[i].description
            status = jsondata[i].status
            crt_on = jsondata[i].crt_on
            addToDo(1,description,status,crt_on)
        }
    }
}
var filecontent
// https://stackoverflow.com/a/29176118
var openFile = function(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function(){
      var text = reader.result;
      filecontent = text.replace("","")
    };
    reader.readAsText(input.files[0]);
  };
var tjson
function parseUplJSON(jsoni){
    tojson = jsoni
    tojson = JSON.parse(tojson)
    tojson = JSON.parse(tojson)
    tjson = tojson
    console.log(tojson)
    json2notes(tojson)
    
}
function uploadnote(){
    upwrd = document.getElementById("up_password").value
    m = aesGcmDecrypt(filecontent, upwrd)
    var decrypted
    m.then(function(result) {decrypted = result;decrypted = decrypted.replace("MTTNotesV1:","");decryptedatb = atob(decrypted);decryptedJSON = JSON.stringify(decryptedatb);parseUplJSON(decryptedJSON)});  
}
function syncfromlocal(){
    a = localStorage.getItem("svddata")
    b = atob(a)
    c = JSON.parse(b)
    json2notes(c)
}
var nosaveData = "1"
window.onbeforeunload=function(event){
    if (nosaveData == "1"){
        saveDataNote(2)
    }
    
  };
function removeAll(){
    if (document.getElementById("del_notes_all").value == "DELETE"){
        window.localStorage.removeItem("svddata")
        nosaveData= "0"
        window.location.reload()
        
    }
}
syncfromlocal()
