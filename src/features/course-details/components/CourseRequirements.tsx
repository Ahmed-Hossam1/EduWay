type CourseRequirementsProps = {
    requirements: string[];
};

export function CourseRequirements({ requirements }: CourseRequirementsProps) {
    if (requirements.length === 0) return null;

    return (
        <section aria-labelledby="requirements-title">
            <h2 id="requirements-title" className="text-2xl font-bold tracking-tight text-foreground">
                Requirements
            </h2>

            {requirements.length > 0 && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground marker:text-primary">
                    {requirements.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                    ))}
                </ul>
            )}
        </section>
    );
}
