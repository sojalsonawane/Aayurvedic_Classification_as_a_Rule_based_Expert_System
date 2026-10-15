/* ========================================
   1. DARK / LIGHT MODE
======================================== */

const modeButton = document.querySelector("#mode");

modeButton.addEventListener("click", function () {

    document.body.classList.toggle("night");

    const isDarkMode = document.body.classList.contains("night");

    modeButton.textContent = isDarkMode ? "☀️" : "🌙";

    modeButton.setAttribute(
        "aria-label",
        isDarkMode ? "Switch to light mode" : "Switch to dark mode"
    );

});


/* ========================================
   2. KNOWLEDGE BASE
   Predefined IF-THEN Rules
======================================== */

const rules = [

    // VATA RULES

    {
        symptom: "Dry Skin",
        dosha: "Vata",
        weight: 2
    },

    {
        symptom: "Cold Hands/Feet",
        dosha: "Vata",
        weight: 2
    },

    {
        symptom: "Constipation",
        dosha: "Vata",
        weight: 2
    },

    {
        symptom: "Bloating",
        dosha: "Vata",
        weight: 1
    },

    {
        symptom: "Anxiety",
        dosha: "Vata",
        weight: 1
    },

    {
        symptom: "Insomnia",
        dosha: "Vata",
        weight: 1
    },


    // PITTA RULES

    {
        symptom: "Acidity",
        dosha: "Pitta",
        weight: 2
    },

    {
        symptom: "Irritability",
        dosha: "Pitta",
        weight: 2
    },

    {
        symptom: "Inflammation",
        dosha: "Pitta",
        weight: 1
    },

    {
        symptom: "Sweating",
        dosha: "Pitta",
        weight: 1
    },


    // KAPHA RULES

    {
        symptom: "Oily Skin",
        dosha: "Kapha",
        weight: 2
    },

    {
        symptom: "Weight Gain",
        dosha: "Kapha",
        weight: 2
    },

    {
        symptom: "Lethargy",
        dosha: "Kapha",
        weight: 1
    },

    {
        symptom: "Water Retention",
        dosha: "Kapha",
        weight: 1
    }

];


/* ========================================
   3. GET HTML ELEMENTS
======================================== */

const symptomButtons = document.querySelectorAll(".symptom-button");

const selectedCount = document.querySelector("#selected-count");

const analyzeButton = document.querySelector("#analyze-button");

const clearButton = document.querySelector("#clear-button");

const selectionMessage = document.querySelector("#selection-message");

const resultSection = document.querySelector("#result-section");

const resultTitle = document.querySelector("#result-title");

const resultDescription = document.querySelector("#result-description");

const ruleBreakdown = document.querySelector("#rule-breakdown");


/* ========================================
   4. SELECTED SYMPTOMS
======================================== */

const selectedSymptoms = new Set();


/* ========================================
   5. UPDATE SELECTED SYMPTOM COUNT
======================================== */

function updateSelectedCount() {

    const count = selectedSymptoms.size;

    selectedCount.textContent =
        `${count} ${count === 1 ? "symptom" : "symptoms"} selected`;

}


/* ========================================
   6. SELECT / DESELECT SYMPTOMS
======================================== */

symptomButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const symptom = button.dataset.symptom;

        if (selectedSymptoms.has(symptom)) {

            selectedSymptoms.delete(symptom);

            button.classList.remove("active");

            button.setAttribute("aria-pressed", "false");

        } else {

            selectedSymptoms.add(symptom);

            button.classList.add("active");

            button.setAttribute("aria-pressed", "true");

        }

        updateSelectedCount();

        selectionMessage.textContent = "";

        /*
         * Hide the old result when symptoms change.
         * The user can analyze the new selection again.
         */

        resultSection.hidden = true;

    });

    button.setAttribute("aria-pressed", "false");

});


/* ========================================
   7. CALCULATE DOSHA SCORES
======================================== */

function calculateScores() {

    const scores = {
        Vata: 0,
        Pitta: 0,
        Kapha: 0
    };

    const matchedRules = [];


    /*
     * Check each predefined rule.
     *
     * If its symptom is selected:
     * 1. Add its weight to the related Dosha.
     * 2. Save the matched rule for explanation.
     */

    rules.forEach(function (rule) {

        if (selectedSymptoms.has(rule.symptom)) {

            scores[rule.dosha] += rule.weight;

            matchedRules.push(rule);

        }

    });


    return {
        scores: scores,
        matchedRules: matchedRules
    };

}


