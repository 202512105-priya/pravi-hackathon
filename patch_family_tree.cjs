const fs = require('fs');

let content = fs.readFileSync('src/components/family/HouseholdMembers.tsx', 'utf8');

const dynamicTreeHtml = `
      <div className="p-6 bg-slate-50 border-b border-slate-100 overflow-x-auto">
        <h4 className="text-sm font-medium text-slate-500 mb-4 text-center">Relationship Structure</h4>
        <div className="flex justify-center items-center min-w-max">
          <div className="flex flex-col items-center">
            {/* Head */}
            {(() => {
              const head = family.members.find(m => m.relation === 'Head') || family.members[0];
              const others = family.members.filter(m => m.id !== head?.id);
              
              if (!head) return null;

              return (
                <>
                  <div className="bg-white border-2 border-primary rounded-lg px-4 py-2 text-center shadow-sm z-10 w-40">
                    <span className="block text-xs font-semibold text-primary uppercase tracking-wide mb-1">{head.relation}</span>
                    <span className="font-medium text-slate-800 text-sm truncate block">{head.name}</span>
                  </div>
                  
                  {others.length > 0 && (
                    <>
                      {/* Vertical Line from Head */}
                      <div className="h-6 w-0.5 bg-slate-300"></div>
                      
                      {/* Horizontal Line spanning children */}
                      <div className="relative bg-slate-300 h-0.5" style={{ width: \`\${Math.max((others.length - 1) * 160, 2)}px\` }}>
                        {others.map((_, idx) => (
                          <div key={idx} className="absolute -top-0.5 h-6 w-0.5 bg-slate-300" style={{ left: others.length === 1 ? '50%' : \`\${(idx / (others.length - 1)) * 100}%\` }}></div>
                        ))}
                      </div>
                      
                      {/* Others row */}
                      <div className="flex justify-between mt-5" style={{ width: \`\${Math.max((others.length - 1) * 160 + 120, 120)}px\` }}>
                        {others.map((member, idx) => (
                          <div key={member.id} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-center shadow-sm w-28 flex flex-col items-center">
                            <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1 truncate w-full">{member.relation}</span>
                            <span className="font-medium text-slate-700 text-xs truncate w-full" title={member.name}>{member.name.split(' ')[0]}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </div>
`;

// regex to replace the old hardcoded tree block
const regex = /<div className="p-6 bg-slate-50 border-b border-slate-100">[\s\S]*?<\/div>\n      <\/div>/;

content = content.replace(regex, dynamicTreeHtml.trim());

fs.writeFileSync('src/components/family/HouseholdMembers.tsx', content);
