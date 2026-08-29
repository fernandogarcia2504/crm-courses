import type { MyCourse, QuizSubmitResult } from "../types/course.types";

const API_URL = import.meta.env.VITE_API_URL;

export const getMyCourse = async (): Promise<MyCourse> => {

    const token = localStorage.getItem("courseToken");

    const response = await fetch(`${API_URL}/course-portal/course`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Error al obtener el curso");
    }

    const data = await response.json();

    return data.course;
};

export const completeModule = async (moduleId: string): Promise<void> => {

    const token = localStorage.getItem("courseToken");

    const response = await fetch(
        `${API_URL}/course-portal/modules/${moduleId}/complete`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || "Error al completar el modulo");
    }
};

export const submitQuiz = async (
    moduleId: string,
    answers: number[]
): Promise<QuizSubmitResult> => {

    const token = localStorage.getItem("courseToken");

    const response = await fetch(
        `${API_URL}/course-portal/modules/${moduleId}/quiz`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ answers })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || "Error al enviar el quiz");
    }

    return data;
};
