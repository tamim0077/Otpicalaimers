import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useEffect, useRef } from "react";
import type {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";

import { DnaScene } from "~/components/dna-scene";
import landingStylesUrl from "~/styles/landing.css";
import { useOptionalUser } from "~/utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: landingStylesUrl },
];

export const meta: MetaFunction = () => ({
  title: "ExamDNA BD - তোমার ভুলই তোমার পরবর্তী প্রস্তুতি",
  description:
    "AI-চালিত SSC পরীক্ষা প্রস্তুতি: NCTB সিলেবাসে প্র্যাকটিস, মডেল টেস্ট, ভুল বিশ্লেষণ আর বাংলায় AI স্টাডি কোচ।",
  "og:title": "ExamDNA BD - তোমার ভুলই তোমার পরবর্তী প্রস্তুতি",
  "og:description":
    "AI-powered exam preparation & teacher examination platform for SSC students and teachers in Bangladesh.",
});

const FEATURES = [
  {
    icon: "🧬",
    title: "অ্যাডাপটিভ AI প্র্যাকটিস",
    body: "তোমার উত্তরের ধরন দেখে AI প্রতিবার নতুন প্রশ্ন বাছাই করে, যাতে দুর্বল জায়গাগুলো বারবার ঝালাই হয়।",
    accent: "from-blue-500/30",
  },
  {
    icon: "🎯",
    title: "ভুল বিশ্লেষণ",
    body: "কোন অধ্যায়ে, কোন ধরনের প্রশ্নে ভুল হচ্ছে, তা এক নজরে দেখো। প্রতিটা ভুল থেকেই তৈরি হয় পরের প্র্যাকটিস।",
    accent: "from-rose-500/30",
  },
  {
    icon: "🤖",
    title: "বাংলায় AI স্টাডি কোচ",
    body: "ধারণা না বুঝলে হিন্ট নাও, ধাপে ধাপে সমাধান মিলিয়ে দেখো, যখন খুশি বাংলায় প্রশ্ন করো।",
    accent: "from-violet-500/30",
  },
  {
    icon: "📝",
    title: "মডেল টেস্ট ও কাস্টম টেস্ট",
    body: "বোর্ড প্যাটার্নে টাইমড মডেল টেস্ট দাও, অথবা অধ্যায়, কঠিনতা আর প্রশ্নসংখ্যা বেছে নিজের টেস্ট বানাও।",
    accent: "from-cyan-500/30",
  },
  {
    icon: "⚔️",
    title: "বন্ধুকে চ্যালেঞ্জ",
    body: "একই প্রশ্নসেটে বন্ধুকে চ্যালেঞ্জ দাও। পড়াশোনা হোক প্রতিযোগিতার মতো মজার।",
    accent: "from-amber-500/30",
  },
  {
    icon: "🔥",
    title: "স্ট্রিক ও অগ্রগতি",
    body: "প্রতিদিনের স্ট্রিক আর অধ্যায়ভিত্তিক অগ্রগতি দেখে বুঝে নাও প্রস্তুতি কতদূর এগোল।",
    accent: "from-emerald-500/30",
  },
];

const STEPS = [
  {
    title: "পরীক্ষা দাও",
    body: "অধ্যায়ভিত্তিক বা পূর্ণ মডেল টেস্ট, মোবাইল থেকেই।",
  },
  {
    title: "AI তোমার ভুলের DNA বের করে",
    body: "কোন ধারণায় গ্যাপ আছে, AI তা খুঁজে বের করে ব্যাখ্যা দেয়।",
  },
  {
    title: "পার্সোনাল প্র্যাকটিস প্ল্যান",
    body: "ঠিক ওই দুর্বল জায়গাগুলো থেকেই আসে তোমার পরের প্রশ্ন।",
  },
];

const SUBJECTS = [
  "গণিত",
  "উচ্চতর গণিত",
  "পদার্থবিজ্ঞান",
  "রসায়ন",
  "জীববিজ্ঞান",
  "বাংলা",
  "English",
  "ICT",
  "সাধারণ বিজ্ঞান",
  "বাংলাদেশ ও বিশ্বপরিচয়",
];

