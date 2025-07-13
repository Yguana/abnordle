const abnos = window.abnos
const correctAnswer = abnos[generateSeedTroughDay(new Date())]
const unformatedDate = new Date()
const formatedDate = getFormatedDate(new Date())
const maxAnswers = 8

const background = document.getElementById("trueBackground")
const inputText = document.getElementById("inputText")
const inputButton = document.getElementById("inputButton")
const optionsList = document.getElementById("options")
const attemptCounter = document.getElementById("attemptCounter")
const answerHolder = document.getElementById("answerHolder")
const backgroundCheckbox = document.getElementById("cbxBackgroundAnim")
const mistakePopup = document.getElementById("mistakePopup")
const mistakeTextDisplay = document.getElementById("mistakeText")
const postWinDiv = document.getElementById("postWinStatus")
const timeDisplay = document.getElementById("timeDisplay")
const tutorialModal = document.getElementById("tutorialHolder")
const tutorialText = document.getElementById("tutorialText")
const winEmoteList = [
    "imgs/win_emotes/000.png",
    "imgs/win_emotes/001.png",
    "imgs/win_emotes/002.png",
    "imgs/win_emotes/003.png",
]
const writtenMonths = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Septemper",
    "October",
    "November",
    "December",
]

let debug = false
let answers = 0
let answersList = []
let answersEmojiForPastes = []

const realRisks = ["ZAYIN", "TETH", "HE", "WAW", "ALEPH"]
const realColors = ["White", "Black", "Red", "Orange", "Beige", "Brown", "Yellow", "Green", "Cyan", "Turquoise", "Blue", "Purple", "Pink", "Magenta", "Gray"]
const realBehave = ["Aggressive", "Neutral", "Passive"]
const realDamage = ["Mental", "Physical", "Soul", "None"]
const realRanges = ["Melee", "Ranged", "Magic", "Proxy", "None"]

if (localStorage.getItem("animatedBG")) {

    if (localStorage.getItem("animatedBG") == true) {
        backgroundCheckbox.checked = true;
    }
}
else {
    localStorage.setItem("animatedBG", true);
    backgroundCheckbox.checked = true;
}

setBGAnimation();

if (localStorage.getItem(formatedDate) != null && false) {
    console.log("dateExists")
    console.log(localStorage.getItem(formatedDate))
    let answerString = localStorage.getItem(formatedDate)
    let previousAnswers = []
    while (answerString.includes(",")) {
        previousAnswers.push(
            answerString.substring(0, answerString.indexOf(","))
        )
        answerString = answerString.substring(answerString.indexOf(",")+1)
    }
    previousAnswers.push(answerString)
    console.log(previousAnswers)
    previousAnswers.forEach(answer => {
        inputText.value = answer
        verifyWrittenAnswer()
    })


}
else {
    console.log("there is no date")
}


//--------------------------------------- MISC FUNCTIONS ---------------------------------------

function toggleBackground() {
    
    const newValue = backgroundCheckbox.checked;
    localStorage.setItem("animatedBG", newValue);
    setBGAnimation();
}

function setBGAnimation() {
    if (localStorage.getItem("animatedBG") == 'true') {
        background.classList.add("animatedBG");
        backgroundCheckbox.checked = true;
        return;
    }
    background.classList.remove("animatedBG");
}

function setGameUp() {
    hideAnswerOptions();
    createOptions();
    setAttemptCounter();
    document.getElementById("postWinStatusTitle").innerHTML = `Today's abnormality was <img src="imgs/portraits/Nothing_There.png"> ${correctAnswer.name}`
    writeTutorial();

    /*
    let dates = []
    for (j = 2025; j < 2030; j++) {
        for (i = 0; i < 12; i++) {
            for (m = 1; m < 32; m++) {
                let newDate = new Date();
                newDate.setDate(i)
                newDate.setMonth(i, m)
                newDate.setFullYear(j)
                dates.push(newDate)
            }
        }
    }
    let seeds = []
    dates.forEach(date => {
        generateSeedTroughDay(date);
    })
    */
    
}

function getFormatedDate(date) {
    return (`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`)
}

function getTimeTillTomorrow() {
    let today = new Date()
    const hoursLeft = 24 - today.getHours()
    const minsLeft = 59 - today.getMinutes()
    const secsLeft = 59 - today.getSeconds()

    return `${hoursLeft}:${minsLeft}:${secsLeft}`
}

function updateTimer() {;
    timeDisplay.innerHTML = getTimeTillTomorrow();
    setTimeout(() => { updateTimer(); }, 1000);

}

