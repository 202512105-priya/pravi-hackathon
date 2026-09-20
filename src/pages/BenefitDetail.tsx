import { useParams, Link } from 'react-router-dom';
import { mockBenefits } from '../data/mockData';
import { Badge } from '../components/common/Badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

export function BenefitDetail() {
  const { benefitId } = useParams<{ benefitId: string }>();
  const benefit = mockBenefits.find(b => b.id === benefitId);

  if (!benefit) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState title="Benefit Not Found" description="The requested benefit does not exist in the mock dataset." />
      </div>
    );
  }

  const remainingAmount = benefit.sanctionedAmount - benefit.paidAmount;

  return (
    <div className="pb-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500 font-medium">
        <Link to="/benefits" className="hover:text-primary transition flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> Benefits Ledger</Link>
        <span>/</span>
        <span className="text-slate-800">{benefit.id}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">{benefit.schemeName}</h1>
            <p className="text-slate-500 text-sm">{benefit.department} • {benefit.district}</p>
          </div>
          <Badge variant={benefit.status === 'Completed' ? 'Success' : 'Low'}>{benefit.status}</Badge>
        </div>
        
        <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-12">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Family ID</span>
            <Link to={`/families/${benefit.familyId}`} className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              {benefit.familyId} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Beneficiary Member</span>
            <span className="text-slate-800 font-medium">{benefit.beneficiaryMemberId}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Sanctioned Amount</span>
            <span className="text-slate-800 font-mono text-lg">₹{benefit.sanctionedAmount.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Paid Amount</span>
            <span className="text-green-600 font-mono text-lg">₹{benefit.paidAmount.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Remaining Amount</span>
            <span className="text-slate-800 font-mono">₹{remainingAmount.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Last Transaction</span>
            <span className="text-slate-800">{benefit.lastTransaction || 'No transactions yet'}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Last Verified / Enrollment</span>
            <span className="text-slate-800">{benefit.lastVerifiedAt}</span>
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Next Review Date</span>
            <span className="text-slate-800">{benefit.nextReviewAt}</span>
          </div>
        </div>
        
        {benefit.applicationId && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Related Application</span>
              <span className="text-slate-800 font-medium">{benefit.applicationId}</span>
            </div>
            <Link to={`/applications/${benefit.applicationId}`} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition">
              View Application Journey
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
