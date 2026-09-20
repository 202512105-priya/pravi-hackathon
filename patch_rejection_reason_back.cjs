const fs = require('fs');

let content = fs.readFileSync('src/pages/ApplicationDetail.tsx', 'utf8');

const rejectUI = `{app.currentStage === 'Rejected' && (
            <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg col-span-full">
              <h3 className="text-red-800 font-bold mb-1">Rejection Reason</h3>
              <p className="text-sm text-red-700 mb-3">{rejectReason}</p>
              <button className="px-4 py-2 bg-white border border-red-200 text-red-700 text-sm font-semibold rounded hover:bg-red-50 transition shadow-sm">
                Initiate Appeal / Challenge
              </button>
            </div>
          )}`;
content = content.replace(/<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">/, '<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">\n          ' + rejectUI);

fs.writeFileSync('src/pages/ApplicationDetail.tsx', content);
