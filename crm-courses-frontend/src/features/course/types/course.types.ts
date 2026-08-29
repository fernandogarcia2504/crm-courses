export interface QuizQuestion {
    question: string;
    options: string[];
}

export interface CourseModule {
    id: string;
    title: string;
    description?: string;
    order: number;
    pdfUrl: string | null;
    videoUrl: string | null;
    hasQuiz: boolean;
    quiz: QuizQuestion[];
    completed: boolean;
    quizScore: number | null;
}

export interface MyCourse {
    id: string;
    title: string;
    description?: string;
    progress: number;
    completed: boolean;
    modules: CourseModule[];
}

export interface QuizSubmitResult {
    message: string;
    score: number;
    passed: boolean;
    progress: number;
    completed: boolean;
}
