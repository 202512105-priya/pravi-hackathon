const fs = require('fs');

let content = fs.readFileSync('src/pages/SchemeDetail.tsx', 'utf8');

// Replace the mockData import to include eventLogic
content = content.replace("import { mockBenefits, mockApplications, mockFamilies } from '../data/mockData';", "import { mockBenefits, mockApplications, mockFamilies } from '../data/mockData';\nimport { sessionEvents } from '../data/eventLogic';");

// Inside SchemeDetail component, replace the render of appStatusNode to include event badges
const oldMapRow = `const app = mockApplications.find(a => a.id === b.applicationId);`;

const newMapRow = `const app = mockApplications.find(a => a.id === b.applicationId);
                const memberEvents = sessionEvents.filter(e => e.familyId === b.familyId && (e.affectedMemberId === b.beneficiaryMemberId || !e.affectedMemberId) && e.status === 'REVIEW_REQUIRED');
                const hasEvent = memberEvents.length > 0;`;

content = content.replace(oldMapRow, newMapRow);

const oldNameRender = `<td className="px-6 py-4 font-medium text-slate-800">{name}</td>`;
const newNameRender = `<td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex flex-col">
                        <span>{name}</span>
                        {hasEvent && (
                          <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider mt-0.5">
                            {memberEvents[0].eventType.replace('_', ' ')} FLAG
                          </span>
                        )}
                      </div>
                    </td>`;

content = content.replace(oldNameRender, newNameRender);

fs.writeFileSync('src/pages/SchemeDetail.tsx', content);
