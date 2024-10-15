var NoteJSON = []
/* Helper Function*/
// Dev.TO: /nombrekeff/download-file-from-blob-21ho
var notepassword = ""
var activenote
var sgnupnow = 0
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
/**
 * Encrypts plaintext using AES-GCM with supplied password, for decryption with aesGcmDecrypt().
 *                                                                      (c) Chris Veness MIT Licence
 *
 * @param   {String} plaintext - Plaintext to be encrypted.
 * @param   {String} password - Password to use to encrypt plaintext.
 * @returns {String} Encrypted ciphertext.
 *
 * @example
 *   const ciphertext = await aesGcmEncrypt('my secret text', 'pw');
 *   aesGcmEncrypt('my secret text', 'pw').then(function(ciphertext) { console.log(ciphertext); });
 */
 async function aesGcmEncrypt(plaintext, password) {
    const pwUtf8 = new TextEncoder().encode(password);                                 // encode password as UTF-8
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);                      // hash the password

    const iv = crypto.getRandomValues(new Uint8Array(12));                             // get 96-bit random iv

    const alg = { name: 'AES-GCM', iv: iv };                                           // specify algorithm to use

    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['encrypt']); // generate key from pw

    const ptUint8 = new TextEncoder().encode(plaintext);                               // encode plaintext as UTF-8
    const ctBuffer = await crypto.subtle.encrypt(alg, key, ptUint8);                   // encrypt plaintext using key
 
    const ctArray = Array.from(new Uint8Array(ctBuffer));                              // ciphertext as byte array
    const ctStr = ctArray.map(byte => String.fromCharCode(byte)).join('');             // ciphertext as string
    const ctBase64 = btoa(ctStr);                                                      // encode ciphertext as base64

    const ivHex = Array.from(iv).map(b => ('00' + b.toString(16)).slice(-2)).join(''); // iv as hex string

    return ivHex+ctBase64;                                                             // return iv+ciphertext
}


/**
 * Decrypts ciphertext encrypted with aesGcmEncrypt() using supplied password.
 *                                                                      (c) Chris Veness MIT Licence
 *
 * @param   {String} ciphertext - Ciphertext to be decrypted.
 * @param   {String} password - Password to use to decrypt ciphertext.
 * @returns {String} Decrypted plaintext.
 *
 * @example
 *   const plaintext = await aesGcmDecrypt(ciphertext, 'pw');
 *   aesGcmDecrypt(ciphertext, 'pw').then(function(plaintext) { console.log(plaintext); });
 */
