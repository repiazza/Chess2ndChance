// const TIMER_SETUPS = [60, 180, 300, 600]

// const TIMER_MINUTE = 0;
// const TIMER_THREE_MINUTES = 1;
// const TIMER_FIVE_MINUTES = 2;
// const TIMER_TEN_MINUTES = 3;

// const TIMER_MILLISEC_MULTIPLIER = 1000;

// let GAME_INITIAL_TIME =  TIMER_SETUPS[TIMER_FIVE_MINUTES] ;

// var btimer = GAME_INITIAL_TIME;
// function blackPlayerTimer() {
//     let seconds;
//     let minutes;
//     minutes = parseInt(btimer / 60, 10)
//     seconds = parseInt(btimer % 60, 10);

//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     seconds = seconds < 10 ? "0" + seconds : seconds;

//     document.getElementById("bspntmr").textContent = minutes + ":" + seconds;

//     if (--btimer < 0) {
//         btimer = GAME_INITIAL_TIME;
//     }
// }
// var wtimer = GAME_INITIAL_TIME;
// function whitePlayerTimer() {
//     let seconds;
//     let minutes;
//     minutes = parseInt(wtimer / 60, 10)
//     seconds = parseInt(wtimer % 60, 10);

//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     seconds = seconds < 10 ? "0" + seconds : seconds;

//     document.getElementById("wspntmr").textContent = minutes + ":" + seconds;

//     if (--wtimer < 0) {
//         wtimer = GAME_INITIAL_TIME;
//     }
// }
// function bTimerHandler(event){
//     let chksts = document.getElementById('btinput').checked;
//     // alert(chksts)
//     if ( chksts == true ){
//         // document.getElementById('btinput').checked = true;
//         return true;
//     }

//     // alert(document.getElementById('btinput').checked)
//     // alert(document.getElementById('wtinput').checked)
//     window.clearInterval(bPTInterval);
//     document.getElementById('btinput').checked = false;
//     document.querySelector('#blacktimer').style = "pointer-events:none;";
//     document.querySelector('#whitetimer').style = "pointer-events:auto;";
//     document.getElementById('wtinput').checked = !document.getElementById('wtinput').checked;
//     wPTInterval = window.setInterval(whitePlayerTimer, 1000);
//     return false;
// }
// function wTimerHandler(event){
//     let chksts = document.getElementById('wtinput').checked;
//     if ( chksts == true ){
//         // document.getElementById('wtinput').checked = true;
//         return true;
//     }

//     window.clearInterval(wPTInterval);
//     document.getElementById('btinput').checked = !document.getElementById('btinput').checked;
//     document.getElementById('wtinput').checked = false;
//     document.querySelector('#whitetimer').style = "pointer-events:none;";
//     document.querySelector('#blacktimer').style = "pointer-events:auto;";
//     bPTInterval = window.setInterval(blackPlayerTimer, 1000);
//     return true;
// }
// function setClockVisibility(visibilityStatus){
//     if ( visibilityStatus == VISIBILITY_VISIBLE ) {
//         document.querySelectorAll('[id*=timer]').forEach(element => {
//             element.classList.remove("sethidden")
//             element.classList.add("setvisible")
//         });   
//     }
//     if ( visibilityStatus == VISIBILITY_HIDDEN ) {
//         document.querySelectorAll('[id*=timer]').forEach(element => {
//             element.classList.add("sethidden")
//             element.classList.remove("setvisible")
//         });   
//     }
// }
// function setClock(){
//     setClockListener("whitetimer", wTimerHandler);
//     setClockListener("blacktimer", bTimerHandler);
//     setClockVisibility(VISIBILITY_VISIBLE)
//     wPTInterval = window.setInterval(whitePlayerTimer, 1000);
//     bPTInterval = window.setInterval(blackPlayerTimer, 1000);
//     window.clearInterval(bPTInterval);
//     document.getElementById('wtinput').checked = false;
//     document.getElementById('btinput').checked = true;
// }
// function setClockListener(clockId, cHdl){
//     const createclock = document.getElementById(clockId);
//     createclock.addEventListener('click', cHdl);
// }