/**
 * Hidden field that humans never see or fill. Bots that auto-complete every
 * input trip it, and the action then returns a silent "success".
 * Off-screen rather than display:none so naive bots still render it; the
 * input is labelled and untabbable so it never reaches assistive tech users.
 */
export const HONEYPOT_FIELD = "website";

export function Honeypot() {
  const id = `${HONEYPOT_FIELD}-hp`;
  return (
    <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
      <label htmlFor={id}>Leave this field empty</label>
      <input
        id={id}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