/* ========================================
   8. FIND THE HIGHEST SCORE
   Handles equal-score ties correctly
======================================== */

function findHighestDoshas(scores) {

    const highestScore = Math.max(
        scores.Vata,
        scores.Pitta,
        scores.Kapha
    );

    const highestDoshas = Object.keys(scores).filter(
        function (dosha) {
            return scores[dosha] === highestScore;
        }
    );

    return {
        highestScore: highestScore,
        highestDoshas: highestDoshas
    };

}


/* ========================================
   9. DISPLAY SCORE BARS
======================================== */

function displayScores(scores) {

    const totalScore =
        scores.Vata +
        scores.Pitta +
        scores.Kapha;


    const doshas = ["Vata", "Pitta", "Kapha"];


    doshas.forEach(function (dosha) {

        const score = scores[dosha];

        let percentage = 0;

        if (totalScore > 0) {

            percentage = Math.round(
                (score / totalScore) * 100
            );

        }


        /*
         * Display the numerical score.
         */

        document.querySelector(
            `#${dosha.toLowerCase()}-score`
        ).textContent = `${score} ${score === 1 ? "point" : "points"}`;


        /*
         * Display the percentage.
         */

        document.querySelector(
            `#${dosha.toLowerCase()}-percent`
        ).textContent = `${percentage}%`;


        /*
         * Display the progress bar.
         */

        document.querySelector(
            `#${dosha.toLowerCase()}-bar`
        ).style.width = `${percentage}%`;

    });

}


/* ========================================
   10. EXPLAIN THE MATCHED RULES
======================================== */

function displayRuleExplanation(matchedRules, scores) {

    /*
     * Remove old explanations.
     */

    ruleBreakdown.replaceChildren();


    /*
     * Display every matched rule.
     */

    matchedRules.forEach(function (rule) {

        const ruleCard = document.createElement("div");

        ruleCard.className = "rule-result";


        const ruleInformation = document.createElement("div");


        const ruleTitle = document.createElement("strong");

        ruleTitle.textContent = rule.symptom;


        const ruleDescription = document.createElement("p");

        ruleDescription.textContent =
            `IF ${rule.symptom} is selected, THEN ${rule.dosha} receives ${rule.weight} ${
                rule.weight === 1 ? "point" : "points"
            }.`;

        ruleInformation.appendChild(ruleTitle);

        ruleInformation.appendChild(ruleDescription);


        const rulePoints = document.createElement("span");

        rulePoints.className = "rule-points";

        rulePoints.textContent = `+${rule.weight}`;


        ruleCard.appendChild(ruleInformation);

        ruleCard.appendChild(rulePoints);


        ruleBreakdown.appendChild(ruleCard);

    });


    /*
     * Add the final score summary.
     */

    const summary = document.createElement("p");

    summary.className = "rule-summary";

    summary.textContent =
        `Final Scores — Vata: ${scores.Vata}, ` +
        `Pitta: ${scores.Pitta}, ` +
        `Kapha: ${scores.Kapha}`;


    ruleBreakdown.appendChild(summary);

}


/* ========================================
   11. DISPLAY CLASSIFICATION RESULT
======================================== */

function displayResult(scores, matchedRules) {

    const result = findHighestDoshas(scores);

    const highestScore = result.highestScore;

    const highestDoshas = result.highestDoshas;


    /*
     * Display score bars and percentages.
     */

    displayScores(scores);


    /*
     * Display the matched rules and their weights.
     */

    displayRuleExplanation(matchedRules, scores);


    /*
     * HANDLE TIES
     *
     * If two or three Doshas have the same highest score,
     * display all tied Doshas instead of selecting one
     * arbitrarily.
     */

    if (highestDoshas.length > 1) {

        const tiedDoshas = highestDoshas.join(" and ");

        resultTitle.textContent = "Equal Score: Tie Result";

        resultDescription.textContent =
            `${tiedDoshas} have the same highest score of ` +
            `${highestScore} points. The system does not select ` +
            `one Dosha over the other because their scores are equal.`;

    } else {

        const dominantDosha = highestDoshas[0];

        resultTitle.textContent =
            `Highest Rule-Based Score: ${dominantDosha}`;


        resultDescription.textContent =
            `${dominantDosha} has the highest score of ` +
            `${highestScore} points based on the selected symptoms ` +
            `and the predefined rules.`;

    }


    /*
     * Show the result section.
     */

    resultSection.hidden = false;

}


/* ========================================
   12. ANALYZE BUTTON
======================================== */

