"use client";

import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/stores/project-store";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/providers/auth-provider";
import { getActionSettings, putActionSettings } from "@/lib/api";
import { demoGet } from "@/lib/demo-data";
import type { ActionSettings } from "@/types/feedback";

export function SettingsView() {
  const active = useProjectStore((s) => s.active);
  const [context, setContext] = useState("");
  const [saved, setSaved] = useState(false);
  const { show } = useToast();
  const { session, isDemo } = useAuth();

  // Action settings state
  const [actionSettings, setActionSettings] = useState<ActionSettings | null>(
    null
  );
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const storageKey = active ? `grova-ctx-${active.id}` : null;

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) setContext(saved);
    }
  }, [storageKey]);

  // Load action settings when project changes
  useEffect(() => {
    if (!active) return;
    setSettingsLoading(true);
    const token = session?.access_token || "";
    if (isDemo) {
      setActionSettings(
        demoGet(`/projects/${active.id}/action-settings`) as ActionSettings
      );
      setSettingsLoading(false);
    } else {
      getActionSettings(active.id, token)
        .then(setActionSettings)
        .catch(() => {})
        .finally(() => setSettingsLoading(false));
    }
  }, [active, session?.access_token, isDemo]);

  function handleSave() {
    if (storageKey) {
      localStorage.setItem(storageKey, context);
      setSaved(true);
      show("Context saved");
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleSaveActionSettings() {
    if (!active || !actionSettings) return;
    setSettingsSaving(true);
    try {
      if (!isDemo) {
        const token = session?.access_token || "";
        const updated = await putActionSettings(active.id, actionSettings, token);
        setActionSettings(updated);
      }
      show("Action settings saved");
    } catch {
      show("Failed to save settings");
    } finally {
      setSettingsSaving(false);
    }
  }

  if (!active) return null;

  return (
    <div className="max-w-[600px]">
      {/* Project info */}
      <div className="mb-10">
        <span className="block font-mono text-micro text-text3 uppercase tracking-[0.14em] mb-4">
          Project info
        </span>
        <h2 className="font-serif text-title text-text mb-4">{active.name}</h2>
        <div className="flex flex-col gap-2">
          <InfoRow label="Source" value={active.source || "—"} />
          <InfoRow label="Mode" value={active.mode} />
          {active.api_key && (
            <InfoRow label="API Key" value={active.api_key} />
          )}
        </div>
      </div>

      {/* Triage lens */}
      <div className="mb-10">
        <span className="block font-mono text-micro text-text3 uppercase tracking-[0.14em] mb-4">
          Triage lens
        </span>
        <h2 className="font-serif text-title text-text mb-2">
          Project context
        </h2>
        <p className="font-mono text-footnote text-text2 leading-[1.7] mb-4">
          Paste your README or product description. This context is injected
          into every Cursor prompt when you approve feedback.
        </p>
        <Textarea
          id="project-ctx"
          label="Project description / README"
          placeholder={"## My App\n\nA tool for indie developers…"}
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={8}
          maxLength={5000}
          charCount
        />
        <div className="mt-4">
          <Button variant="primary" onClick={handleSave}>
            {saved ? "Saved ✓" : "Save context"}
          </Button>
        </div>
      </div>

      {/* Smart Actions settings */}
      <div>
        <span className="block font-mono text-micro text-text3 uppercase tracking-[0.14em] mb-4">
          Smart Actions
        </span>
        <h2 className="font-serif text-title text-text mb-2">
          Email settings
        </h2>
        <p className="font-mono text-footnote text-text2 leading-[1.7] mb-4">
          Configure how outbound emails are sent from Smart Actions.
        </p>

        {settingsLoading ? (
          <div className="font-mono text-footnote text-text3">Loading...</div>
        ) : actionSettings ? (
          <div className="flex flex-col gap-4">
            <Input
              id="owner-name"
              label="From name"
              placeholder="Your name or business name"
              value={actionSettings.owner_name || ""}
              onChange={(e) =>
                setActionSettings({
                  ...actionSettings,
                  owner_name: e.target.value,
                })
              }
            />
            <Input
              id="reply-to"
              label="Reply-to email"
              type="email"
              placeholder="you@example.com"
              value={actionSettings.reply_to_email || ""}
              onChange={(e) =>
                setActionSettings({
                  ...actionSettings,
                  reply_to_email: e.target.value,
                })
              }
            />
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="brand-color"
                className="font-mono text-footnote text-text2 uppercase tracking-[0.04em]"
              >
                Brand color
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="brand-color"
                  type="color"
                  value={actionSettings.brand_color || "#00c87a"}
                  onChange={(e) =>
                    setActionSettings({
                      ...actionSettings,
                      brand_color: e.target.value,
                    })
                  }
                  className="w-10 h-10 rounded border border-border cursor-pointer bg-transparent"
                />
                <span className="font-mono text-footnote text-text3">
                  {actionSettings.brand_color || "#00c87a"}
                </span>
              </div>
            </div>
            <Input
              id="review-url"
              label="Review page URL"
              placeholder="https://g.page/your-business/review"
              value={actionSettings.review_url || ""}
              onChange={(e) =>
                setActionSettings({
                  ...actionSettings,
                  review_url: e.target.value,
                })
              }
            />
            <Input
              id="escalation-email"
              label="Escalation email"
              type="email"
              placeholder="manager@example.com"
              value={actionSettings.escalation_email || ""}
              onChange={(e) =>
                setActionSettings({
                  ...actionSettings,
                  escalation_email: e.target.value,
                })
              }
            />

            {/* Follow-up toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="follow-up-enabled"
                checked={actionSettings.follow_up_enabled}
                onChange={(e) =>
                  setActionSettings({
                    ...actionSettings,
                    follow_up_enabled: e.target.checked,
                  })
                }
                className="accent-accent w-4 h-4"
              />
              <label
                htmlFor="follow-up-enabled"
                className="font-mono text-footnote text-text2"
              >
                Auto-schedule follow-up emails
              </label>
            </div>
            {actionSettings.follow_up_enabled && (
              <Input
                id="follow-up-days"
                label="Follow-up delay (days)"
                type="number"
                value={String(actionSettings.follow_up_delay_days)}
                onChange={(e) =>
                  setActionSettings({
                    ...actionSettings,
                    follow_up_delay_days: parseInt(e.target.value) || 7,
                  })
                }
              />
            )}

            <div className="mt-2">
              <Button
                variant="primary"
                onClick={handleSaveActionSettings}
                loading={settingsSaving}
              >
                Save settings
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-mono text-micro text-text3 uppercase tracking-[0.08em] w-16 shrink-0">
        {label}
      </span>
      <span className="font-mono text-footnote text-text2">{value}</span>
    </div>
  );
}
