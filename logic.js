document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("questionnaire-form");
    const resultDiv = document.getElementById("result");
    const printButton = document.getElementById("printButton");
    const submitButton = document.getElementById("submitButton")
    const questions = document.querySelectorAll('.question');
    const postText = document.getElementById('PostText');
    console.log("Question Length: ", questions.length)
    let currentQuestionIndex = 0;
/* ########## Code for if page is fully revealed and want scroll to next question.

    function scrollToNextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            questions[currentQuestionIndex].classList.add('question-animate-out');
            currentQuestionIndex++;
            questions[currentQuestionIndex].classList.add('question-animate-in');

            // Scroll to the next question with a smooth transition
            setTimeout(() => {
                questions[currentQuestionIndex].scrollIntoView({ behavior: "smooth" });
            }, 100); // Adjust the delay if needed
        }
    }

    // Attach click event listeners to radio inputs to scroll to the next question
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', scrollToNextQuestion);
    });
 ##############   */

//! N/A Checkbox logic
// Add event listeners to the "Not Available" checkboxes
const notAvailableEmailCheckbox = document.getElementById("notAvailableEmail");
const notAvailablePhoneCheckbox = document.getElementById("notAvailablePhone");

notAvailableEmailCheckbox.addEventListener("change", function () {
    const emailInput = document.getElementById("email");
    if (notAvailableEmailCheckbox.checked) {
        // If "Not Available" is checked, disable the email input and clear its value
        emailInput.disabled = true;
        emailInput.value = "";
    } else {
        // If unchecked, enable the email input
        emailInput.disabled = false;
    }
});

notAvailablePhoneCheckbox.addEventListener("change", function () {
    const phoneInput = document.getElementById("phonenum");
    if (notAvailablePhoneCheckbox.checked) {
        // If "Not Available" is checked, disable the phone input and clear its value
        phoneInput.disabled = true;
        phoneInput.value = "";
    } else {
        // If unchecked, enable the phone input
        phoneInput.disabled = false;
    }
});


//*###########################*//
//! Animation Logic //
 //*###########################*//