analyzeButton.addEventListener("click", function () {

    /*
     * Validate the selection.
     */

    if (selectedSymptoms.size === 0) {

        resultSection.hidden = true;

        selectionMessage.textContent =
            "Please select at least one symptom before analyzing.";

        return;

    }


    selectionMessage.textContent =
        "Analysis completed using the predefined rules.";


    /*
     * Calculate scores from the knowledge base.
     */

    const result = calculateScores();


    /*
     * Display the final result.
     */

    displayResult(
        result.scores,
        result.matchedRules
    );

});


/* ========================================
   13. CLEAR SELECTION BUTTON
======================================== */

clearButton.addEventListener("click", function () {

    /*
     * Remove all selected symptoms.
     */

    selectedSymptoms.clear();


    /*
     * Remove active styling from all buttons.
     */

    symptomButtons.forEach(function (button) {

        button.classList.remove("active");

        button.setAttribute("aria-pressed", "false");

    });


    /*
     * Update the selected symptom count.
     */

    updateSelectedCount();


    /*
     * Hide old results and messages.
     */

    resultSection.hidden = true;

    selectionMessage.textContent =
        "All selected symptoms have been cleared.";


    /*
     * Reset all scores, percentages and progress bars.
     */

    const doshas = ["Vata", "Pitta", "Kapha"];

    doshas.forEach(function (dosha) {

        document.querySelector(
            `#${dosha.toLowerCase()}-score`
        ).textContent = "0 points";

        document.querySelector(
            `#${dosha.toLowerCase()}-percent`
        ).textContent = "0%";

        document.querySelector(
            `#${dosha.toLowerCase()}-bar`
        ).style.width = "0%";

    });


    /*
     * Remove the previous rule explanation.
     */

    ruleBreakdown.replaceChildren();

});


/* ========================================
   14. QUIZ QUESTIONS
======================================== */

const quizQuestions = [

    {
        question: "1. How many main Doshas are described in this project?",

        options: [
            "Two",
            "Three",
            "Four",
            "Five"
        ],

        answer: 1,

        explanation:
            "The three Doshas are Vata, Pitta, and Kapha."
    },


    {
        question: "2. Which Dosha is traditionally associated with Air and Space?",

        options: [
            "Kapha",
            "Pitta",
            "Vata",
            "None of these"
        ],

        answer: 2,

        explanation:
            "Vata is traditionally associated with Air and Space."
    },


    {
        question: "3. What happens when a selected symptom matches a rule?",

        options: [
            "The system stops",
            "The related Dosha receives points",
            "The website closes",
            "All scores become zero"
        ],

        answer: 1,

        explanation:
            "The rule adds its predefined weight to the related Dosha score."
    },


    {
        question: "4. Which symptom adds two points to Pitta in this project?",

        options: [
            "Dry Skin",
            "Oily Skin",
            "Acidity",
            "Lethargy"
        ],

        answer: 2,

        explanation:
            "The predefined rule for Acidity adds two points to Pitta."
    },


    {
        question: "5. What should the system do if two Doshas have equal highest scores?",

        options: [
            "Always select Vata",
            "Always select Kapha",
            "Display a tie result",
            "Delete all scores"
        ],

        answer: 2,

        explanation:
            "The updated system displays a tie when multiple Doshas share the highest score."
    }

];


/* ========================================
   15. QUIZ ELEMENTS
======================================== */

const quizProgress = document.querySelector("#quiz-progress");

const quizScoreLabel = document.querySelector("#quiz-score-label");

const quizProgressBar = document.querySelector("#quiz-progress-bar");

const quizQuestion = document.querySelector("#quiz-question");

const quizOptions = document.querySelector("#quiz-options");

const quizFeedback = document.querySelector("#quiz-feedback");

const nextQuestionButton = document.querySelector("#next-question");

const restartQuizButton = document.querySelector("#restart-quiz");


/* ========================================
   16. QUIZ VARIABLES
======================================== */

let currentQuestionIndex = 0;

let quizScore = 0;

let questionAnswered = false;


/* ========================================
   17. LOAD QUIZ QUESTION
======================================== */

