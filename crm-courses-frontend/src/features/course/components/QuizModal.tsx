import { useState } from "react";
import { X } from "lucide-react";

import type { QuizQuestion } from "../types/course.types";
import { submitQuiz } from "../services/courseService";

interface QuizModalProps {
    moduleId: string;
    quiz: QuizQuestion[];
    onClose: () => void;
    onGraded: (passed: boolean) => void;
}

export default function QuizModal({ moduleId, quiz, onClose, onGraded }: QuizModalProps) {

    const [answers, setAnswers] = useState<(number | null)[]>(
        new Array(quiz.length).fill(null)
    );

    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ passed: boolean; score: number } | null>(null);
    const [error, setError] = useState("");

    const allAnswered = answers.every((a) => a !== null);

    const handleSelect = (questionIndex: number, optionIndex: number) => {
        const next = [...answers];
        next[questionIndex] = optionIndex;
        setAnswers(next);
    };

    const handleSubmit = async () => {

        if (!allAnswered) return;

        setSubmitting(true);
        setError("");

        try {
            const data = await submitQuiz(moduleId, answers as number[]);
            setResult({ passed: data.passed, score: data.score });
            onGraded(data.passed);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al enviar el quiz");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A1A1A] w-full max-w-lg rounded-md p-6 flex flex-col gap-5 max-h-[85vh] overflow-y-auto">

                <div className="flex items-center justify-between">
                    <p className="text-lg">Quiz del modulo</p>
                    <button onClick={onClose} className="cursor-pointer text-[#959595] hover:text-[#ECECEC]">
                        <X size={20} />
                    </button>
                </div>

                {result ? (
                    <div className="flex flex-col gap-3 items-center py-6">
                        <p className={`text-3xl ${result.passed ? "text-green-400" : "text-red-400"}`}>
                            {result.score}%
                        </p>
                        <p className="text-sm text-[#959595] text-center">
                            {result.passed
                                ? "Aprobado. El modulo quedo marcado como completado."
                                : "No alcanzaste el puntaje minimo. Puedes cerrar y volver a intentarlo."}
                        </p>
                        <button
                            onClick={onClose}
                            className="rounded-md py-2 px-6 bg-[#2F76D2] mt-2 cursor-pointer"
                        >
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <>
                        {quiz.map((question, qIndex) => (
                            <div key={qIndex} className="flex flex-col gap-2">
                                <p className="text-sm">{qIndex + 1}. {question.question}</p>

                                <div className="flex flex-col gap-1">
                                    {question.options.map((option, oIndex) => (
                                        <label
                                            key={oIndex}
                                            className="flex items-center gap-2 text-sm bg-[#212121] rounded-md px-3 py-2 cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${qIndex}`}
                                                checked={answers[qIndex] === oIndex}
                                                onChange={() => handleSelect(qIndex, oIndex)}
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {error && <p className="text-sm text-red-400">{error}</p>}

                        <button
                            onClick={handleSubmit}
                            disabled={!allAnswered || submitting}
                            className="w-full rounded-md py-2 bg-[#2F76D2] mt-2 cursor-pointer disabled:opacity-60"
                        >
                            {submitting ? "Enviando..." : "Enviar respuestas"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