function toggleTutorial(isShowing) {
    tutorialModal.classList = ""

    if (isShowing) {
        tutorialModal.classList.add("tutorialOpen")
    }
    else {
        tutorialModal.classList.add("tutorialClosed")
    }

}

function writeTutorial() {

    const riskLevelsTitle = document.createElement("p");
    riskLevelsTitle.innerHTML = "All risk levels options:";
    tutorialText.appendChild(riskLevelsTitle);
    tutorialText.appendChild(createDivWithArrayDisplay(realRisks));

    const colorTitle = document.createElement("p");
    colorTitle.innerHTML = "All color options:";
    tutorialText.appendChild(colorTitle);
    const colorTutorialDiv = document.createElement("div");
    colorTutorialDiv.id = "tutorialTextColors"
    realColors.forEach(color => {
        let newColorBlob = document.createElement("div");
        newColorBlob.classList.add("colorBlob");
        newColorBlob.classList.add(`bg${color}`);
        colorTutorialDiv.append(newColorBlob);
    });
    tutorialText.appendChild(colorTutorialDiv);

    const behaveTitle = document.createElement("p");
    behaveTitle.innerHTML = "All behaviour options:";
    tutorialText.appendChild(behaveTitle);
    tutorialText.appendChild(createDivWithArrayDisplay(realBehave));

    const damageTitle = document.createElement("p");
    damageTitle.innerHTML = "All damage type options:";
    tutorialText.appendChild(damageTitle);
    tutorialText.appendChild(createDivWithArrayDisplay(realDamage));

    const rangesTitle = document.createElement("p");
    rangesTitle.innerHTML = "All attack method options:";
    tutorialText.appendChild(rangesTitle);
    tutorialText.appendChild(createDivWithArrayDisplay(realRanges));
}

function createDivWithArrayDisplay(dataArray) {
    const myDiv = document.createElement("div")
    dataArray.forEach(item => {
        let newItem = document.createElement("div");
        newItem.innerHTML = item;
        myDiv.appendChild(newItem);
    })
    return myDiv

}



//--------------------------------------- GAME FUNCTIONS ---------------------------------------

function generateSeedTroughDay(targetDay) {
    let today = targetDay;
    let day = today.getDate();
    let month = today.getMonth() + 7;
    let year = today.getFullYear();

    if (month == 17) { month += 2 }


    let finalNumber = (day * month) + month + year
    let yearString = year.toString()
    let yearFinalDigitsModif = Math.pow(parseInt(yearString[2]), parseInt(yearString[3]))
    finalNumber += yearFinalDigitsModif

    if (day == 26) { finalNumber += 12 }
    if (day == 27) { finalNumber += 17 }

    while (finalNumber > abnos.length) {
        finalNumber -= abnos.length
    }

    if (finalNumber == abnos.length) {
        finalNumber = 0
    }

    const seed = finalNumber;
    console.log(`${ day } ${ month } ${ year } | ${abnos[seed].name}`)

    return (seed);


    /* 
    ---------------------------------------- OLD COLD OF BETA ALGORITH -----------------------------------
    let firstNumber = Math.pow(day+1, month+2)
    firstNumber += month * (year - (month+4 * day) + 12);

    let strDayArray = [day.toString(), month.toString(), year.toString()]
    let stringletiant = 0

    for (let currentDateParam = 0; currentDateParam < strDayArray.length; currentDateParam++) {
        for (let newValue = 0; newValue < currentDateParam.length; newValue++) {
            stringletiant = stringletiant + parseInt(newValue)
        }
    }

    firstNumber += stringletiant

    let finalString = firstNumber.toString()
    let strFinalValue = []
    let finalNumber = 0


    for (let algarism = 0; algarism < finalString.length; algarism++) {
        strFinalValue.push(finalString[algarism])
        
    }

    while (strFinalValue.length > 2) {
        finalNumber += parseInt(strFinalValue[strFinalValue.length - 1]) * parseInt(strFinalValue[strFinalValue.length -2]);
        strFinalValue.pop();
        strFinalValue.pop();
    }
    if (strFinalValue.length == 1) {
        finalNumber += parseInt(strFinalValue[0])
    }

    finalNumber *= 7 - month

    if (Math.sign(finalNumber) == -1) {
        finalNumber *= -1
    }



    while (finalNumber > abnos.length) {
        finalNumber -= abnos.length
    } 

    if (finalNumber == abnos.length) {
        finalNumber = 0
    }

    */
}

function generateSeedRanomly() {

}

function showAnswerAttempt(object) {    
    object.classList.add("showing")

    if (answers >= maxAnswers) {
        return;
    }
}

function showAnswerOptions() {
    optionsList.classList.remove("optionsHidden")
}

