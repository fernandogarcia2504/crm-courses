import { useState } from "react";
import { CheckCircle2, Circle, FileText, PlayCircle, ClipboardCheck } from "lucide-react";

import type { CourseModule } from "../types/course.types";
import { completeModule } from "../services/courseService";
import QuizModal from "./QuizModal";

interface ModuleCardProps {
    module: CourseModule;
    onUpdated: () => void;
}

export default function ModuleCard({ module, onUpdated }: ModuleCardProps) {

    const [showQuiz, setShowQuiz] = useState(false);
    const [marking, setMarking] = useState(false);

    // Los modulos sin quiz (solo PDF y/o video) se marcan completos con
    // un boton directo; los que tienen quiz se completan al aprobarlo.
    const handleMarkComplete = async () => {

        setMarking(true);

        try {
            await completeModule(module.id);
            onUpdated();
        } catch {
            // se podria mostrar un toast; por ahora solo se libera el boton
        } finally {
            setMarking(false);
        }
    };

    return (
        <div className="bg-[#1A1A1A] rounded-md p-5 flex flex-col gap-4">

            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-lg">{module.title}</p>
                    {module.description && (
                        <p className="text-sm text-[#959595] mt-1">{module.description}</p>
                    )}
                </div>

                {module.completed ? (
                    <CheckCircle2 className="text-green-400 shrink-0" size={22} />
                ) : (
                    <Circle className="text-[#3A3A3A] shrink-0" size={22} />
                )}
            </div>

            <div className="flex flex-col gap-2">

                {module.pdfUrl && (
                    <a
                        href={module.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm bg-[#212121] rounded-md px-3 py-2 hover:bg-[#262626]"
                    >
                        <FileText size={16} />
                        Ver material (PDF)
                    </a>
                )}

                {module.videoUrl && (
                    <a
                        href={module.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-sm bg-[#212121] rounded-md px-3 py-2 hover:bg-[#262626]"
                    >
                        <PlayCircle size={16} />
                        Ver video
                    </a>
                )}

                {module.hasQuiz && (
                    <button
                        onClick={() => setShowQuiz(true)}
                        className="flex items-center gap-2 text-sm bg-[#212121] rounded-md px-3 py-2 hover:bg-[#262626] cursor-pointer"
                    >
                        <ClipboardCheck size={16} />
                        {module.quizScore !== null
                            ? `Repetir quiz (ultimo puntaje: ${module.quizScore}%)`
                            : "Tomar quiz"}
                    </button>
                )}
            </div>

            {!module.hasQuiz && !module.completed && (
                <button
                    onClick={handleMarkComplete}
                    disabled={marking}
                    className="self-start text-sm text-[#2F76D2] hover:underline cursor-pointer disabled:opacity-60"
                >
                    {marking ? "Marcando..." : "Marcar como completado"}
                </button>
            )}

            {showQuiz && (
                <QuizModal
                    moduleId={module.id}
                    quiz={module.quiz}
                    onClose={() => setShowQuiz(false)}
                    onGraded={() => onUpdated()}
                />
            )}
        </div>
    );
}
