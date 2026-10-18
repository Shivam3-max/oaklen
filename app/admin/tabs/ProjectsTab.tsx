"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import MultiImageUploader from "@/components/MultiImageUploader";
import type { AdminData, Act, StoredProject } from "../types";

const MAX_PROJECT_IMAGES = 10;
const COVER = { w: 1600, h: 1200 };

type Draft = {
  title: string;
  location: string;
  year: string;
  summary: string;
  story: string;
  scope: string;
  cover: string;
  images: string[];
  featured: boolean;
};

const EMPTY: Draft = {
  title: "", location: "", year: String(new Date().getFullYear()),
  summary: "", story: "", scope: "", cover: "", images: [], featured: true,
};

function toDraft(p: StoredProject): Draft {
  return {
    title: p.title, location: p.location, year: p.year, summary: p.summary,
    story: p.story, scope: p.scope.join(", "), cover: p.cover,
    images: p.images, featured: p.featured,
  };
}

function toPayload(d: Draft) {
  return {
    title: d.title.trim(),
    location: d.location.trim(),
    year: d.year.trim(),
    summary: d.summary.trim(),
    story: d.story.trim(),
    scope: d.scope.split(",").map((s) => s.trim()).filter(Boolean),
    cover: d.cover,
    images: d.images,
    featured: d.featured,
  };
}

export default function ProjectsTab({ data, act }: { data: AdminData; act: Act }) {
  const projects = data.projects ?? [];
  const [editing, setEditing] = useState<string | null>(null);  // slug, or "new"
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const openNew = () => { setDraft(EMPTY); setEditing("new"); setError(null); };
  const openEdit = (p: StoredProject) => { setDraft(toDraft(p)); setEditing(p.slug); setError(null); };
  const close = () => { setEditing(null); setError(null); };

  const save = async () => {
    if (!draft.title.trim()) { setError("A project needs a title."); return; }
    setBusy(true);
    const err = editing === "new"
      ? await act({ action: "project-create", project: toPayload(draft) })
      : await act({ action: "project-update", slug: editing, patch: toPayload(draft) });
    setBusy(false);
    if (err) setError(err); else close();
  };

  const remove = async (p: StoredProject) => {
    if (!confirm(`Delete “${p.title}”? This cannot be undone.`)) return;
    setBusy(true);
    const err = await act({ action: "project-delete", slug: p.slug });
    setBusy(false);
    if (err) setError(err);
  };

  const toggleField = async (p: StoredProject, patch: Partial<StoredProject>) => {
    setBusy(true);
    const err = await act({ action: "project-update", slug: p.slug, patch });
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-brass">Delivered work</p>
          <h2 className="section-title mt-2 text-3xl">Projects</h2>
          <p className="mt-2 max-w-xl text-sm text-umber">
            These appear on the Projects page, and the ones marked <em>Featured</em> also show on the homepage.
            Everything here — photographs, title, story, scope — is yours to change.
          </p>
        </div>
        <button onClick={openNew} className="btn-solid">Add a project</button>
      </div>

      {error && <p className="mb-6 text-sm text-[#8a3a2a]">{error}</p>}

      {editing && (
        <div className="panel mb-10 p-8">
          <p className="label mb-6 text-brass">{editing === "new" ? "New project" : "Editing"}</p>

          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <label className="label mb-2 block text-[9px] text-umber">Title</label>
              <input value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="A family home" />
            </div>
            <div>
              <label className="label mb-2 block text-[9px] text-umber">Location</label>
              <input value={draft.location} onChange={(e) => set("location", e.target.value)} placeholder="Panchkula" />
            </div>
            <div>
              <label className="label mb-2 block text-[9px] text-umber">Year</label>
              <input value={draft.year} onChange={(e) => set("year", e.target.value)} placeholder="2025" />
            </div>
          </div>

          <div className="mt-6">
            <label className="label mb-2 block text-[9px] text-umber">One-line summary — shown on the card</label>
            <input value={draft.summary} onChange={(e) => set("summary", e.target.value)} placeholder="One family, one order — the whole ground floor." />
          </div>

          <div className="mt-6">
            <label className="label mb-2 block text-[9px] text-umber">The story — shown on the project page</label>
            <textarea rows={4} value={draft.story} onChange={(e) => set("story", e.target.value)} placeholder="What was delivered, and anything worth telling about how it was built." />
          </div>

          <div className="mt-6">
            <label className="label mb-2 block text-[9px] text-umber">Scope — comma separated</label>
            <input value={draft.scope} onChange={(e) => set("scope", e.target.value)} placeholder="Living room, Lounge, Dining" />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
            <div>
              <p className="label mb-3 text-[9px] text-umber">Cover photograph — {COVER.w} × {COVER.h}</p>
              <ImageUploader
                value={draft.cover}
                onChange={(url) => set("cover", url ?? "")}
                width={COVER.w}
                height={COVER.h}
                ratio="4/3"
              />
            </div>
            <div>
              <p className="label mb-3 text-[9px] text-umber">
                Gallery — up to {MAX_PROJECT_IMAGES}, any shape
              </p>
              <MultiImageUploader
                images={draft.images}
                onChange={(next) => set("images", next)}
                width={1400}
                height={1400}
                max={MAX_PROJECT_IMAGES}
              />
            </div>
          </div>

          <label className="mt-8 flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => set("featured", e.target.checked)}
              className="h-4 w-4 flex-none"
            />
            Show this project on the homepage
          </label>

          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={save} disabled={busy} className="btn-solid disabled:opacity-50">
              {busy ? "Saving…" : editing === "new" ? "Create project" : "Save changes"}
            </button>
            <button onClick={close} className="btn-line">Cancel</button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <p className="text-sm text-umber">No projects yet. Add your first one above.</p>
      ) : (
        <div className="grid gap-px border hairline bg-mist">
          {projects.map((p) => (
            <div key={p.slug} className="flex flex-wrap items-center gap-5 bg-ivory p-5">
              <div className="h-16 w-20 flex-none overflow-hidden bg-bone">
                {p.cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.cover} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-[200px] flex-1">
                <p className="font-serif text-lg leading-tight">{p.title}</p>
                <p className="mt-0.5 text-xs text-umber">
                  {[p.location, p.year].filter(Boolean).join(" · ")}
                  {p.images.length > 0 && ` · ${p.images.length + (p.cover ? 1 : 0)} photos`}
                </p>
              </div>
              <button
                onClick={() => toggleField(p, { featured: !p.featured })}
                disabled={busy}
                className={`label border px-3 py-1.5 text-[9px] transition-colors ${
                  p.featured ? "border-brass text-brass" : "hairline text-umber hover:border-espresso/40"
                }`}
              >
                {p.featured ? "On homepage" : "Not featured"}
              </button>
              <button
                onClick={() => toggleField(p, { active: !p.active })}
                disabled={busy}
                className={`label border px-3 py-1.5 text-[9px] transition-colors ${
                  p.active ? "hairline text-umber hover:border-espresso/40" : "border-[#8a3a2a] text-[#8a3a2a]"
                }`}
              >
                {p.active ? "Live" : "Hidden"}
              </button>
              <button onClick={() => openEdit(p)} className="label text-[9px] text-espresso hover:text-brass">Edit</button>
              <button onClick={() => remove(p)} className="label text-[9px] text-umber hover:text-[#8a3a2a]">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