function loadQuizQuestion() {

    /*
     * If all questions have been answered,
     * display the final result.
     */

    if (currentQuestionIndex >= quizQuestions.length) {

        showQuizResult();

        return;

    }


    const currentQuestion =
        quizQuestions[currentQuestionIndex];


    questionAnswered = false;


    /*
     * Update progress and question.
     */

    quizProgress.textContent =
        `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;

    quizScoreLabel.textContent =
        `Score: ${quizScore}`;

    quizProgressBar.style.width =
        `${(currentQuestionIndex / quizQuestions.length) * 100}%`;

    quizQuestion.textContent =
        currentQuestion.question;


    /*
     * Clear the old answer options.
     */

    quizOptions.replaceChildren();

    quizFeedback.textContent = "";

    quizFeedback.style.color = "";


    /*
     * Hide restart and enable the next button only
     * after the user selects an answer.
     */

    nextQuestionButton.disabled = true;

    nextQuestionButton.hidden = false;

    restartQuizButton.hidden = true;

    nextQuestionButton.textContent =
        currentQuestionIndex === quizQuestions.length - 1
            ? "View Final Score →"
            : "Next Question →";


    /*
     * Create answer buttons.
     */

    currentQuestion.options.forEach(function (option, index) {

        const optionButton = document.createElement("button");

        optionButton.type = "button";

        optionButton.className = "quiz-option";

        optionButton.textContent = option;


        optionButton.addEventListener("click", function () {

            selectQuizAnswer(index);

        });


        quizOptions.appendChild(optionButton);

    });

}


/* ========================================
   18. CHECK QUIZ ANSWER
======================================== */

function selectQuizAnswer(selectedAnswer) {

    /*
     * Prevent the user from answering
     * the same question multiple times.
     */

    if (questionAnswered) {
        return;
    }


    questionAnswered = true;


    const currentQuestion =
        quizQuestions[currentQuestionIndex];


    const optionButtons =
        quizOptions.querySelectorAll(".quiz-option");


    /*
     * Disable all options after the answer.
     */

    optionButtons.forEach(function (button) {

        button.disabled = true;

    });


    /*
     * Highlight the correct answer.
     */

    optionButtons[currentQuestion.answer]
        .classList.add("correct");


    /*
     * Check the selected answer.
     */

    if (selectedAnswer === currentQuestion.answer) {

        quizScore++;

        quizFeedback.textContent =
            `Correct! ${currentQuestion.explanation}`;

        quizFeedback.style.color = "#4b9560";

    } else {

        optionButtons[selectedAnswer]
            .classList.add("incorrect");

        quizFeedback.textContent =
            `Incorrect. ${currentQuestion.explanation}`;

        quizFeedback.style.color = "#c45e50";

    }


    /*
     * Update the score and enable next.
     */

    quizScoreLabel.textContent =
        `Score: ${quizScore}`;

    nextQuestionButton.disabled = false;

}


/* ========================================
   19. NEXT QUESTION BUTTON
======================================== */

nextQuestionButton.addEventListener("click", function () {

    if (!questionAnswered) {
        return;
    }


    currentQuestionIndex++;

    loadQuizQuestion();

});


/* ========================================
   20. DISPLAY FINAL QUIZ RESULT
======================================== */

function showQuizResult() {

    quizProgress.textContent = "Quiz Completed";

    quizScoreLabel.textContent =
        `Final Score: ${quizScore}/${quizQuestions.length}`;

    quizProgressBar.style.width = "100%";


    quizQuestion.textContent =
        "You have completed the Tridosha Knowledge Quiz!";


    quizOptions.replaceChildren();


    if (quizScore === quizQuestions.length) {

        quizFeedback.textContent =
            `Excellent! You scored ${quizScore} out of ${quizQuestions.length}.`;

    } else if (quizScore >= 3) {

        quizFeedback.textContent =
            `Good work! You scored ${quizScore} out of ${quizQuestions.length}.`;

    } else {

        quizFeedback.textContent =
            `You scored ${quizScore} out of ${quizQuestions.length}. Review the Rules section and try again.`;

    }


    quizFeedback.style.color = "";


    nextQuestionButton.hidden = true;

    restartQuizButton.hidden = false;

}


/* ========================================
   21. RESTART QUIZ
======================================== */

restartQuizButton.addEventListener("click", function () {

    currentQuestionIndex = 0;

    quizScore = 0;

    questionAnswered = false;

    loadQuizQuestion();

});


/* ========================================
   22. SCROLL REVEAL ANIMATION
======================================== */

const revealElements =
    document.querySelectorAll(".reveal");


if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(

        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12
        }

    );


    revealElements.forEach(function (element) {

        revealObserver.observe(element);

    });

} else {

    /*
     * Fallback for browsers without IntersectionObserver.
     */

    revealElements.forEach(function (element) {

        element.classList.add("visible");

    });

}


/* ========================================
   23. INITIALIZE PAGE
======================================== */

updateSelectedCount();

loadQuizQuestion();