import StageList from "@/components/stages/StageList";
import { createClient } from "@/lib/supabaseServer";

export default async function StagesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("stages")
    .select("*")
    .order("position", { ascending: true });

  return (
    <div className="min-h-screen p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            UGE30 Etaper
          </h1>
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Følg med i alle etaper gennem ugen
          </p>
        </div>

        <StageList />
      </div>
    </div>
  );
}
