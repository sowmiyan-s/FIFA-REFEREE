import React from "react";
import { BookOpen, X, Search, ArrowRight } from "lucide-react";

interface RuleItem {
  id: string;
  title: string;
  sport: string;
  body: string;
}

interface LawsDatabaseProps {
  showRulebookPanel: boolean;
  setShowRulebookPanel: (show: boolean) => void;
  rulebookSearchQuery: string;
  setRulebookSearchQuery: (query: string) => void;
  showAddRuleForm: boolean;
  setShowAddRuleForm: (show: boolean) => void;
  newRuleTitle: string;
  setNewRuleTitle: (title: string) => void;
  newRuleBody: string;
  setNewRuleBody: (body: string) => void;
  onSaveCustomRule: () => void;
  filteredRulebookList: RuleItem[];
  onTriggerLawCheck: (title: string) => void;
}

export const LawsDatabase: React.FC<LawsDatabaseProps> = ({
  showRulebookPanel,
  setShowRulebookPanel,
  rulebookSearchQuery,
  setRulebookSearchQuery,
  showAddRuleForm,
  setShowAddRuleForm,
  newRuleTitle,
  setNewRuleTitle,
  newRuleBody,
  setNewRuleBody,
  onSaveCustomRule,
  filteredRulebookList,
  onTriggerLawCheck
}) => {
  if (!showRulebookPanel) return null;

  return (
    <div id="rulebook-panel" className="h-full bg-[#111112] border-l border-[#242426] flex flex-col w-[320px] shrink-0 overflow-hidden text-left relative z-10 select-none">
      
      {/* Header */}
      <div className="p-3.5 bg-[#141416] border-b border-[#242426] flex items-center justify-between shrink-0 font-mono text-[10px]">
        <span className="text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-emerald-400" />
          FIFA Laws Database
        </span>
        <button 
          onClick={() => setShowRulebookPanel(false)}
          className="p-1 hover:bg-slate-800 text-slate-500 hover:text-white rounded transition"
          title="Close Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Box */}
      <div className="p-3 bg-[#0c0c0d] border-b border-[#242426] shrink-0">
        <div className="relative bg-[#141416] border border-slate-800 focus-within:border-emerald-500/30 rounded-lg p-1.5 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-slate-600 shrink-0 ml-1" />
          <input
            type="text"
            value={rulebookSearchQuery}
            onChange={(e) => setRulebookSearchQuery(e.target.value)}
            placeholder="Search Law 11, Offside, Handball..."
            className="w-full bg-transparent border-0 outline-none focus:ring-0 text-[10.5px] text-slate-200 placeholder-slate-700 font-sans"
          />
        </div>
      </div>

      {/* Custom Rule Adder Toggle */}
      <div className="px-3 py-2.5 bg-[#141416] border-b border-[#242426] flex flex-col gap-2 shrink-0">
        <button
          onClick={() => setShowAddRuleForm(!showAddRuleForm)}
          className="w-full py-1.5 px-2.5 rounded bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center justify-center gap-1.5 text-[9.5px] font-mono font-bold uppercase tracking-wider transition cursor-pointer"
        >
          <span>{showAddRuleForm ? "Close Form" : "+ Create Custom Law"}</span>
        </button>

        {showAddRuleForm && (
          <div className="space-y-2 p-2.5 bg-[#0a0a0c] rounded border border-slate-800 text-left">
            <div>
              <label className="text-[8px] font-mono font-bold text-slate-500 uppercase block mb-1">Rule/Law Title</label>
              <input
                type="text"
                placeholder="e.g. Law 18 - Active Play"
                value={newRuleTitle}
                onChange={(e) => setNewRuleTitle(e.target.value)}
                className="w-full bg-[#141416] border border-slate-800 rounded px-2 py-1 text-[10px] text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 font-mono"
              />
            </div>
            <div>
              <label className="text-[8px] font-mono font-bold text-slate-500 uppercase block mb-1">Rule Context/Body</label>
              <textarea
                placeholder="Details of the law..."
                rows={3}
                value={newRuleBody}
                onChange={(e) => setNewRuleBody(e.target.value)}
                className="w-full bg-[#141416] border border-slate-800 rounded px-2 py-1 text-[10px] text-white placeholder-slate-700 focus:outline-none focus:border-emerald-500/40 font-sans"
              />
            </div>
            <button
              type="button"
              onClick={onSaveCustomRule}
              className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold rounded text-[9.5px] uppercase transition cursor-pointer"
            >
              Save Custom Law
            </button>
          </div>
        )}
      </div>

      {/* Rule list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar text-left bg-slate-950/20">
        {filteredRulebookList.map((r) => (
          <div 
            key={r.id}
            className="bg-[#141416] border border-slate-800 rounded-lg p-3 text-xs flex flex-col gap-2"
          >
            <div className="flex items-center justify-between text-[9px] font-mono">
              <span className="text-emerald-400 font-black">{r.title}</span>
              <span className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded uppercase font-bold text-slate-500 text-[8px]">{r.sport}</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans">{r.body}</p>
            
            <button
              onClick={() => onTriggerLawCheck(r.title)}
              className="self-end text-[9px] text-emerald-400 font-mono font-extrabold hover:underline flex items-center gap-1 transition cursor-pointer"
            >
              <span>Verify Law Context</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}

        {filteredRulebookList.length === 0 && (
          <p className="text-slate-600 text-[9px] text-center font-mono py-8 uppercase">
            No matching official laws found.
          </p>
        )}
      </div>

      {/* Footer disclaimer */}
      <div className="p-2.5 bg-[#141416] text-[8px] font-mono text-slate-500 text-center uppercase tracking-tight border-t border-[#242426]">
        Laws Source: Official FIFA Laws
      </div>
    </div>
  );
};
