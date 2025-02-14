document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startBtn = document.getElementById('start-btn');
    const nextBtn = document.getElementById('next-btn');
    const questionText = document.getElementById('question-text');
    const answersContainer = document.getElementById('answers');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const correctAnswersSpan = document.getElementById('correct-answers');
    const percentageSpan = document.getElementById('percentage');
    const shareBtn = document.getElementById('share-btn');
    const retryBtn = document.getElementById('retry-btn');
    const timerDisplay = document.getElementById('time');
    const studentNameInput = document.getElementById('student-name');
    const nameError = document.getElementById('name-error');

    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    let timeLeft;
    let studentName = '';

    // تحديث إجمالي عدد الأسئلة
    totalQuestionsSpan.textContent = quizQuestions.length;

    function startQuiz() {
        studentName = studentNameInput.value.trim();
        if (!studentName) {
            nameError.classList.remove('hidden');
            return;
        }
        nameError.classList.add('hidden');
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        currentQuestionIndex = 0;
        score = 0;
        showQuestion();
        startTimer();
    }

    function startTimer() {
        timeLeft = 3600; // 60 minutes in seconds
        updateTimerDisplay();
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                showResults();
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function showQuestion() {
        const question = quizQuestions[currentQuestionIndex];
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        questionText.textContent = question.question;
        
        answersContainer.innerHTML = '';
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.classList.add('answer-btn');
            button.textContent = answer;
            button.addEventListener('click', () => selectAnswer(index));
            answersContainer.appendChild(button);
        });
        
        nextBtn.style.display = 'none';
    }

    function selectAnswer(answerIndex) {
        const buttons = answersContainer.getElementsByClassName('answer-btn');
        const question = quizQuestions[currentQuestionIndex];
        
        Array.from(buttons).forEach(button => {
            button.disabled = true;
        });

        if (answerIndex === question.correct) {
            buttons[answerIndex].classList.add('correct');
            score++;
        } else {
            buttons[answerIndex].classList.add('wrong');
            buttons[question.correct].classList.add('correct');
        }

        // إظهار التفسير
        const explanation = document.createElement('div');
        explanation.classList.add('explanation');
        explanation.textContent = question.explanation;
        answersContainer.appendChild(explanation);

        nextBtn.style.display = 'block';
    }

    function showResults() {
        clearInterval(timer);
        quizScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');
        
        const percentage = (score / quizQuestions.length) * 100;
        correctAnswersSpan.textContent = score;
        percentageSpan.textContent = percentage.toFixed(1);

        // إضافة اسم الطالب إلى النتائج
        const studentNameDisplay = document.createElement('h3');
        studentNameDisplay.textContent = `اسم الطالب: ${studentName}`;
        studentNameDisplay.classList.add('student-name-display');
        resultsScreen.insertBefore(studentNameDisplay, resultsScreen.firstChild);

        // إضافة مراجعة الأسئلة
        const reviewContainer = document.createElement('div');
        reviewContainer.classList.add('review-container');
        
        const reviewTitle = document.createElement('h2');
        reviewTitle.textContent = 'مراجعة الأسئلة والإجابات الصحيحة';
        reviewContainer.appendChild(reviewTitle);

        quizQuestions.forEach((q, index) => {
            const questionReview = document.createElement('div');
            questionReview.classList.add('question-review');
            
            const questionNumber = document.createElement('h3');
            questionNumber.textContent = `السؤال ${index + 1}`;
            
            const questionText = document.createElement('p');
            questionText.classList.add('question-text');
            questionText.textContent = q.question;
            
            const correctAnswer = document.createElement('p');
            correctAnswer.classList.add('correct-answer');
            correctAnswer.textContent = `الإجابة الصحيحة: ${q.answers[q.correct]}`;
            
            const explanation = document.createElement('p');
            explanation.classList.add('explanation');
            explanation.textContent = `التفسير: ${q.explanation}`;
            
            questionReview.appendChild(questionNumber);
            questionReview.appendChild(questionText);
            questionReview.appendChild(correctAnswer);
            questionReview.appendChild(explanation);
            reviewContainer.appendChild(questionReview);
        });

        resultsScreen.appendChild(reviewContainer);
    }

    startBtn.addEventListener('click', startQuiz);
    
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            showQuestion();
        } else {
            showResults();
        }
    });

    studentNameInput.addEventListener('input', () => {
        if (nameError.classList.contains('hidden') === false) {
            nameError.classList.add('hidden');
        }
    });

    retryBtn.addEventListener('click', () => {
        resultsScreen.classList.add('hidden');
        startQuiz();
    });

    shareBtn.addEventListener('click', () => {
        const shareText = `الطالب ${studentName} حصل على ${score} من ${quizQuestions.length} في اختبار العلوم للصف السادس!`;
        if (navigator.share) {
            navigator.share({
                title: 'نتيجة اختبار العلوم',
                text: shareText,
                url: window.location.href
            });
        } else {
            // نسخ الرابط إلى الحافظة
            const tempInput = document.createElement('input');
            document.body.appendChild(tempInput);
            tempInput.value = window.location.href;
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('تم نسخ رابط الاختبار! يمكنك مشاركته مع أصدقائك.');
        }
    });
});
