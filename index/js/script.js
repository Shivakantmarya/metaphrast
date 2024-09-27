const fromText = document.querySelector(".from-text"),
toText = document.querySelector(".to-text"),
exchageIcon = document.querySelector(".exchange"),
selectTag = document.querySelectorAll("select"),
icons = document.querySelectorAll(".row i");
translateBtn = document.querySelector("#translateBtn");
let logo = document.querySelector(".logo");
let container = document.querySelector(".container");
let meaning = document.querySelector("#meaning");
let head = document.querySelector(".head");
// let synonyms = document.querySelector("#synonyms");
let example = document.querySelector("#example");
let customIcon = document.querySelector(".customIcon");
let details = document.querySelector(".details");
let newTranslateBtn = document.querySelector("#newTranslateBtn");


customIcon.addEventListener('click',()=>{

    // var div = document.getElementById("toggleDiv");
    if (head.style.display === "none") {
        head.style.display = "flex";
    } else {
        head.style.display = "none";
    }
    // head.style.display = 'flex';
})



container.classList.add("hide");
logo.classList.remove("hide");
head.classList.add("hide");
customIcon.classList.add("hide");
newTranslateBtn.classList.add("hide");

setTimeout(()=>{
logo.classList.add("hide");
container.classList.remove("hide");
head.classList.remove("hide");
customIcon.classList.remove("hide");
},2000)




selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id == 0 ? country_code == "en-GB" ? "selected" : "" : country_code == "hi-IN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchageIcon.addEventListener("click", () => {
    let tempText = fromText.value,
    tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

fromText.addEventListener("keyup", () => {
    if(!fromText.value) {
        toText.value = "";
        meaning.innerHTML = "";
        synonyms.innerHTML = "";
        example.innerHTML = "";
        details.style.display = "none";
        newTranslateBtn.classList.add("hide");
        translateBtn.classList.remove("hide");
    }
});



const getData = async (searchValue) =>{
    meaning.setAttribute("placeholder", "Defination...");
    synonyms.setAttribute("placeholder", "Synonyms...");
    example.setAttribute("placeholder", "Examples...");
    let data = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchValue}`);
    let jsonData = await data.json();
    console.log(jsonData);
    meaning.innerHTML ="Defination : "+ jsonData[0].meanings[0].definitions[0].definition;
    synonyms.innerHTML =`Synonyms : ${jsonData[0].meanings[0].synonyms} `;
    example.innerHTML = `Example: ${jsonData[0].meanings[0].definitions[0].example}`;
    console.log(example.value);
    console.log(synonyms.value);
    console.log(meaning.value);

    meaning.setAttribute("placeholder", "Defination");
    synonyms.setAttribute("placeholder", "Synonyms");
    example.setAttribute("placeholder", "Example");

    // meaning.appendChild(div);
    // toText.setAttribute("placeholder", "Translatio");
}

///  Count Strings....




function countStrings(inputString, delimiter) {
    // Split the input string by the delimiter and return the count of resulting strings
    delimiter = " ";
    // let oWidth = window.outerWidth;


    let str =  inputString.split(delimiter).length;
    if(str > 1){
        details.style.display = "none";
        // translateBtn.style.left = "12.5rem";
    }

    else{
         details.style.display = "flex"; 
                  
    }
}




translateBtn.addEventListener("click", () => {

    let text = fromText.value.trim(),
    translateFrom = selectTag[0].value,
    translateTo = selectTag[1].value;
    if(!text) return;
    toText.setAttribute("placeholder", "Translating...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
    console.log(apiUrl);

    getData(text);
   




    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        data.matches.forEach(data => {
            if(data.id === 0) {
                toText.value = data.translation;
            }
        });
        toText.setAttribute("placeholder", "Translation");
    });

    countStrings(fromText.value)

    // Invisible Translate button

    translateBtn.classList.add("hide");

    // Visible New Translate button

    newTranslateBtn.classList.remove("hide");
    
});


//   New translate btn....

newTranslateBtn.addEventListener("click", ()=>{
    translateBtn.classList.remove("hide");
    newTranslateBtn.classList.add("hide");
    fromText.value = "";
    toText.value = "";
    meaning.innerHTML = "";
    synonyms.innerHTML = "";
    example.innerHTML = "";
    details.style.display = "none";
})

icons.forEach(icon => {
    icon.addEventListener("click", ({target}) => {
        if(!fromText.value || !toText.value) return;
        if(target.classList.contains("fa-copy")) {
            if(target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
                fromText.select();
            } else {
                navigator.clipboard.writeText(toText.value);
                toText.select();
            }
        } else {
            let utterance;
            if(target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    });

    
});





///   mic functionality....

const startBtn = document.querySelector('.btn');
// console.log(startBtn);
// const outputDiv = document.getElementById('output');
const recognition = new webkitSpeechRecognition();

recognition.continuous = true;
recognition.lang = 'en-US';

let mikeState = false;
mikeState = !mikeState;

// mikeState ? speakButton() : "";

function speakButton(){
    if(mikeState){
        recognition.start();
        fromText.textContent = 'Listening...';
    }
     else{
        recognition.abort();
        recognition.disabled = true;
        fromText.textContent = '';
    }
}


recognition.onresult = (event) => {
  const transcript = event.results[event.results.length - 1][0].transcript;
  fromText.textContent = 'You: ' + transcript;
//   getData(event.target.value);
//   formText.innerHTML = transcript;
};

recognition.onend = () => {
  startBtn.disabled = false;
  recognition.disabled = true;
//   fromText.textContent = '';
};

recognition.onerror = (event) => {
  fromText.textContent = 'Tap the mic,then speak into your device for quick answers: ' + event.error;
};



