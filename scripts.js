let courses = [{ grade: '', level: '', credits: '' }];
let gpa = '0.00';
let unweightedGpa = '0.00';
let weightedGpa = '0.00';
let title = 'Details';
let courseAmount = 0;
let currentPage = 'Home';
let predictedSAT = 0;
let predictedACT = 0;
let selectedMajor = '';
let electives = [];

const electivesByMajor = {
    'Arts and Music': [
        'Drawing & Painting I',
        'Sculpture',
        'Digital Photo I & II',
        'Digital Video',
        'Adv. Photo/Digital Video',
        'Computer Animation I & II',
        'Architecture & Design I & II',
        'Fashion Design & Illustration I & II',
        'Graphic Arts',
        'Hot Glass, Metals & Jewelry I & II',
        'The Art Portfolio',
        'AT Art History 715',
        'AT 2-D Art 735',
        'AT 3-D Art 735',
        'Music Theory',
    ],
    Theater: [
        'Act I: All the World’s a Stage',
        'Act II: Setting the Stage',
        'Creative Stage: Improv',
        'Playwriting/Devising',
        'Theater Tech',
    ],
    Business: [
        'AT Entrepreneurship',
        'Topics in Econ and Personal Finance',
        'AT Statistics 455',
    ],
    'Computers & Math': [
        'Digital Logic Design',
        'AT Linear Algebra 455',
        'Computer Science',
        'Computer Science 912',
        'Cont. Topics in Comp. Science 922',
        'AT Statistics 455',
    ],
    'Engineering & Technology': [
        'Intro: Human-Centered Design 912',
        'Intro to Engineering 912',
        'Product Design & Development',
        'Principles of Electrical Engineering',
        'Robotics',
        'Mobile App Design & Development',
    ],
    'Language & Humanities': [
        'Race & Ethnicity',
        'Psychology',
        'Modern Phil. Thought',
        'Gender & Politics',
        'Intro to Linguistics',
    ],
    'Natural Sciences': ['Science Research'],
    'Social Sciences': [
        'Topics in Econ and Personal Finance',
        'Race & Ethnicity',
        'Psychology',
        'Modern Phil. Thought',
        'Criminal Justice',
    ],
};

function handleMajorChange(major) {
    selectedMajor = major;
    if (major) {
        electives = electivesByMajor[major];
        document.getElementById('electives-results-container').style.display = 'block';
    } else {
        electives = [];
        document.getElementById('electives-results-container').style.display = 'none';
    }
    updateElectivesList();
}

function letterToNumeric(grade) {
    const unweightedGrades = {
        'A+': 4.4, 'A': 4.0, 'A-': 3.7, 'B+': 3.4, 'B': 3.0, 'B-': 2.7,
        'C+': 2.4, 'C': 2.0, 'C-': 1.7, 'D+': 1.4, 'D': 1.0, 'F': 0.0,
    };
    return unweightedGrades[grade] || 0;
}

function levelToMultiplier(level) {
    switch (level.toLowerCase()) {
        case 'honors': return 0.5;
        case 'accelerated': return 0.25;
        case 'at': return 1.0;
        default: return 0;
    }
}

function calculateUnweightedGpa() {
    let totalGradePoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const gradePoints = letterToNumeric(course.grade);

        const credits = parseFloat(course.credits) || 0;

        if (!course.grade || isNaN(credits) || credits <= 0) {
            return; // Skip this course if the data is invalid
        }

        totalGradePoints += gradePoints * credits;
        totalCredits += credits;
    });

    const unweightedGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    unweightedGpa = unweightedGPA.toFixed(2);
    updateGpaResults();
}

function calculateWeightedGpa() {
    let totalWeightedPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
        const gradePoints = letterToNumeric(course.grade);
        let weightedGradePoints = gradePoints;

        if (course.level.toLowerCase() === 'honors') {
            weightedGradePoints += 0.5;
        } else if (course.level.toLowerCase() === 'accelerated') {
            weightedGradePoints += 0.25;
        } else if (course.level.toLowerCase() === 'at') {
            weightedGradePoints += 1;
        }

        const credits = parseFloat(course.credits) || 0;

        if (!course.grade || isNaN(credits) || credits <= 0) {
            return; // Skip this course if the data is invalid
        }

        totalWeightedPoints += weightedGradePoints * credits;
        totalCredits += credits;
    });

    const weightedGPA = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
    weightedGpa = weightedGPA.toFixed(2);
    updateGpaResults();
}

function predictSATScore(gpa) {
    const minGPA = 0;
    const maxGPA = 4.4;
    let predictedSAT = 400 + ((gpa - minGPA) / (maxGPA - minGPA)) * 1200;
    
    // Ensure SAT does not exceed 1600 and round to the nearest 10
    return Math.min(Math.round(predictedSAT / 10) * 10, 1600);
}

function predictACTScore(gpa) {
    const minGPA = 0;
    const maxGPA = 4.0;
    let predictedACT = 1 + ((gpa - minGPA) / (maxGPA - minGPA)) * 35;
    
    // Ensure ACT does not exceed 36 and round to the nearest whole number
    return Math.min(Math.round(predictedACT), 36);
}