const WEAK_CHAPTERS = [
  { name: "বল ও গতি", score: 42, color: "bg-rose-500" },
  { name: "রাসায়নিক বন্ধন", score: 58, color: "bg-amber-500" },
  { name: "ত্রিকোণমিতি", score: 71, color: "bg-blue-500" },
  { name: "কোষ বিভাজন", score: 86, color: "bg-emerald-500" },
];

export default function Index() {
  const user = useOptionalUser();
  const rootRef = useScrollReveal();

  return (
    <div
      ref={rootRef}
      className="landing min-h-screen overflow-x-hidden bg-slate-950 text-slate-100"
    >
      <Nav loggedIn={Boolean(user)} />

      {/* Hero */}
      <header className="hero-backdrop relative isolate flex min-h-screen items-center overflow-hidden pt-24">
        <div className="grid-floor -z-10" />
        <DnaScene className="absolute inset-0 -z-10 opacity-40 lg:opacity-100" />

        <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:px-8">
          <div className="font-bn relative z-10 max-w-xl">
            <p className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-blue-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              SSC 2027 প্রস্তুতি · NCTB সিলেবাস
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-6xl sm:leading-tight">
              তোমার ভুলই
              <br />
              <span className="text-gradient">তোমার পরবর্তী প্রস্তুতি</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-300">
              ExamDNA BD প্রতিটা ভুল থেকে শেখে। AI তোমার দুর্বল অধ্যায় খুঁজে
              বের করে, বাংলায় বুঝিয়ে দেয়, আর ঠিক সেখান থেকেই নতুন প্র্যাকটিস
              সাজায়।
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {user ? (
                <CtaLink to="/notes">ড্যাশবোর্ডে যাও →</CtaLink>
              ) : (
                <>
                  <CtaLink to="/join">ফ্রিতে শুরু করো →</CtaLink>
                  <Link
                    to="/login"
                    className="glass rounded-xl px-7 py-3.5 font-semibold text-slate-100 transition hover:bg-slate-800/70"
                  >
                    লগইন করো
                  </Link>
                </>
              )}
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 text-center sm:text-left">
              {[
                ["৳০", "শুরু করতে খরচ"],
                ["২৪/৭", "AI কোচ"],
                ["১০০%", "বাংলায়"],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="text-2xl font-bold text-white">{value}</dd>
                  <dd className="text-sm text-slate-400">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div
            className="float-stage relative hidden h-[520px] lg:block"
            aria-hidden="true"
          >
            <div className="float-card glass absolute top-6 right-0 w-64 rounded-2xl p-4 shadow-2xl">
              <p className="text-xs text-slate-400">
                প্রশ্ন ১২ · পদার্থবিজ্ঞান
              </p>
              <p className="font-bn mt-1 text-sm">
                বস্তুর ভরবেগের পরিবর্তনের হার কীসের সমান?
              </p>
              <div className="bg-emerald-500/15 mt-3 rounded-lg border border-emerald-400/40 px-3 py-1.5 text-sm text-emerald-300">
                ✓ প্রযুক্ত বল
              </div>
            </div>
            <div className="float-card glass absolute top-56 right-56 w-60 rounded-2xl p-4 shadow-2xl">
              <p className="text-xs text-rose-300">
                ⚠ দুর্বল অধ্যায় পাওয়া গেছে
              </p>
              <p className="font-bn mt-1 font-semibold">রাসায়নিক বন্ধন</p>
              <div className="mt-3 h-1.5 rounded-full bg-slate-700">
                <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-rose-500 to-amber-400" />
              </div>
            </div>
            <div className="float-card glass absolute bottom-6 right-10 w-72 rounded-2xl p-4 shadow-2xl">
              <p className="text-xs text-violet-300">🤖 AI কোচ</p>
              <p className="font-bn mt-1 text-sm text-slate-200">
                “আয়নিক বন্ধনে ইলেকট্রন <b>আদান-প্রদান</b> হয়, শেয়ার নয়। চলো
                আরেকটা প্রশ্ন দেখি!”
              </p>
            </div>
          </div>
        </div>

        <a
          href="#features"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-sm text-slate-400"
        >
          নিচে দেখো ↓
        </a>
      </header>

      {/* Subjects marquee */}
      <section
        aria-label="বিষয়সমূহ"
        className="marquee border-y border-slate-800 bg-slate-900/60 py-5"
      >
        <div className="marquee-track font-bn flex w-max gap-10 text-lg text-slate-400">
          {[...SUBJECTS, ...SUBJECTS].map((s, i) => (
            <span key={i} aria-hidden={i >= SUBJECTS.length}>
              {s} <span className="ml-10 text-blue-500">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="font-bn mx-auto max-w-7xl px-6 py-28">
        <SectionHeading
          eyebrow="ফিচার"
          title="ভালো রেজাল্টের জন্য যা যা লাগে"
          body="শুধু প্রশ্ন সমাধান নয়, বরং বুঝে শেখা। প্রতিটা ফিচার তোমার ভুলকে শক্তিতে পরিণত করার জন্য বানানো।"
        />
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <TiltCard
              key={f.title}
              className="h-full"
              style={{ transitionDelay: `${(i % 3) * 90}ms` }}
            >
              <div
                className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${f.accent} to-transparent opacity-60`}
              />
              <div className="tilt-pop relative">
                <span className="text-4xl" aria-hidden="true">
                  {f.icon}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-3 leading-relaxed text-slate-300">{f.body}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section
        id="how"
        className="font-bn relative border-y border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 py-28"
      >
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="কীভাবে কাজ করে"
            title="৩ ধাপে স্মার্ট প্রস্তুতি"
          />
          <ol className="relative mt-20 grid gap-12 md:grid-cols-3">
            <div
              aria-hidden="true"
              className="absolute top-7 left-[16%] right-[16%] hidden h-px bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400 md:block"
            />
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal className="relative text-center">
                <div className="step-orb relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-xl font-bold">
                  {["১", "২", "৩"][i]}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-slate-400">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Analytics showcase */}
      <section className="font-bn mx-auto grid max-w-7xl items-center gap-16 px-6 py-28 lg:grid-cols-2">
        <div data-reveal>
          <SectionHeading
            align="left"
            eyebrow="ভুল বিশ্লেষণ"
            title="কোথায় পিছিয়ে আছো, এক নজরে দেখো"
            body="প্রতিটা পরীক্ষার পর ExamDNA অধ্যায়ভিত্তিক স্কোর হিসাব করে। লাল মানে আরও প্র্যাকটিস দরকার, আর সবুজ হওয়া পর্যন্ত AI তোমার পাশে থাকে।"
          />
          <ul className="mt-8 space-y-3 text-slate-300">
            {[
              "অধ্যায় ও টপিক অনুযায়ী দুর্বলতা",
              "প্রতিটা ভুলের ব্যাখ্যা বাংলায়",
              "সময়ের সাথে উন্নতির গ্রাফ",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-sm text-emerald-400">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="dash-stage" data-reveal aria-hidden="true">
          <div className="dash glass rounded-3xl p-6 shadow-[0_40px_120px_-30px_rgba(59,130,246,0.6)]">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-white">আমার প্রস্তুতি</p>
              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-300">
                🔥 ১২ দিনের স্ট্রিক
              </span>
            </div>
            <div className="mt-6 space-y-5">
              {WEAK_CHAPTERS.map((c) => (
                <div key={c.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="text-slate-300">{c.name}</span>
                    <span className="text-slate-400">{toBn(c.score)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-800">
                    <div
                      className={`bar-fill h-full rounded-full ${c.color}`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                ["২৪০", "প্রশ্ন"],
                ["৭৮%", "সঠিক"],
                ["+১৮%", "উন্নতি"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-xl bg-slate-800/70 p-3">
                  <p className="text-lg font-bold text-white">{v}</p>
                  <p className="text-xs text-slate-400">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Teachers */}
      <section className="font-bn mx-auto max-w-7xl px-6 pb-28">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-900/40 via-slate-900 to-blue-900/40 p-10 md:p-14"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-violet-300">
                শিক্ষকদের জন্য
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                ক্লাসের পরীক্ষা নিন মিনিটেই
              </h2>
              <p className="mt-4 max-w-xl text-slate-300">
                ব্যাচ তৈরি করুন, অনুমোদিত প্রশ্নব্যাংক থেকে পরীক্ষা সাজান, আর
                ক্লাসের সামগ্রিক অ্যানালিটিক্স ও রিপোর্ট দেখুন। কোন শিক্ষার্থীর
                কোথায় সাহায্য দরকার, তা সহজেই বুঝবেন।
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-4 text-sm">
              {[
                "ব্যাচ ম্যানেজমেন্ট",
                "পরীক্ষা তৈরি",
                "ক্লাস অ্যানালিটিক্স",
                "রিপোর্ট",
              ].map((t) => (
                <li
                  key={t}
                  className="glass rounded-xl px-4 py-5 text-center text-slate-200"
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="font-bn relative overflow-hidden border-t border-slate-800 py-28 text-center">
        <div className="absolute inset-x-0 top-0 mx-auto h-64 max-w-3xl rounded-full bg-blue-600/20 blur-3xl" />
        <div data-reveal className="relative mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            আজই শুরু হোক{" "}
            <span className="text-gradient">স্মার্ট প্রস্তুতি</span>
          </h2>
          <p className="mt-5 text-lg text-slate-300">
            ফ্রি অ্যাকাউন্ট খোলো, প্রথম টেস্ট দাও, আর দেখো তোমার প্রস্তুতির DNA।
          </p>
          <div className="mt-10 flex justify-center">
            <CtaLink to={user ? "/notes" : "/join"}>
              {user ? "ড্যাশবোর্ডে যাও →" : "ফ্রি অ্যাকাউন্ট খোলো →"}
            </CtaLink>
          </div>
        </div>
      </section>

      <footer className="font-bn border-t border-slate-800 py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} ExamDNA BD · তোমার ভুলই তোমার পরবর্তী
        প্রস্তুতি
      </footer>
    </div>
  );
}

function Nav({ loggedIn }: { loggedIn: boolean }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 text-sm">
            🧬
          </span>
          ExamDNA <span className="text-blue-400">BD</span>
        </Link>
        <div className="font-bn hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="hover:text-white">
            ফিচার
          </a>
          <a href="#how" className="hover:text-white">
            কীভাবে কাজ করে
          </a>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {loggedIn ? (
            <Link
              to="/notes"
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-slate-300 hover:text-white"
              >
                Log in
              </Link>
              <Link
                to="/join"
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold hover:bg-blue-500"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function CtaLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="font-bn rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:shadow-blue-500/50"
    >
      {children}
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  body?: string;
  align?: "center" | "left";
}) {
  const center = align === "center";
  return (
    <div
      data-reveal={center ? "" : undefined}
      className={center ? "mx-auto max-w-2xl text-center" : ""}
    >
      <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
        {title}
      </h2>
      {body ? <p className="mt-4 text-lg text-slate-400">{body}</p> : null}
    </div>
  );
}

function TiltCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 16}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const onLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--rx", "0deg");
    e.currentTarget.style.setProperty("--ry", "0deg");
  };
  return (
    <div data-reveal style={style} className={className}>
      <div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="tilt relative h-full rounded-2xl border border-slate-800 bg-slate-900/80 p-7"
      >
        <div className="tilt-glare pointer-events-none absolute inset-0 rounded-2xl" />
        {children}
      </div>
    </div>
  );
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    root.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    root.classList.add("reveal-ready");
    return () => io.disconnect();
  }, []);
  return ref;
}

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
function toBn(n: number) {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}
