// Login Start
export interface UserCredentials {
    email: string;
    password: string;
}
export interface LoginRequestPayload {
    email: string;
    password: string;
    remember: boolean
}
export interface User {
    id: number;
    email: string;
    token: string;
    firstName: string;
    lastName: string;
    created: number;
    modified: number;
    lastLogin: number;
    status: number;
    role: string;
}

export interface UserResponse {
    item: User;
}
// Login end


// Enrollment Start
export interface EnrollmentResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    items: Enrollment[]
}

export interface Enrollment {

    id: number;
    userId: number;
    examId: number;
    organizationId: number;
    externalOrderId: number;
    status: number;
    type: number;
    created: number;
    started: number;
    modified: number;
    expiration: number;
    converted: number;
    totalTime: number;
    score: number;
    showPreAssessment: boolean;
    user: any;
    exam: Exam;
    organization: Organization;
    progresses: null
}

export interface Organization {
    id: number;
    parentId: number;
    name: string;
    url: string;
    redirectUrl: string;
    credits: number;
    created: number;
    modified: number;
    parent: number;
    children: number;
}

export interface Exam {
    id: number;
    code: string;
    industryId: number;
    stateId: number;
    name: string;
    description: string;
    examTime: number;
    accessTime: number;
    created: number;
    modified: number;
    industry: string;
    state: string;
}
// Enrollment End


// Exam Modules Start
export interface ExamModulesResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    items: ExamModule[]
}

export interface ExamModule {
    id: number;
    examId: number;
    moduleId: number;
    name: string;
    preassessmentQuestions: number;
    practiceQuestions: number;
    examQuestions: number;
    sort: number;
    created: number;
    modified: number;
    exam: Exam;
    module: Module;
}

export interface Module {
    id: number;
    name: string;
    code: string;
    description: string;
    created: number;
    modified: number;
    status: string;
    industryId: number;
    preassessmentBankId: number;
    studyBankId: number;
    practiceBankId: number;
    examBankId: number;
    state: string;
    industry: string;
    preassessmentBank: string;
    studyBank: string;
    practiceBank: string;
    examBank: string;
    examModule: string;
}

// Exam Modules End


// Assessment Attempt Start
export interface AssessmentAttemptsResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    items: AssessmentAttempt[]
}

export interface AssessmentAttempt {
    id: number;
    type: string
    questionCount: number;
    correct: number;
    incorrect: number;
    score: number;
    bookmarked: number;
    unbookmarked: number;
    created: number;
    modified: number;
    completed: number;
    totalTime: number;
    enrollment: Enrollment;
    answered?: boolean;
}
// Assessment Attempt End


// Progress Start
export interface ProgressesResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    items: Progress[]
}

export interface ProgressResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    item: Progress
}

export interface Progress {
    id: number;
    enrollmentId: number;
    moduleId: number;
    type: string;
    questionCount: number;
    attempts: number;
    correct: number;
    incorrect: number;
    bookmarked: number;
    score: number;
    created: number;
    modified: number;
    enrollment: Enrollment;
    module: Module;
    questions: number;
}
// Progress End


// Practice Attempts Start
export interface PracticeAttemptsResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    items: PracticeAttempt[]
}

export interface PracticeAttemptResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    item: PracticeAttempt
}

export interface PracticeAttempt {
    enrollmentId: number;
    moduleId: number;
    id: number;
    type: string;
    questionCount: number;
    correct: number;
    incorrect: number;
    score: number;
    bookmarked: number;
    unbookmarked: number;
    created: number;
    modified: number;
    completed: number;
    totalTime: number;
    module: Module;
    enrollment: Enrollment;
}
// Practice Attempts End


// Progress Details Start
export interface ProgressDetailsResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    items: PracticeAttempt[]
}

export interface ProgressDetails {
    enrollmentId: number;
    moduleId: number;
    id: number;
    type: string;
    questionCount: number;
    correct: number;
    incorrect: number;
    score: number;
    bookmarked: number;
    unbookmarked: number;
    created: number;
    modified: number;
    completed: number;
    totalTime: number;
    module: Module;
    enrollment: Enrollment;
}
// Progress Details End


// Progress Questions Start
export interface ProgressQuestionsResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    items: ProgressQuestions[]
}

export interface ProgressQuestionResponse {
    page: number;
    pages: number;
    itemsPerPage: number;
    total: number;
    itemsCount: number;
    item: ProgressQuestions;
}

export interface ProgressQuestions {
    progressId: number;
    questionId: number;
    id: number;
    viewed: number;
    answered: boolean;
    correct: number;
    bookmarked: number;
    progress: any;
    question: ProgressQuestion;
}

export interface ProgressQuestion {
    id: number;
    questionBankId: number;
    type: string;
    questionText: string;
    feedback: string;
    techniques: string;
    audioHash: string;
    audioFile: string;
    createdById: number;
    created: number;
    modifiedById: number;
    modified: number;
    active: boolean;
    questionBank: number;
    answers: ProgressQuestionAnswer[];
    createdBy: number;
    modifiedBy: number
}

export interface ProgressQuestionAnswer {
    id: number;
    questionId: number;
    answerText: string;
    correct: boolean;
    audioHash: string;
    audioFile: string;
    createdById: number;
    created: number;
    modifiedById: number;
    modified: number;
    question: number;
    createdBy: number;
    modifiedBy: number
}
// Progress Questions End

// Practice Progress
export interface PracticeProgress {
    marked: number;
}

export interface PracticeResults {
    first: PracticeAttempt;
    last: PracticeAttempt;
    best: PracticeAttempt;
}

export interface StudyProgress {
    terms: number;
    marked: number;
    correct: number;
    missed: number;
    unseen: number;
}

export interface AttemptSave {
    enrollmentId: number;
    type: string;
}

export interface StudyItem {
    name: string;
    value: string | number,
    enabled: boolean
}

export interface ModuleAttempts {
    enrollmentId: number;
    moduleId: number;
    type: string;
    filter: number | string;
    quantity: number | string;
}
export interface Result {
    name: string;
    correct: number;
    incorrect: number;
    bookmarked: number;
    total: number;
    sort: number;
    questionAttempts: any[];
    categoryOpen: boolean;
}