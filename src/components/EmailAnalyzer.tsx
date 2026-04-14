import React, { useState } from 'react';
import { analyzeEmail, PhishingAnalysis } from '@/src/services/geminiService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ShieldAlert, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function EmailAnalyzer() {
  const [emailContent, setEmailContent] = useState('');
  const [analysis, setAnalysis] = useState<PhishingAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!emailContent.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeEmail(emailContent);
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] h-full">
      {/* Source Panel */}
      <section className="source-panel border-r border-border p-10 bg-[#0d0d0d] overflow-y-auto">
        <span className="panel-label">Suspicious Email Artifact</span>
        <div className="space-y-6">
          <Textarea
            placeholder="Paste email content here..."
            className="min-h-[300px] font-mono text-[13px] leading-relaxed resize-none bg-[#111] border-border text-[#ccc] p-5 rounded-sm focus-visible:ring-primary/30"
            value={emailContent}
            onChange={(e) => setEmailContent(e.target.value)}
          />
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={loading || !emailContent.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold uppercase tracking-wider text-xs h-12 rounded-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ShieldAlert className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Analyzing Artifact...' : 'Run PhishGuard Scan'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEmailContent('');
                setAnalysis(null);
                setError(null);
              }}
              disabled={loading || (!emailContent && !analysis)}
              className="w-full border-border text-foreground font-semibold uppercase tracking-wider text-xs h-12 rounded-sm"
            >
              Clear Artifact
            </Button>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-border space-y-6">
          <span className="panel-label text-accent">General Safety Protocol</span>
          <div className="space-y-4">
            {[
              { title: "Check the Sender", desc: "Hover over the sender's name to see the actual email address." },
              { title: "Inspect Links", desc: "Hover over links to see the destination URL before clicking." },
              { title: "Trust Your Gut", desc: "If an email feels too urgent or too good to be true, it probably is." },
              { title: "Verify Offline", desc: "Call the company using a known number from their official website." }
            ].map((tip, i) => (
              <div key={i} className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">{tip.title}</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analysis Panel */}
      <section className="analysis-panel p-10 overflow-y-auto bg-background">
        <AnimatePresence mode="wait">
          {!analysis && !loading && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-8"
            >
              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-heading italic text-foreground tracking-tight group-hover:text-primary transition-colors">PhishGuard Primed...</h3>
                <p className="text-[13px] text-muted-foreground max-w-xs mx-auto leading-relaxed opacity-70">
                  The neural network is ready. Submit a suspicious artifact to begin deep-vector phishing analysis.
                </p>
              </div>

              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1 h-1 bg-primary rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center space-y-6"
            >
              <div className="score-circle-outer animate-pulse">
                <div className="score-circle-progress animate-spin" />
                <div className="text-xs font-mono uppercase opacity-40">Scanning</div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-heading italic">Analyzing Patterns</h3>
                <p className="text-sm text-muted-foreground">Evaluating social engineering markers and infrastructure...</p>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-4"
            >
              <AlertTriangle className="w-12 h-12 text-primary" />
              <div className="space-y-2">
                <h3 className="text-xl font-heading italic text-primary">Analysis Interrupted</h3>
                <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
              </div>
            </motion.div>
          )}

          {analysis && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Header Analysis Row */}
              <div className="flex flex-col md:flex-row items-start gap-10 border-b border-border pb-10">
                <div className="flex flex-col items-center gap-6">
                  <div className="score-circle-outer">
                    <div 
                      className="score-circle-progress" 
                      style={{ 
                        transform: `rotate(${(analysis.riskScore / 100) * 360}deg)`,
                        borderBottomColor: analysis.riskScore > 50 ? 'var(--color-primary)' : 'transparent',
                        borderRightColor: analysis.riskScore > 25 ? 'var(--color-primary)' : 'transparent',
                      }} 
                    />
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-4xl font-heading font-light">{analysis.riskScore}</span>
                      <span className="text-[10px] uppercase opacity-60">Risk Score</span>
                    </div>
                  </div>

                  {/* Risk Indicator Bar & Legend */}
                  <div className="w-full max-w-[180px] space-y-4">
                    <div className="relative h-2 w-full bg-border rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500/80" style={{ width: '30%' }} />
                      <div className="h-full bg-accent/80" style={{ width: '40%' }} />
                      <div className="h-full bg-primary/80" style={{ width: '30%' }} />
                      
                      {/* Current Score Marker */}
                      <motion.div 
                        initial={{ left: 0 }}
                        animate={{ left: `${analysis.riskScore}%` }}
                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className={`flex items-center justify-between text-[9px] uppercase tracking-[1px] ${analysis.riskScore >= 70 ? 'text-primary font-bold' : 'text-muted-foreground/60'}`}>
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          High Risk
                        </span>
                        <span>70-100</span>
                      </div>
                      <div className={`flex items-center justify-between text-[9px] uppercase tracking-[1px] ${analysis.riskScore >= 31 && analysis.riskScore < 70 ? 'text-accent font-bold' : 'text-muted-foreground/60'}`}>
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                          Suspicious
                        </span>
                        <span>31-69</span>
                      </div>
                      <div className={`flex items-center justify-between text-[9px] uppercase tracking-[1px] ${analysis.riskScore <= 30 ? 'text-emerald-500 font-bold' : 'text-muted-foreground/60'}`}>
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Safe
                        </span>
                        <span>0-30</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <span className="panel-label">Analysis Verdict</span>
                    <div className="space-y-2 mb-2">
                      <h2 className={`font-heading text-4xl font-light ${analysis.verdict === 'High Risk' ? 'text-primary' : analysis.verdict === 'Suspicious' ? 'text-accent' : 'text-emerald-500'}`}>
                        {analysis.verdict.toUpperCase()}
                      </h2>
                      {(analysis.verdict === 'High Risk' || analysis.verdict === 'Suspicious') && analysis.attackType && analysis.attackType !== 'None' && (
                        <div className="inline-block px-3 py-1 bg-primary/20 border border-primary/40 text-primary text-[10px] uppercase tracking-widest font-bold rounded-sm">
                          {analysis.attackType}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-sm">
                    <span className="panel-label !mb-2 text-primary">Recommended Action</span>
                    <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                      {analysis.recommendedAction}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="space-y-4">
                <span className="panel-label">Final Analyst Summary</span>
                <div className="bg-card p-6 border border-border rounded-sm">
                  <p className="text-muted-foreground text-sm leading-relaxed italic">
                    "{analysis.analystSummary}"
                  </p>
                </div>
              </div>

              {/* Indicators & Techniques Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <span className="panel-label">Threat Indicators</span>
                  <div className="space-y-3">
                    {analysis.threatIndicators.map((flag, index) => (
                      <div key={index} className="flex gap-3 text-[13px] text-muted-foreground border-l-2 border-primary pl-4 py-1">
                        <span className="text-primary font-bold">[!]</span>
                        {flag}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <span className="panel-label">Social Engineering Techniques</span>
                  <div className="flex flex-wrap gap-2">
                    {analysis.socialEngineeringTechniques.map((tech, index) => (
                      <span key={index} className="text-[10px] uppercase tracking-wider bg-secondary border border-border px-3 py-1 rounded-full text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Deep Analysis Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <span className="panel-label">Technical Analysis</span>
                  <p className="text-[13px] text-muted-foreground leading-relaxed bg-[#0d0d0d] p-5 border border-border rounded-sm">
                    {analysis.technicalAnalysis}
                  </p>
                </div>
                <div className="space-y-4">
                  <span className="panel-label">Language & Tone Analysis</span>
                  <p className="text-[13px] text-muted-foreground leading-relaxed bg-[#0d0d0d] p-5 border border-border rounded-sm">
                    {analysis.languageToneAnalysis}
                  </p>
                </div>
              </div>

              {/* Extracted Artifacts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-6 border-t border-border">
                <div className="space-y-4">
                  <span className="panel-label">Extracted URLs</span>
                  <div className="space-y-2">
                    {analysis.extractedUrls.length > 0 ? (
                      analysis.extractedUrls.map((url, index) => (
                        <div key={index} className="text-[11px] font-mono text-primary truncate bg-primary/5 px-3 py-2 border border-primary/10 rounded-sm">
                          {url}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No URLs detected.</span>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <span className="panel-label">Extracted Email Addresses</span>
                  <div className="space-y-2">
                    {analysis.extractedEmails.length > 0 ? (
                      analysis.extractedEmails.map((email, index) => (
                        <div key={index} className="text-[11px] font-mono text-accent truncate bg-accent/5 px-3 py-2 border border-accent/10 rounded-sm">
                          {email}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground italic">No email addresses detected.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Recommendations Section */}
              <div className="pt-10 border-t border-border space-y-6">
                <span className="panel-label text-emerald-500">User Safety Recommendations</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {analysis.userRecommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-sm"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldAlert className="w-3 h-3 text-emerald-500" />
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">{rec}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex flex-wrap gap-4 pt-10 border-t border-border">
                <Button className="bg-primary hover:bg-primary/90 text-white uppercase tracking-wider text-[10px] h-10 px-6 rounded-sm">
                  Escalate to Tier 2
                </Button>
                <Button variant="outline" className="border-border text-foreground uppercase tracking-wider text-[10px] h-10 px-6 rounded-sm">
                  Generate PDF Report
                </Button>
                <Button variant="outline" className="border-border text-foreground uppercase tracking-wider text-[10px] h-10 px-6 rounded-sm">
                  Archive Case
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