async function aesGcmDecrypt(ciphertext, password) {
    const pwUtf8 = new TextEncoder().encode(password);                                  // encode password as UTF-8
    const pwHash = await crypto.subtle.digest('SHA-256', pwUtf8);                       // hash the password

    const iv = ciphertext.slice(0,24).match(/.{2}/g).map(byte => parseInt(byte, 16));   // get iv from ciphertext

    const alg = { name: 'AES-GCM', iv: new Uint8Array(iv) };                            // specify algorithm to use

    const key = await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']);  // use pw to generate key

    const ctStr = atob(ciphertext.slice(24));                                           // decode base64 ciphertext
    const ctUint8 = new Uint8Array(ctStr.match(/[\s\S]/g).map(ch => ch.charCodeAt(0))); // ciphertext as Uint8Array
    // note: why doesn't ctUint8 = new TextEncoder().encode(ctStr) work?

    const plainBuffer = await crypto.subtle.decrypt(alg, key, ctUint8);                 // decrypt ciphertext using key
    const plaintext = new TextDecoder().decode(plainBuffer);                            // decode password from UTF-8

    return plaintext;                                                                   // return the plaintext
}
//------------------------------------------------------------------------------------
/* Normal Note Functions */
function changecolor(color,noteno){
    document.getElementById("tnt"+noteno).style.backgroundColor = color;
    let a = NoteJSON.length;
    for (i=0;i<a;i++){
        if (NoteJSON[i].noteno == String(noteno)){
            NoteJSON[i].color = color
        }
    }
}
function addNewNote(type,title,content,color,noteno) {
    if (type == 0){
        title = "Notes"
        content = "Notes Content"
        color = "#00000"
        noteno = String(Date.now())
    }
    a = document.getElementById("title_notes")
    a.insertAdjacentHTML('beforeend', '<div class = "t_notes" id = "tnt'+noteno+'" onclick = "change2('+noteno+')"><span class = "tntc2" id = "tntc'+noteno+'">'+title+'</span><a class="closebtn" onclick="deleteNote('+noteno+');">❌</a></div>');
    document.getElementById("tnt"+noteno).style.backgroundColor = color
    notesvar = {noteno:noteno,type:"note",title:title,content:content,color:color}
    NoteJSON.push(notesvar)
};
function deleteNote(noteno) {
    document.getElementById("tnt" + noteno).remove();
    a = NoteJSON.length;
    for (i=0;i<a;i++){
        if (NoteJSON[i].noteno == String(noteno)){
            NoteJSON.splice(i,1)
        }
    }
};
function change2(noteno){
    b = document.getElementsByClassName("t_notes").length
    for (i=0;i<b;i++){
        document.getElementsByClassName("t_notes")[i].style.borderColor = "cyan"
    }
    var flag_ = false;
    a = NoteJSON.length
    for (i=0;i<a;i++){
        if (NoteJSON[i].noteno == String(activenote)){
            NoteJSON[i].title = document.getElementById("nt_title").value
            document.getElementById("tntc"+activenote).innerText = document.getElementById("nt_title").value
            NoteJSON[i].content = document.getElementById("nt_content").value
        }
	if (NoteJSON[i].noteno == String(noteno)){
		flag_ = true;
	}
    }
    if (!flag_){
	  console.log("Error: NoteNo not found");
	  return;  
    }
    document.getElementById("tnt"+noteno).style.borderColor = "purple"
    activenote = noteno
    for (i=0;i<a;i++){
        if (NoteJSON[i].noteno == String(noteno)){
            document.getElementById("nt_title").value = NoteJSON[i].title 
            document.getElementById("nt_content").value = NoteJSON[i].content
            document.getElementById("colorpicker").attributes.onchange.nodeValue = "changecolor(this.value,"+noteno+")"
            rendererMK()
        }
    }
}
//------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------
function saveDataNote(dwndType) {
    change2(0)
    noteno = document.getElementsByClassName("notes").length
    const stringifiedjson = JSON.stringify(NoteJSON)
    const bytesjson = new TextEncoder().encode(stringifiedjson);
    const bytestxt = new TextEncoder().encode(btoa(stringifiedjson));
    var byttxt = "MTTNotesV1:" + btoa(stringifiedjson)
    console.log(byttxt)
    if (byttxt == "MTTNotesV1:W10=" && sgnupnow == 1){
        alert("No Data To Save")
        throw new Error ("Empty Notes")
    }
    const astxt = btoa(stringifiedjson)
    if (dwndType == "1") {
        var encrypted
        m = aesGcmEncrypt(byttxt, notepassword)
        m.then(function(result) {encrypted = result;encrypted = new TextEncoder().encode(encrypted); encblob = new Blob([encrypted], { type: "application/txt;charset=utf-8" });downloadBlob(encblob, "notes" + String(Date.now()) + ".mttn")});     
    } else if (dwndType == "2") {
        pswrd = notepassword
        var encrypted
        m = aesGcmEncrypt(byttxt, pswrd)
        m.then(function(result) {encrypted = result;localStorage.setItem("data", encrypted)});
        // encrypted = new TextEncoder().encode(encrypted);console.log(encrypted);
    }else {
        console.log("(C) MTT 2021")
    }
};
function json2notes(jspn){
    jsondata = jspn
    console.log(jsondata)
    v = jsondata.length
    for (var i =0; i < v; i= i+1){
        if (jsondata[i].type == "note"){
            title = jsondata[i].title
            content = jsondata[i].content
            noteno= jsondata[i].noteno
            color = jsondata[i].color
            addNewNote(1,title,content,color,noteno)
        } else if (jsondata[i].type == "todo"){
            description = jsondata[i].description
            status = jsondata[i].status
            noteno = jsondata[i].noteno
            // addToDo(1,description,status,noteno)   //removed_todo_in_new_version. 
        }
    }
    document.getElementById("login").style.display = "none"
    notepassword = document.getElementById("lgn_password").value
    nosaveData = "1"
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

function parseUplJSON(jsoni){
    // console.log(JSON.parse(jsoni))
    json2notes(JSON.parse(JSON.parse(jsoni)))
    
}
function uploadnote(){
    upwrd = document.getElementById("up_password").value
    m = aesGcmDecrypt(filecontent, upwrd)
    var decrypted
    m.then(function(result) {decrypted = result;decrypted = decrypted.replace("MTTNotesV1:","");decryptedatb = atob(decrypted);decryptedJSON = JSON.stringify(decryptedatb);parseUplJSON(decryptedJSON);stngdn();});  
}
function syncfromlocal(){
    a = localStorage.getItem("data")
    console.log(a)
    upwrd = document.getElementById("lgn_password").value
    m = aesGcmDecrypt(a, upwrd)
    var decrypted
    m.then(function(result) {decrypted = result;decrypted = decrypted.replace("MTTNotesV1:","");decryptedatb = atob(decrypted);decryptedJSON = JSON.stringify(decryptedatb);parseUplJSON(decryptedJSON)});  
}
var nosaveData = "0"
window.onbeforeunload=function(event){
    if (nosaveData == "1"){
        saveDataNote(2)
    }
    
  };
function removeAll(){
    if (document.getElementById("del_notes_all").value == "DELETE"){
        window.localStorage.removeItem("data")
        nosaveData= "0"
        window.location.reload()
    }
}
function stngup(){
    document.getElementById("settings").style.visibility = "visible"
	document.getElementById("settings").style.opacity = "1";
}
function stngdn(){
    document.getElementById("settings").style.visibility = "hidden"
	document.getElementById("settings").style.opacity = "0";
}

notepassword = document.getElementById("lgn_password").value

function checkEmpty(){
    a = window.localStorage.getItem("data")
    if (a=="" || a == undefined || a == null){
        document.getElementById("lgnbox").style.display = "none"
        sgnupnow = 1
    }else if (a != ""){
        document.getElementById("crbox").style.display = "none"
    }else {
        document.getElementById("crbox").style.display = "none"
    }
}
function sgnup() {
    a = document.getElementById("nw_password").value
    b = document.getElementById("nw1_password").value
    if (a==b){
        notepassword = document.getElementById("nw_password").value
        document.getElementById("login").style.display = "none"
    }else{
        alert("Passwords Dont Match")
    }
    nosaveData = "1"
}
checkEmpty()
function rendererMK(){
    v = marked.parse(document.getElementById('nt_content').value)
    clean = DOMPurify.sanitize(v);
    document.getElementById('parsed').innerHTML = clean
    renderMathInElement(document.getElementById('parsed'));
}
