import StageList from "@/components/stages/StageList";
import { createClient } from "@/lib/supabaseServer";

export default async function StagesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("stages")
    .select("*")
    .order("position", { ascending: true });

  // Ensure 'position' is not null before passing to StageList
  const sanitizedData =
    data?.filter((stage) => stage.position !== null) // filter out null positions
      .map((stage) => ({
        ...stage,
        position: stage.position as number, // cast to number (safe after filter)
      })) ?? null;

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            UGE30 Etaper
          </h1>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Følg med i alle etaper gennem ugen
          </p>
        </div> */}
        <div className="text-center mb-4 sm:mb-8 flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            UGE30{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Etaper
            </span>
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">
            Her kan du følge med i alle etaper gennem ugen, se kommende aktiviteter og
            finde information om de forskellige events.
          </p>
        </div>

        <StageList data={sanitizedData} />
      </div>
    </div>
  );
}
