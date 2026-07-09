import {
  Zap,
  ArrowRight,
  Clock,
  AlertCircle,
  Shuffle,
  ShieldCheck,
  Check,
  BookOpen,
  Mic,
  Calendar,
  UserCheck,
  BarChart3,
  Shield,
  Lock,
  CheckCircle,
  Globe,
  UserMinus,
  ChevronRight,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { FeatureCard } from "@/components/marketing/FeatureCard";
import { MeetingOverloadIllustration } from "@/components/marketing/MeetingOverloadIllustration";
import { TimelineConnector } from "@/components/marketing/TimelineConnector";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ProgressBar } from "@/components/ui/ProgressBar";

const frictionCards = [
  {
    icon: Clock,
    iconClass: "bg-pinky/10 text-pinky",
    title: "Hours Lost in Synthesis",
    description:
      "Teams spend up to 4 hours per week manually summarizing meetings, chasing action items, and aligning stakeholders.",
  },
  {
    icon: AlertCircle,
    iconClass: "bg-primary/10 text-primary",
    title: "Forgotten Accountability",
    description:
      "Over 37% of critical decisions made during live meetings are documented incorrectly or fail to get assigned to roles.",
  },
  {
    icon: Shuffle,
    iconClass: "bg-secondary/10 text-secondary",
    title: "Context Fragmentation",
    description:
      "Transcripts, tasks, and calendars reside in disconnected platforms, making retrieval of historical decisions painful.",
  },
];

const capabilities = [
  {
    icon: BookOpen,
    iconClass: "bg-primary/10 text-primary",
    title: "AI Summaries",
    description:
      "Instantly extract core discussion metrics, strategic alignment notes, and critical project decisions from any sync.",
  },
  {
    icon: Mic,
    iconClass: "bg-secondary/10 text-secondary",
    title: "Transcription",
    description:
      "Highly detailed speech-to-text diarization capturing speaker identities, voice changes, and timestamps with clarity.",
  },
  {
    icon: Calendar,
    iconClass: "bg-accent/10 text-accent",
    title: "Smart Scheduling",
    description:
      "Automatic multi-calendar conflict detection and scheduling based on context, work habits, and team timezones.",
  },
  {
    icon: UserCheck,
    iconClass: "bg-pinky/10 text-pinky",
    title: "Role-Based Tasks",
    description:
      "AI tracks accountability by mapping task descriptions to designated department roles, eliminating process gaps.",
  },
  {
    icon: BarChart3,
    iconClass: "bg-purple-500/10 text-purple-400",
    title: "Meeting Analytics",
    description:
      "Comprehensive organization dashboards summarizing time allocations, focus slots, engagement, and keywords.",
  },
  {
    icon: Shield,
    iconClass: "bg-emerald-500/10 text-emerald-400",
    title: "Privacy by Design",
    description:
      "Every workspace is isolated, every recording is encrypted at rest and in transit, and retention windows are yours to configure.",
  },
];

const workflowSteps = [
  {
    step: 1,
    color: "bg-primary/20 text-primary",
    title: "Connect Platform",
    description: "Integrate Google Workspace, Microsoft Teams, or upload direct audio files.",
  },
  {
    step: 2,
    color: "bg-secondary/20 text-secondary",
    title: "Capture Meeting",
    description: "Our ambient diarization model records and distinguishes voices live.",
  },
  {
    step: 3,
    color: "bg-pinky/20 text-pinky",
    title: "AI Synthesizes",
    description: "Instantly map transcripts, project summaries, and action assignments.",
  },
  {
    step: 4,
    color: "bg-accent/20 text-accent",
    title: "Sync & Execute",
    description: "Tasks automatically route to Slack, Jira, Notion, or internal dashboards.",
  },
];

