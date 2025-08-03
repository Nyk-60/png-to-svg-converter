import React from "react";

function CricutSilhouetteSection({ cutSvgs = [] }) {
  return (
    <section className="text-center py-12">
      <h3 className="text-xl font-bold mb-4">
        Cricut and Silhouette Cutting Machines
      </h3>
      <p className="text-gray-500 mb-8">
        Get layered SVG files with registration marks for cutting machines
      </p>

      {cutSvgs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {cutSvgs.map((svg, idx) => (
            <div key={idx} className="border border-dashed rounded-lg p-2 w-32 h-32 flex justify-center items-center">
              <img src={svg} alt={`Cut SVG ${idx + 1}`} className="max-w-full max-h-full"/>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No Cut SVG generated yet.</p>
      )}
    </section>
  );
}

export default CricutSilhouetteSection;
