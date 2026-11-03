import { useEffect, useState, useCallback } from "react";

import type { MyCourse } from "../types/course.types";
import { getMyCourse } from "../services/courseService";
import ModuleCard from "../components/ModuleCard";

export default function CoursePage() {

    const [course, setCourse] = useState<MyCourse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadCourse = useCallback(async () => {

        try {
            const data = await getMyCourse();
            setCourse(data);
            setError("");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Error al cargar el curso");
        } finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos al montar, patron intencional
        loadCourse();
    }, [loadCourse]);

    if (loading) {
        return (
            <div className="flex w-full items-center justify-center gap-2.5 py-24 text-[0.9rem] text-muted">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-line-2 border-t-accent" />
                Cargando curso...
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto mt-10 max-w-2xl px-6">
                <div className="rounded-md border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-center text-[0.86rem] text-danger">{error}</div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-10">

            <div className="flex flex-col gap-3">
                <div>
                    <h1 className="text-[1.5rem] font-semibold tracking-tight">{course.title}</h1>
                    {course.description && <p className="mt-1 text-[0.9rem] text-muted">{course.description}</p>}
                </div>

                <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
                        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${course.progress}%` }} />
                    </div>
                    <span className="tnum text-[0.84rem] font-semibold">{course.progress}%</span>
                </div>
                <p className="text-[0.78rem] text-faint">
                    {course.completed ? "Curso completado 🎉" : "Completa todos los módulos para terminar el curso"}
                </p>
            </div>

            <div className="flex flex-col gap-3">
                {course.modules.map((module) => (
                    <ModuleCard key={module.id} module={module} onUpdated={loadCourse} />
                ))}
            </div>
        </div>
    );
}