function updateGpaResults() {
    document.getElementById('unweighted-gpa').innerText = `Unweighted GPA: ${unweightedGpa}`;
    document.getElementById('weighted-gpa').innerText = `Weighted GPA: ${weightedGpa}`;
    if (unweightedGpa !== '0.00' && weightedGpa !== '0.00') {
        predictedSAT = predictSATScore(parseFloat(weightedGpa));
        predictedACT = predictACTScore(parseFloat(weightedGpa));
        document.getElementById('sat-score').innerText = `SAT Score: ${predictedSAT}`;
        document.getElementById('act-score').innerText = `ACT Score: ${predictedACT}`;
        document.getElementById('sat-act-description').innerText = '';
    } else {
        document.getElementById('sat-act-description').innerText = 'Please complete the GPA calculation in order to receive a predicted SAT and ACT score';
        document.getElementById('sat-score').innerText = '';
        document.getElementById('act-score').innerText = '';
    }
}

function updateElectivesList() {
    const electivesList = document.getElementById('electives-list');
    electivesList.innerHTML = '';
    electives.forEach(elective => {
        const li = document.createElement('li');
        li.innerText = elective;
        electivesList.appendChild(li);
    });
}

function setCurrentPage(page) {
    currentPage = page;
    const homePage = document.getElementById('home-page');
    const gpaPage = document.getElementById('gpa-page');
    const satActPage = document.getElementById('sat-act-page');
    const electivesPage = document.getElementById('electives-page');

    homePage.style.display = 'none';
    gpaPage.style.display = 'none';
    satActPage.style.display = 'none';
    electivesPage.style.display = 'none';

    const homeNav = document.getElementById('home-nav');
    const gpaNav = document.getElementById('gpa-nav');
    const satActNav = document.getElementById('sat-act-nav');
    const electivesNav = document.getElementById('electives-nav');

    homeNav.classList.remove('current-page');
    gpaNav.classList.remove('current-page');
    satActNav.classList.remove('current-page');
    electivesNav.classList.remove('current-page');

    switch (page) {
        case 'Home':
            homePage.style.display = 'block';
            document.getElementById('title').innerText = 'Home';
            homeNav.classList.add('current-page');
            break;
        case 'GPA':
            gpaPage.style.display = 'block';
            document.getElementById('title').innerText = 'GPA Calculator';
            gpaNav.classList.add('current-page');
            break;
        case 'SAT/ACT':
            satActPage.style.display = 'block';
            document.getElementById('title').innerText = 'SAT/ACT Prediction';
            satActNav.classList.add('current-page');
            break;
        case 'Electives':
            electivesPage.style.display = 'block';
            document.getElementById('title').innerText = 'Elective Guidance';
            electivesNav.classList.add('current-page');
            break;
    }
}

function updateCourses() {
    const coursesContainer = document.getElementById('gpa-dropdowns-container');
    coursesContainer.innerHTML = '';
    courses.forEach((course, index) => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.marginBottom = '10px';

        const gradeSelect = document.createElement('select');
        gradeSelect.value = '';
        gradeSelect.style.height = '50px';
        gradeSelect.style.width = '150px';
        gradeSelect.style.backgroundColor = '#fff';
        gradeSelect.style.borderWidth = '1px';
        gradeSelect.style.borderColor = '#ccc';
        gradeSelect.style.borderRadius = '5px';
        gradeSelect.onchange = () => {
            course.grade = gradeSelect.value;
            calculateUnweightedGpa();
            calculateWeightedGpa();
        };

        const levelSelect = document.createElement('select');
        levelSelect.value = '';
        levelSelect.style.height = '50px';
        levelSelect.style.width = '150px';
        levelSelect.style.backgroundColor = '#fff';
        levelSelect.style.borderWidth = '1px';
        levelSelect.style.borderColor = '#ccc';
        levelSelect.style.borderRadius = '5px';
        levelSelect.onchange = () => {
            course.level = levelSelect.value;
            calculateUnweightedGpa();
            calculateWeightedGpa();
        };

        const creditsSelect = document.createElement('select');
        creditsSelect.value = '';
        creditsSelect.style.height = '50px';
        creditsSelect.style.width = '150px';
        creditsSelect.style.backgroundColor = '#fff';
        creditsSelect.style.borderWidth = '1px';
        creditsSelect.style.borderColor = '#ccc';
        creditsSelect.style.borderRadius = '5px';
        creditsSelect.onchange = () => {
            course.credits = creditsSelect.value;
            calculateUnweightedGpa();
            calculateWeightedGpa();
        };

        const gradeOptions = ['Grade', 'A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
        gradeOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            gradeSelect.appendChild(optionElement);
        });

        const levelOptions = ['Level', 'Regular', 'Accelerated', 'Honors', 'AT'];
        levelOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.toLowerCase();
            optionElement.text = option;
            levelSelect.appendChild(optionElement);
        });

        const creditsOptions = ['Credit', '0.25', '0.5', '1'];
        creditsOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.text = option;
            creditsSelect.appendChild(optionElement);
        });

        div.appendChild(gradeSelect);
        div.appendChild(levelSelect);
        div.appendChild(creditsSelect);
        coursesContainer.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const classesTakenSelect = document.getElementById('classes-taken-select');
    for (let i = 1; i <= 50; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        classesTakenSelect.appendChild(option);
    }

    classesTakenSelect.onchange = () => {
        courseAmount = parseInt(classesTakenSelect.value);
        if (courseAmount <= 0) {
            courseAmount = 1; // Set a default value if the selected value is invalid
        }
        courses = Array.from({ length: courseAmount }, () => ({ grade: '', level: '', credits: '' }));
        updateCourses();
        document.getElementById('classes-taken-selected').innerText = `You selected: ${courseAmount} class(es)`;
    };

    const electivesMajorSelect = document.getElementById('electives-major-select');
    electivesMajorSelect.onchange = () => {
        handleMajorChange(electivesMajorSelect.value);
    };

    document.getElementById('title').innerText = 'Home';
    setCurrentPage('Home'); // Call setCurrentPage here
});
