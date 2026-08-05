export default function SkillCard({ title, skills }) {
  return (
    <div className="rounded-3xl border bg-white/10 p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-2">
      <h3 className="mb-5 text-xl font-bold capitalize">{title}</h3>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}

            className="rounded-full bg-[#45A9A9]/20 px-4 py-2 text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
