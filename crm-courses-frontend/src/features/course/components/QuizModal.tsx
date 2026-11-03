import { useState } from "react";
import { X, Check } from "lucide-react";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="flex max-h-[85vh] w-full max-w-lg flex-col gap-5 overflow-y-auto rounded-xl border border-line bg-surface p-6 shadow-2xl">

                <div className="flex items-center justify-between">
                    <p className="text-[1.05rem] font-semibold">Quiz del módulo</p>
                    <button onClick={onClose} className="rounded-md p-1 text-faint transition-colors hover:bg-surface-2 hover:text-ink">
                        <X size={18} />
                    </button>
                </div>

                {result ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                        <div className={`flex h-16 w-16 items-center justify-center rounded-full ${result.passed ? "bg-good/15 text-good" : "bg-danger/15 text-danger"}`}>
                            <span className="tnum text-[1.3rem] font-semibold">{result.score}%</span>
                        </div>
                        <p className={`text-[1rem] font-semibold ${result.passed ? "text-good" : "text-danger"}`}>
                            {result.passed ? "¡Aprobado!" : "No aprobado"}
                        </p>
                        <p className="max-w-[320px] text-center text-[0.85rem] text-muted">
                            {result.passed
                                ? "El módulo quedó marcado como completado."
                                : "No alcanzaste el puntaje mínimo. Puedes cerrar y volver a intentarlo."}
                        </p>
                        <button onClick={onClose} className="mt-2 rounded-md bg-accent px-6 py-2 text-[0.88rem] font-semibold text-accent-ink transition-colors hover:bg-accent-2">
                            Cerrar
                        </button>
                    </div>
                ) : (
                    <>
                        {quiz.map((question, qIndex) => (
                            <div key={qIndex} className="flex flex-col gap-2">
                                <p className="text-[0.9rem] font-medium">{qIndex + 1}. {question.question}</p>

                                <div className="flex flex-col gap-1.5">
                                    {question.options.map((option, oIndex) => {
                                        const selected = answers[qIndex] === oIndex;
                                        return (
                                            <button
                                                key={oIndex}
                                                type="button"
                                                onClick={() => handleSelect(qIndex, oIndex)}
                                                className={[
                                                    "flex items-center gap-2.5 rounded-md border px-3 py-2 text-left text-[0.86rem] transition-colors",
                                                    selected ? "border-accent bg-accent/10 text-ink" : "border-line-2 bg-surface-2 text-muted hover:border-faint hover:text-ink"
                                                ].join(" ")}
                                            >
                                                <span className={[
                                                    "flex h-4 w-4 flex-none items-center justify-center rounded-full border",
                                                    selected ? "border-accent bg-accent text-accent-ink" : "border-line-2 text-transparent"
                                                ].join(" ")}>
                                                    <Check size={11} />
                                                </span>
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {error && <p className="text-[0.82rem] text-danger">{error}</p>}

                        <button
                            onClick={handleSubmit}
                            disabled={!allAnswered || submitting}
                            className="mt-1 w-full rounded-md bg-accent py-2 text-[0.9rem] font-semibold text-accent-ink transition-colors hover:bg-accent-2 disabled:opacity-60"
                        >
                            {submitting ? "Enviando..." : "Enviar respuestas"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