// Function to reveal the next question with fade-in/fade-out animation
function revealNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        // Fade out the current question
        questions[currentQuestionIndex].classList.add('fade-out');

        // Delay the animation for a smoother effect
        setTimeout(() => {
            // Hide the current question after fading out
            questions[currentQuestionIndex].classList.remove('fade-out');
            questions[currentQuestionIndex].classList.add('hidden');
            questions[currentQuestionIndex].classList.remove('fade-in');


            // Move to the next question
            currentQuestionIndex++;
            // Reveal the next question with fade-in animation
            questions[currentQuestionIndex].classList.remove('hidden');
            questions[currentQuestionIndex].classList.add('fade-in');

            // Scroll to the next question
            setTimeout(() => {
                questions[currentQuestionIndex].scrollIntoView({ behavior: "smooth" });
            }, 100); // Adjust the delay if needed

            // Update radioInputs to target radio inputs of the current question
            radioInputs = questions[currentQuestionIndex].querySelectorAll('input[type="radio"]');
            // Attach click event listeners to new radio inputs
            radioInputs.forEach(input => {
                input.addEventListener('change', revealNextQuestion);
            });
        }, 300); // Adjust the delay for fade-out if needed
    }
}
function revealAllQuestions() {
    questions.forEach((question) => {
        question.classList.remove('hidden');
        question.classList.add('fade-in');
    });
    postText.style.display = 'block';
    submitButton.style.display = 'block';
    // Scroll to the bottom
    setTimeout(() => {
        const questionnaireSection = document.querySelector(".contents");
        if (questionnaireSection) {
            questionnaireSection.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, 100); // Adjust the delay if needed
}

let questionrevealcount = 0
// Attach click event listeners to radio inputs to reveal the first question
let radioInputs = questions[currentQuestionIndex].querySelectorAll('input[type="radio"]');
radioInputs.forEach(input => {
    input.addEventListener('change', revealNextQuestion);
    questionrevealcount ++;
    console.log("Question #: ", questionrevealcount)
});
// Attach click event listeners to radio inputs to reveal all questions when any radio input in Question 8 is selected
let radioInputsQuestion8 = questions[7].querySelectorAll('input[type="radio"]');
radioInputsQuestion8.forEach(input => {
    input.addEventListener('change', revealAllQuestions);
});

// Initially display the first question
questions[currentQuestionIndex].classList.add('question-animate-in');
// End of question navigation code

//*###########################*//
//!Submit Button Logic
//*###########################*//

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = document.getElementById("fullName").value;

        const notAvailableEmail = notAvailableEmailCheckbox.checked;
        const notAvailablePhone = notAvailablePhoneCheckbox.checked;
    
        if (!notAvailableEmail) {
            const email = document.getElementById("email").value;
            // Validate email format
            if (!isValidEmail(email)) {
                alert("Please enter a valid email address.");
                return; // Prevent form submission if the email format is invalid
            }
        }
    
        if (!notAvailablePhone) {
            const phonenum = document.getElementById("phonenum").value;
            if (phonenum.length > 7 && phonenum.length < 12) {
                alert("Please enter a valid phone number.");
                return;
            }
        }

        // Collect answers and their values
        const answers = [];
        const questions = document.querySelectorAll(".question");
        questions.forEach((question, index) => {
            const selectedAnswer = question.querySelector('input[name="q' + (index + 1) + '"]:checked');
            if (selectedAnswer) {
                answers.push({
                    question: "Question " + (index + 1),
                    answer: selectedAnswer.value,
                    value: parseInt(selectedAnswer.value) || 0,
                });
            }
        });
        console.log("Answers: ",answers)

        // Calculate total score
        let totalScore = 0;
        let consolelogcounter = 0
        answers.forEach(answer => {
            totalScore += answer.value;
            consolelogcounter += 1
            console.log("Question"+consolelogcounter,[answer.value,answer.answer])
        });
        console.log("Total Score:", totalScore)

        // Display total score and show the result div
        const resultHTML = `<h2>Total Risk Assessment Score: ${totalScore}</h2>
                            <h4>Risk Profile:<br> <span id="risk-profile-placeholder">{profile}</span></h4>
                            <p>We have received your submission. Please print this page for your own reference, Thank you!</p>`;
        resultDiv.innerHTML = resultHTML;
        resultDiv.style.display = "block"; // Show the result div
        submitButton.style.display="none";
        printButton.style.display = "block"; //Show Print button

        // Send email with the answers (you'll need to implement this part)
        sendEmail(fullName, answers);

        // You can determine the risk profile based on the total score and set it dynamically
        let riskProfile = "";
        if (totalScore <= 11) {
            riskProfile = "You are a conservative investor. Risk must be very low and you are prepared to accept lower returns to limit the risk to your capital. The negative impact of tax and inflation will not concern you, provided your initial investment is significantly risk free. Your time frame is very short term, less than 3 years. You aim for 100% income and no growth from your portfolio";
        } else if (totalScore >= 12 && totalScore <= 17) {
            riskProfile = "You are a cautious investor seeking better than basic returns, but risk must be low. Typically you would seek to protect the wealth which you have accumulated, you may be prepared to consider less aggressive growth investments. Your time frame is approximately 3 years. You aim for 80% income and 20% growth from your portfolio.";
        } else if (totalScore >= 18 && totalScore <= 23) {
            riskProfile = "You are a defensive seeking better than basic returns from a balanced portfolio. You may be prepared to consider moderate growth investments and a strategy to cope with tax and inflation. Your time frame is 3 to 5 years. You aim for 60% income and 40% growth from your portfolio.";
        } else if (totalScore >= 24 && totalScore <= 29) {
            riskProfile = "You are a prudent investor who wants a balanced portfolio to work towards medium to long term financial goals. You require an investment strategy which will cope with the effects of tax and inflation. Calculated risks will be acceptable to you to achieve greater returns. Your time frame is approximately 5 years. You aim for 40% income and 60% growth from your portfolio.";
        } else if (totalScore >= 30 && totalScore <= 34) {
            riskProfile = "You are an assertive investor, probably earning sufficient income to invest most funds for capital growth. You require a balanced portfolio, but more aggressive investments may be included. Your investment strategy must cope with tax and inflation. While prepared to accept higher volatility, your primary concern is to accumulate assets over the long term. Your time frame is 7 years. You aim for 20% income and 80% growth from your portfolio.";
        } else if (totalScore >= 35) {
            riskProfile = "You are an aggressive investor prepared to compromise portfolio balance to pursue potentially greater long term returns. Your investment choices are diverse, but carry with them a higher level of volatility and risk. Security of capital is secondary to the potential for wealth accumulation. Your time frame is very long term, 10 years or greater. You aim for 100% growth from your portfolio.";
        }
        
        // Update the risk profile placeholder text
        const riskProfilePlaceholder = document.getElementById("risk-profile-placeholder");
        if (riskProfilePlaceholder) {
            riskProfilePlaceholder.textContent = riskProfile;
        }
    });

    // Function to send an email (implement this part)
    function sendEmail(fullName, email, phonenum, answers, riskProfile) {
        // Implement email sending logic here
    }
    // Function to validate email format
    function isValidEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    }
    printButton.addEventListener("click", function () {
        window.print();
    });

    const scrollToTopButton = document.getElementById("scrollToTopButton");
    const scrollToBottomButton = document.getElementById("scrollToBottomButton");

    scrollToTopButton.addEventListener("click", function () {
        // Scroll to the top of the page with a smooth transition
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    scrollToBottomButton.addEventListener("click", function () {
        // Scroll to the bottom of the questionnaire section with a smooth transition
        const questionnaireSection = document.querySelector(".contents");
        if (questionnaireSection) {
            questionnaireSection.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    });
});
