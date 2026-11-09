import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Honest conversations",
    description: "Give people a comfortable way to share what they really think.",
  },
  {
    icon: ShieldCheck,
    title: "Stay anonymous",
    description: "Messages are sent without revealing who wrote them.",
  },
  {
    icon: Sparkles,
    title: "Make it yours",
    description: "Create your profile and share your personal message link.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center px-6 pb-20 pt-16 sm:pt-24">
      <section className="w-full max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
            <MessageCircle className="size-4 text-primary" aria-hidden="true" />
            A little more honesty, a little less pressure
          </div>
          <h1 className="font-heading text-5xl font-semibold tracking-tight sm:text-7xl">
            Say it <span className="text-primary">anonymously.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Create your own link and let friends send you honest messages. No
            names, no pressure — just the thoughts they want to share.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
            >
              Create your account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              I already have an account
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="mb-4 inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="mt-2 leading-6 text-muted-foreground">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
