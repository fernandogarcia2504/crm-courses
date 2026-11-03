import { useState } from "react";
import { CheckCircle2, Circle, FileText, PlayCircle, ClipboardCheck } from "lucide-react";

import type { CourseModule } from "../types/course.types";
import { completeModule } from "../services/courseService";
import QuizModal from "./QuizModal";

interface ModuleCardProps {
    module: CourseModule;
    onUpdated: () => void;
}

const linkChip = "flex items-center gap-2 rounded-md border border-line-2 bg-surface-2 px-3 py-2 text-[0.84rem] text-muted transition-colors hover:border-faint hover:text-ink";

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
        <div className={`rounded-lg border bg-surface p-5 transition-colors ${module.completed ? "border-good/30" : "border-line"}`}>

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[1rem] font-medium">{module.title}</p>
                    {module.description && <p className="mt-1 text-[0.84rem] text-muted">{module.description}</p>}
                </div>

                {module.completed ? (
                    <CheckCircle2 className="shrink-0 text-good" size={22} />
                ) : (
                    <Circle className="shrink-0 text-line-2" size={22} />
                )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {module.pdfUrl && (
                    <a href={module.pdfUrl} target="_blank" rel="noreferrer" className={linkChip}>
                        <FileText size={15} /> Ver material (PDF)
                    </a>
                )}

                {module.videoUrl && (
                    <a href={module.videoUrl} target="_blank" rel="noreferrer" className={linkChip}>
                        <PlayCircle size={15} /> Ver video
                    </a>
                )}

                {module.hasQuiz && (
                    <button onClick={() => setShowQuiz(true)} className={`${linkChip} cursor-pointer`}>
                        <ClipboardCheck size={15} />
                        {module.quizScore !== null ? `Repetir quiz · ${module.quizScore}%` : "Tomar quiz"}
                    </button>
                )}
            </div>

            {!module.hasQuiz && !module.completed && (
                <button
                    onClick={handleMarkComplete}
                    disabled={marking}
                    className="mt-4 text-[0.84rem] font-medium text-accent transition-opacity hover:underline disabled:opacity-60"
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
