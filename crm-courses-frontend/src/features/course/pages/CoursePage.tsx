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
            <div className="w-full flex items-center justify-center py-24 text-[#959595]">
                Cargando curso...
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full flex items-center justify-center py-24 text-red-400 text-sm text-center px-4">
                {error}
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="w-full max-w-2xl mx-auto px-4 py-10 flex flex-col gap-6">

            <div className="flex flex-col gap-2">
                <h1 className="text-2xl">{course.title}</h1>
                {course.description && (
                    <p className="text-sm text-[#959595]">{course.description}</p>
                )}

                <div className="w-full bg-[#212121] rounded-full h-2 mt-2 overflow-hidden">
                    <div
                        className="bg-[#2F76D2] h-full transition-all"
                        style={{ width: `${course.progress}%` }}
                    />
                </div>
                <p className="text-xs text-[#959595]">
                    {course.completed
                        ? "Curso completado"
                        : `${course.progress}% completado`}
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {course.modules.map((module) => (
                    <ModuleCard
                        key={module.id}
                        module={module}
                        onUpdated={loadCourse}
                    />
                ))}
            </div>
        </div>
    );
}
