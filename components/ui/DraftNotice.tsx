/** Banner for legal drafts pending review. Remove once counsel has approved the text. */
export function DraftNotice({ lastUpdated }: { lastUpdated: string }) {
  return (
    <div
      role="note"
      className="mb-10 flex flex-col gap-1 rounded-2xl border border-amber/30 bg-amber/10 px-5 py-4 text-sm text-text"
    >
      <p className="font-medium">Draft, pending legal review.</p>
      <p className="text-muted">
        This text was prepared as a starting point and has not yet been
        reviewed by legal counsel. Last updated {lastUpdated}.
      </p>
    </div>
  );
}