function hideAnswerOptions() {
    optionsList.classList.add("optionsHidden");
}

function filterOptions() {
    const list = document.getElementsByClassName("optionsListItem")

    if (inputText.value == "") {
        for (let listItem = 0; listItem < list.length; listItem++) {
            list[listItem].classList.remove("optionsListItemHidden");
        }
        return
    }

    const formatedAnswer = inputText.value.toLowerCase()

    for (let listItem = 0; listItem < list.length; listItem++) {
        let name = list[listItem].innerText
        name = name.toLowerCase();
        if (name.includes(formatedAnswer)) {
            list[listItem].classList.remove("optionsListItemHidden");
        }
        else {
            list[listItem].classList.add("optionsListItemHidden");
        }
    }
}




function hideAnswerOptionsDelayed() {
    if (optionsList.matches("hover")) {
        setTimeout( () => { hideAnswerOptions(); }, 250);
        return;
    }
    hideAnswerOptions()
}


function selectOption(option) {
    mistakePopup.classList.remove("mistakePopupShow");

    let chosenAbno = {}

    for (let i = 0; i < abnos.length; i++) {
        if (abnos[i].name == option) {
            chosenAbno = abnos[i] 
            break;
        }
    }

    let optionButtons = document.getElementsByClassName("optionsListItem")

    for (let i = 0; i < optionButtons.length; i++) {
        if (optionButtons[i].innerText == option) {
            optionButtons[i].remove() 
            break;
        }
    }

    addAnswerAttempt(chosenAbno);
}

function verifyWrittenAnswer() {
    mistakePopup.classList.remove("mistakePopupShow");
    let canContinue = false; 
    const answer = inputText.value.toLowerCase()
    let chosenAbno = {}

    if (answersList.includes(answer)){
        setTimeout(() => {
            inputText.classList.add("mistakeShake");
            mistakePopup.classList.add("mistakePopupShow");
            mistakeTextDisplay.innerText = "Abnormality was already used in a guess."
        },
            10);
        return;
    }
    
    for (let i = 0; i < abnos.length; i++) {
        if (abnos[i].name.toLowerCase() == answer) {
            canContinue = true;
            chosenAbno = abnos[i] 
            break;
        }
    }    

    if (canContinue) {
        addAnswerAttempt(chosenAbno);
        return;
    }

    mistakeTextDisplay.innerText = "Invalid abnormality name."
    setTimeout(() => {
        inputText.classList.add("mistakeShake");
        mistakePopup.classList.add("mistakePopupShow");
    },
        10);

}

function createAllAnswerAttempts() {
    debug = true
    let tempNameArray = [];
    for (let i = 0; i < abnos.length; i++) {
        tempNameArray.push(abnos[i].name);
    }
    tempNameArray.sort();
    for (let i = 0; i < abnos.length; i++) {
        addAnswerAttempt(abnos[i])
    }
} 

function createOptions() {
    console.log("called")
    let tempNameArray = [];
    for (let i = 0; i < abnos.length; i++) {
        tempNameArray.push(abnos[i].name);
    }
    tempNameArray.sort();
    //console.log(tempNameArray);
    for (let i = 0; i < abnos.length; i++) {
        let item = document.createElement("li");
        let img = document.createElement("img");
        img.src = `imgs/portraits/${getCleanPortaitPath(tempNameArray[i])}.png`;
        let text =  document.createElement("p");
        text.innerHTML = tempNameArray[i];

        item.classList.add("optionsListItem");
        item.appendChild(img);
        item.appendChild(text);

        optionsList.appendChild(item);
        item.addEventListener('mousedown', () => { selectOption(tempNameArray[i]); }, false); 
    }
} 

