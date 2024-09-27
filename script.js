const steps = document.querySelectorAll(".step-box");

const sectionContainer = document.querySelector(".section-container");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const historyBtn = document.getElementById("history-btn");

const usernameInput = document.getElementById("usename-input");
const passwordInput = document.getElementById("password-input");

let pagesCount = 0;

const questions = [
    {
        question:"What continent is Thailand in?",
        answers:[
            {text:"Africa",correct:false},
            {text:"Asia",correct:true},
            {text:"Europe",correct:false},
            {text:"South America",correct:false},
        ]
    },
    {
        question:"What is the capital city of Thailand?",
        answers:[
            {text:"Bangkok",correct:true},
            {text:"Chiang Mai",correct:false},
            {text:"Phuket",correct:false},
            {text:"Pattaya",correct:false},
        ]
    },
    {
        question:"Which of the following are Thai dishes?",
        answers:[
            {text:"Hamberger",correct:false},
            {text:"Spaghetti",correct:false},
            {text:"Tom Yum Goong",correct:true},
            {text:"Sushi",correct:false},
        ]
    }
    ,{
        question:"Which of the following are traditional Thai festivals?",
        answers:[
            {text:"Christmas",correct:false},
            {text:"Diwali",correct:false},
            {text:"Halloween",correct:false},
            {text:"Songkran",correct:true},
        ]
    }
];

let userData = {
    username:"",
    password:""
};

let answerHistory =[];
let score = 0;

showQuestion();
updatePage();

function showQuestion() {
    questions.forEach((cuurQuestion,i) =>{
        // create question
        const targetQuestion = document.getElementById(`question${i+1}`);
        targetQuestion.innerHTML = cuurQuestion.question;

        //create answer
        const targetSection = document.getElementById(`section-${i + 2}`);          
        cuurQuestion.answers.forEach(e => {
            const btn = document.createElement("button");
            btn.innerHTML = e.text;               
            btn.classList.add(`btn-${i + 1}`);          
            targetSection.appendChild(btn); 
            // define correct answer with custom attribue  
            if (e.correct) {
                btn.dataset.correct = e.correct;
            }
            btn.addEventListener("click",selectAnswer);
        });
    });  
};

function updatePage() {
    updateStepStyle(pagesCount);
    displayChangePageBtn();
    const translateX = -pagesCount * 750;
    sectionContainer.style.transform = `translateX(${translateX}px)`;
};

function nextPage() {
    if (pagesCount === 0){
        updateUserData();
        if (userData.username === "" && userData.password === ""){
            alert("Please input username & password completly first!!");
            return;
        }
        else{
            pagesCount++;
            updatePage();
        }       
    }
    else if(pagesCount === 4){
        if (answerHistory.length < questions.length) {
            alert("Please answer all questions before proceeding!");
            return;
        }
        else{
            pagesCount++;
            updatePage();
        }
    }
    else{
        pagesCount++;
        updatePage();
    }
    
}

function previousPage() {
    if (pagesCount > 0 && pagesCount <= 4){
        pagesCount--;
        updatePage();
    } 
}

function displayChangePageBtn() {
    if (pagesCount === 0) {
        prevBtn.style.visibility = "hidden";
        nextBtn.style.visibility = "visible";
    }
    else if (pagesCount === 5){
        prevBtn.style.visibility = "hidden";
        nextBtn.style.visibility = "hidden";
        calculationScore();
        summaryResult();
    }      
    else{
        prevBtn.style.visibility = "visible";
        nextBtn.style.visibility = "visible";
    }
}

function updateStepStyle(pagesCount){
    steps.forEach((e,i)=>{
        if (i === pagesCount){
            e.classList.add("active-step");
            e.classList.remove("completed-step");
        }
        else if (i < pagesCount){
            e.classList.remove("active-step");
            e.classList.add("completed-step");
        }
        else{
            e.classList.remove("active-step");
            e.classList.remove("completed-step");
        }
    });
}

function updateUserData() {
    userData.username = usernameInput.value;
    userData.password = passwordInput.value; 
}

function selectAnswer(selectedElement) {
    const selectedBtn = selectedElement.target;
    
    Array.from(selectedBtn.parentElement.children).forEach(e =>{
        e.classList.remove("selected");
        e.disabled=false;
    })

    selectedBtn.classList.add("selected");
    selectedBtn.disabled=true;

    const questionText = document.getElementById(`question${pagesCount}`).innerHTML; 
    const isCorrect = selectedBtn.dataset.correct === "true"; 
    const existingAnswer = answerHistory.find(function(answer) {
        return answer.question === questionText;
    });

    if (existingAnswer) {
        existingAnswer.selectedAnswer = selectedBtn.textContent;
        existingAnswer.isCorrect = isCorrect;
    } else {
        answerHistory.push({
            question: questionText,
            selectedAnswer: selectedBtn.textContent,
            isCorrect: isCorrect
        });
    }
}

function calculationScore(){
    console.log(answerHistory);
    score = 0;
    answerHistory.forEach(e => {
        if (e.isCorrect){
            score++;
        }
    })
}

function summaryResult() {
    const resultText = document.getElementById("result-text");
    resultText.innerHTML = "";
    resultText.innerHTML = `Successfully!!!<br>Username: ${userData.username}<br>Your score is ${score} of ${questions.length}.`;
}

function showAnswerHistory() {
    
    const answerHistoryText = document.getElementById("answer-history");   
    answerHistoryText.innerHTML = "";
    answerHistory.forEach((e,i) => {
        const questionObj = questions.find(q => q.question === e.question);
        const correctAnswer = questionObj.answers.find(a => a.correct).text;
        // answerHistoryText.innerHTML += `
        // <br>${e.question} : Your answer is <span>${e.selectedAnswer}</span> / Correct answer is <span>${correctAnswer}</span> / Status = <span>${e.isCorrect}</span>`;
        answerHistoryText.innerHTML += `
        <u>Question${i+1}</u>: ${e.question}<br>
        Your Answer: <span style="font-weight: bold; color: ${e.isCorrect ? 'green' : 'red'};">${e.selectedAnswer}</span><br>
        Correct Answer: ${correctAnswer}<br><br>`
    })

    if (historyBtn.textContent === "Show History"){
        answerHistoryText.style.visibility = "visible";
        historyBtn.textContent = "Hide History";
    }
    else{
        answerHistoryText.style.visibility = "hidden";
        historyBtn.textContent = "Show History";
    }
}

//Add EventListenner
prevBtn.addEventListener("click",previousPage);
nextBtn.addEventListener("click",nextPage);
historyBtn.addEventListener("click",showAnswerHistory);
