import Flow from "./components/Flow";
import { getNodesAndEdges, openAiResultToNiceJSON } from "./functions";

export default function Home() {
  const res = getNodesAndEdges();
  console.log(res);

  // useEffect(() => {
  //   console.log(openAiResultToNiceJSON());
  // });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-[700px] h-[700px]">
        <Flow initNodes={res.nodes} initEdges={res.edges} />
      </div>
    </main>
  );
}