function addAnswerAttempt(abno) {

    if (!debug) {
        inputText.classList.remove("mistakeShake");
        inputText.value = "";
    }
    


    if (debug == false) {
        answers++;
        setAttemptCounter();
    }
    if (answers >= maxAnswers) {
        gameEndedOnWin(false);
    }

    const currentDivId = `answer${answers}`;
    const currentDiv = document.createElement("div");

    let newEmojiEntry = []
    // 129001 == green
    // 129000 == yellow
    // 128997 == red

    currentDiv.classList.add("answerDiv");
    currentDiv.id = currentDivId
    answerHolder.appendChild(currentDiv)

    //------------------------------------------------------------------

    let div1 = document.createElement("div"); //name
    div1.classList.add("answerDivProperty");
    div1.classList.add("answerDivPropertyShow");

    let portrait = document.createElement("img");
    div1.innerHTML = `<div class=\"abnoName\">${abno.name}</div>`;
    let portraitName = getCleanPortaitPath(abno.name)
    portrait.src = `imgs/portraits/${portraitName}.png`;
    div1.appendChild(portrait);
    
    

    //------------------------------------------------------------------

    let div2 = document.createElement("div"); //danger
    div2.innerText = "Risk Level";
    div2.classList.add("answerDivProperty");

    let riskLevelDiv = document.createElement("div");
    riskLevelDiv.innerHTML = abno.danger;

    if (abno.danger == correctAnswer.danger) {
        riskLevelDiv.classList.add("goodAnswer");
        newEmojiEntry.push("&#129001")
    }
    else {
        riskLevelDiv.classList.add("badAnswer");
        newEmojiEntry.push("&#128997")
    }

    div2.appendChild(riskLevelDiv);

    //------------------------------------------------------------------

    let div3 = document.createElement("div"); //colors
    div3.innerText = "Colors";
    div3.classList.add("answerDivProperty");

    let colorDiv = document.createElement("div");
    colorDiv.classList.add("colorBlobDiv")
    if (abno.colors.length > 9) {
        colorDiv.classList.add("noColGap")
    }
    abno.colors = abno.colors.sort()
    abno.colors.forEach(color => {
        let newColorBlob = document.createElement("div");
        newColorBlob.classList.add("colorBlob");
        newColorBlob.classList.add(`bg${color}`);
        colorDiv.append(newColorBlob);
    });

    //colorDiv.innerHTML = correctCommas(abno.colors.toString());
    verifyArrayAnswer(abno.colors, correctAnswer.colors, colorDiv, newEmojiEntry);



    div3.appendChild(colorDiv);

    //------------------------------------------------------------------

    let div4 = document.createElement("div"); //behaviour
    div4.innerText = "Behaviour";
    div4.classList.add("answerDivProperty");

    let behaveDiv = document.createElement("div");
    behaveDiv.innerHTML = abno.behaviour

    if (abno.behaviour == correctAnswer.behaviour) {
        behaveDiv.classList.add("goodAnswer");
        newEmojiEntry.push("&#129001")
    }
    else {
        behaveDiv.classList.add("badAnswer");
        newEmojiEntry.push("&#128997")
    }

    div4.appendChild(behaveDiv);

    //------------------------------------------------------------------

    let div5 = document.createElement("div"); //damage
    div5.innerText = "Damage Type";
    div5.classList.add("answerDivProperty");

    let damageDiv = document.createElement("div");
    damageDiv.innerHTML = correctCommas(abno.damage.toString());
    verifyArrayAnswer(abno.damage, correctAnswer.damage, damageDiv, newEmojiEntry);

    div5.appendChild(damageDiv);

    //------------------------------------------------------------------

    let div6 = document.createElement("div"); //range 
    
    div6.innerText = "Attack Method";
    div6.classList.add("answerDivProperty");

    let rangeDiv = document.createElement("div");
    rangeDiv.innerHTML = correctCommas(abno.range.toString());
    verifyArrayAnswer(abno.range, correctAnswer.range, rangeDiv, newEmojiEntry);
    
    div6.appendChild(rangeDiv);
    

    currentDiv.appendChild(div1);
    currentDiv.appendChild(div2);
    currentDiv.appendChild(div3);
    currentDiv.appendChild(div4);
    currentDiv.appendChild(div5);
    currentDiv.appendChild(div6);

    setTimeout( () => { div2.classList.add("answerDivPropertyShow")}, 300);
    setTimeout( () => { div3.classList.add("answerDivPropertyShow")}, 600);
    setTimeout( () => { div4.classList.add("answerDivPropertyShow")}, 900);
    setTimeout( () => { div5.classList.add("answerDivPropertyShow")}, 1200);
    setTimeout( () => { div6.classList.add("answerDivPropertyShow")}, 1500);


    answersList.push(abno.name.toLowerCase());
    localStorage.setItem(formatedDate, answersList)
    showAnswerAttempt(currentDiv);
    if (abno == correctAnswer && debug == false) {
        newEmojiEntry.unshift("&#129001")
        answersEmojiForPastes.push(newEmojiEntry)
        gameEndedOnWin(true);
    }
    else {
        newEmojiEntry.unshift("&#128997")
        answersEmojiForPastes.push(newEmojiEntry)
    }

    

    if (debug) {
        checkForTyposInEntries(abno, riskLevelDiv, colorDiv, behaveDiv, damageDiv, rangeDiv);
    }
}