export function Home() {
  return (
    <main className="pt-32 pb-24">
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 mb-32 flex flex-col items-center text-center relative">
        <div className="absolute w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] -z-10" />
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
          <Zap className="w-3.5 h-3.5" />
          MeetWise AI v2.0 is Live
        </div>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-[72px] font-bold tracking-tight text-white mb-6 leading-tight max-w-5xl">
          Powering the Future of <span className="text-gradient">Meeting Intelligence</span>
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mb-10 leading-relaxed font-light">
          Redefining productivity with ambient AI workflows. From multi-modal speech transcription to
          instant task assignment, MeetWise AI handles the overhead so you can execute.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Button href="/login" icon={<ArrowRight className="w-5 h-5" />}>
            Start Processing Free
          </Button>
          <a
            href="#problem"
            className="bg-surface-card border border-white/10 px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all flex items-center gap-2 text-white"
          >
            See the Journey
          </a>
        </div>

        {/* Live product preview instead of a static screenshot */}
        <div className="relative w-full max-w-5xl rounded-2xl p-3 bg-gradient-to-b from-white/10 to-white/0 border border-white/10 shadow-2xl shadow-primary/5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-xl bg-surface p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <GlassCard padding="md" className="sm:col-span-2 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-400">Q4 STRATEGY SYNC — LIVE</span>
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                "...so if we split the release into two smaller pushes, design finishes the token migration
                in parallel instead of blocking on one big cutover."
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-5 h-5 rounded-full bg-pinky flex items-center justify-center text-[9px] text-white font-semibold">
                  MP
                </span>
                Maya Patel · 01:15
              </div>
            </GlassCard>
            <GlassCard padding="md" className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-gray-400">EXTRACTED ACTIONS</span>
              <div className="flex items-center gap-2 text-sm text-white">
                <Check className="w-4 h-4 text-accent" /> 3 tasks found
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <Check className="w-4 h-4 text-accent" /> 99.4% confidence
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section id="problem" className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <Reveal className="text-center lg:text-left">
            <SectionLabel className="text-pinky">The Friction</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
              The Hidden Cost of Traditional Meetings
            </h2>
            <p className="text-gray-400 mt-4">
              Unstructured conversations lead to organizational latency. Here is what modern enterprise teams
              suffer from every day:
            </p>
          </Reveal>
          <Reveal delay={0.1} className="hidden lg:block">
            <MeetingOverloadIllustration />
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {frictionCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.08}>
              <FeatureCard {...card} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* SOLUTION */}
      <section className="max-w-7xl mx-auto px-6 mb-32 relative">
        <div className="absolute w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10 left-1/2 -translate-x-1/2" />
        <Reveal>
          <GlassCard padding="xl" className="rounded-3xl flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 flex flex-col gap-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white max-w-fit">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Ambient Intelligence
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
                MeetWise AI: The Intelligent Partner for High-Performance Teams
              </h2>
              <p className="text-gray-400 leading-relaxed font-light">
                We don't just capture transcripts. We digest verbal interactions, map context, auto-route
                role-based action items, detect calendar conflicts, and deliver unified organizational
                analytics. It's like giving your enterprise its own administrative autopilot.
              </p>
              <div className="flex flex-wrap gap-4 mt-2">
                {["Real-time diarized capture", "End-to-end cloud encryption", "Active webhook sync"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-accent" /> {item}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="flex-1 relative z-10 w-full max-w-md">
              <div className="aspect-square bg-gradient-to-tr from-primary via-pinky to-secondary rounded-full filter blur-2xl opacity-20 absolute inset-0" />
              <div className="relative z-10 border border-white/10 rounded-2xl p-6 bg-surface/80 backdrop-blur-xl flex flex-col gap-4 shadow-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-400">PROCESSING SIGNAL</span>
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-accent h-full w-[72%] rounded-full" />
                </div>
                <div className="space-y-3">
                  {[
                    ["Active Speaker", "Sarah Chen", "text-white"],
                    ["Context Confidence", "99.4%", "text-accent"],
                    ["Extracted Actions", "3 Tasks Found", "text-primary"],
                  ].map(([label, value, cls]) => (
                    <div key={label} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0">
                      <span className="text-gray-400">{label}</span>
                      <span className={`${cls} font-medium`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* CORE CAPABILITIES */}
      <section id="features" className="max-w-7xl mx-auto px-6 mb-32">
        <Reveal className="text-center max-w-3xl mx-auto mb-16">
          <SectionLabel className="text-accent">System Features</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
            Intelligent Infrastructure Built to Scale
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.title} delay={(i % 3) * 0.08}>
              <FeatureCard {...cap} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <Reveal className="text-center max-w-3xl mx-auto mb-20">
          <SectionLabel>The Flow</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-2">
            Connecting Your Workspace Ecosystem
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          <TimelineConnector />
          {workflowSteps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <GlassCard className="flex flex-col items-center text-center bg-surface/90">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-4 ${s.color}`}>
                  {s.step}
                </div>
                <h4 className="font-display text-lg font-semibold text-white mb-2">{s.title}</h4>
                <p className="text-gray-400 text-xs">{s.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ANALYTICS PREVIEW */}
      <section className="max-w-7xl mx-auto px-6 mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <Reveal className="lg:col-span-5 flex flex-col gap-6">
            <SectionLabel className="text-secondary">Deep Context</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              Visualizing Your Team's Productivity
            </h2>
            <p className="text-gray-400 leading-relaxed font-light">
              Unlock patterns across all company discussions. Understand time allocations, track task
              completion percentages, monitor focus blocks, and identify key discussed keywords
              automatically parsed via NLP models.
            </p>
            <a
              href="/analytics"
              className="text-primary hover:text-white transition-all font-semibold flex items-center gap-2"
            >
              Access Analytics Suite <ChevronRight className="w-4 h-4" />
            </a>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <GlassCard className="relative overflow-hidden">
              <div className="absolute w-40 h-40 bg-secondary/10 rounded-full blur-2xl top-10 right-10" />
              <h4 className="font-display text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-accent" /> Time Allocation &amp; Sentiment
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="relative w-36 h-36 rounded-full border-[10px] border-white/5 flex items-center justify-center"
                    style={{ borderTopColor: "#8B5CF6", borderRightColor: "#3B82F6", transform: "rotate(45deg)" }}
                  >
                    <div className="absolute w-full h-full rounded-full flex items-center justify-center" style={{ transform: "rotate(-45deg)" }}>
                      <div className="text-center">
                        <span className="font-data block text-2xl font-bold text-white tabular-nums">
                          <AnimatedCounter value={82} suffix="%" />
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase">Focus Rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-primary" /> Internal</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-secondary" /> Client</span>
                  </div>
                </div>
                <div className="space-y-4 w-full">
                  <ProgressBar label="Task Completion Rate" value={94} colorClass="bg-accent" />
                  <ProgressBar label="Team Sentiment Score (×10)" value={86} colorClass="bg-primary" />
                  <ProgressBar label="Meeting Overlap Conflict" value={0} colorClass="bg-emerald-500" />
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* SECURITY */}
      <section id="security" className="max-w-7xl mx-auto px-6 mb-32">
        <Reveal>
          <GlassCard padding="xl" className="rounded-3xl relative overflow-hidden bg-gradient-to-tr from-surface via-surface to-primary/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Built for Enterprise Trust
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                  Your Data. Protected Everywhere.
                </h2>
                <p className="text-gray-400 font-light leading-relaxed">
                  Security isn't a secondary consideration — it's part of the architecture. Audio streams,
                  transcript data, calendar integrations, and platform events are encrypted and isolated by
                  design, with retention controls that stay in your hands.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { Icon: Lock, label: "AES-256 Encryption" },
                    { Icon: CheckCircle, label: "Isolated Per-Workspace Data" },
                    { Icon: Globe, label: "Configurable Retention Windows" },
                    { Icon: UserMinus, label: "Zero Data Retention Option" },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-6 h-6 rounded bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="w-72 h-72 rounded-full border border-white/5 flex items-center justify-center relative bg-surface/50">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full filter blur-xl" />
                  <div className="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center bg-background/50">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-pinky flex items-center justify-center text-white shadow-xl shadow-primary/20">
                      <Shield className="w-12 h-12" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 mb-20 text-center">
        <Reveal>
          <GlassCard padding="xl" className="rounded-3xl relative overflow-hidden bg-gradient-to-b from-surface to-background">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-primary/10 to-pinky/10 rounded-full filter blur-[100px] -z-10" />
            <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
              Redesign Your <span className="text-gradient">Meeting Culture</span> Today
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Save time and establish absolute operational accountability across all workflows. Get started
              in less than two minutes.
            </p>
            <form
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="sr-only" htmlFor="cta-email">Work email</label>
              <input
                id="cta-email"
                className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-500"
                placeholder="Enter your work email"
                type="email"
                required
              />
              <Button href="/login" variant="secondary" className="w-full sm:w-auto">
                Get Started
              </Button>
            </form>
          </GlassCard>
        </Reveal>
      </section>
    </main>
  );
}