function checkForTyposInEntries(abno, riskDiv, colorDiv, behaviourDiv, damageDiv, rangeDiv) {
    riskDiv.classList.remove("goodAnswer", "midAnswer", "badAnswer")
    colorDiv.classList.remove("goodAnswer", "midAnswer", "badAnswer")
    behaviourDiv.classList.remove("goodAnswer", "midAnswer", "badAnswer")
    damageDiv.classList.remove("goodAnswer", "midAnswer", "badAnswer")
    rangeDiv.classList.remove("goodAnswer", "midAnswer", "badAnswer")

    if (realRisks.includes(riskDiv.innerHTML)) {
        riskDiv.classList.add("goodAnswer")
    }
    else {
        riskDiv.classList.add("badAnswer")
    }

    debugVerifyArrayAnswer(abno.colors, realColors, colorDiv);

    if (realBehave.includes(behaviourDiv.innerHTML)) {
        behaviourDiv.classList.add("goodAnswer")
    }
    else {
        behaviourDiv.classList.add("badAnswer")
    }

    debugVerifyArrayAnswer(abno.damage, realDamage, damageDiv);
    debugVerifyArrayAnswer(abno.range, realRanges, rangeDiv);

}

function correctCommas(text) {
    let finalText = text
    finalText = finalText.replaceAll(",", ", ")
    return finalText
}

function verifyArrayAnswer(selectedAnswerArray, correctAnswerArray, displayDiv, emojiList) {
    let matchingTypes = 0;
    for (let pick = 0; pick < selectedAnswerArray.length; pick++) {
        if (correctAnswerArray.includes(selectedAnswerArray[pick])) {
            matchingTypes++;
        }
    }
    
    if (matchingTypes == correctAnswerArray.length && selectedAnswerArray.length == correctAnswerArray.length) {
        displayDiv.classList.add("goodAnswer");
        emojiList.push("&#129001");
    }
    else if (matchingTypes > 0) {
        displayDiv.classList.add("midAnswer");
        emojiList.push("&#129000");
    }
    else {
        displayDiv.classList.add("badAnswer");
        emojiList.push("&#128997");
    }
}

function debugVerifyArrayAnswer(selectedAnswerArray, validAnswersArray, displayDiv) {
    let matchingTypes = 0;
    for (let pick = 0; pick < selectedAnswerArray.length; pick++) {
        if (!validAnswersArray.includes(selectedAnswerArray[pick])) {
            displayDiv.classList.add("badAnswer");
            return;
        }
    }
    displayDiv.classList.add("goodAnswer");
}

function gameEndedOnWin(isVictory) {
    
    inputText.disabled = true
    inputButton.disabled = true;
    let holder = document.getElementById("answerIndicator");
    let text = document.getElementById("answerIndicatorText");
    holder.classList.add("victoryTextSize");
    if (isVictory) {
        text.innerText = "You Win!";
        setVictoryEmote(document.getElementsByClassName("winEmote")[0]);
        setVictoryEmote(document.getElementsByClassName("winEmote")[1]);
    }
    else {
        text.innerText = "You Lose!";
        background.classList.add("trueBackgroundLost")
    }
    document.getElementsByClassName("winEmote")[0].classList.add("winEmoteShow");
    document.getElementsByClassName("winEmote")[1].classList.add("winEmoteShow");


    document.getElementById("emojiPasteDiv").innerHTML = getDailyResult()
    postWinDiv.classList.add("postWinStatusShow")
    document.getElementById("inputHolder").classList.remove("inputHolderActive")

    window.scrollTo(0, 0);
    updateTimer();


}

function setVictoryEmote(emote) {
    let index = Math.random();
    if (index == 1) { index = 0; }
    emote.setAttribute("src", winEmoteList[Math.floor(index * winEmoteList.length)]);
}

function setAttemptCounter() {
    attemptCounter.innerHTML = `${answers}/${maxAnswers}`;
}

function getDailyResult() {
    
    let myDate = `${writtenMonths[unformatedDate.getMonth()]} ${unformatedDate.getDay()}, ${unformatedDate.getFullYear()}`

    let finalEmojiString = `Abnordle - ${myDate} <br><br>`
    answersEmojiForPastes.forEach(answer => {
        for (i = 0; i < answer.length; i++) {
            finalEmojiString += `${answer[i]}`
        }
        finalEmojiString += "<br>"
    })

    return finalEmojiString
}

function copyResultClick() {
    const value = document.URL + "\n" + document.getElementById("emojiPasteDiv").innerText
    navigator.clipboard.writeText(value)
}

function getCleanPortaitPath(baseAbnoName) {
    let finalName = baseAbnoName
    finalName = finalName.replaceAll(' ', "_")
    finalName = finalName.replaceAll('-', "_")
    finalName = finalName.replaceAll('\'', "")
    return finalName
}