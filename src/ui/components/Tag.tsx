import { pactLabel } from '../vocab';

export type TagKind = 'BOT' | 'AUTO' | 'BREACH' | 'HARM' | 'INSOLV';

interface Props {
  kind?: TagKind;
  /** Stored pact name such as PACT-A; shown as its youth design code label, YDC-A (spec §5.0). */
  pact?: string;
}

export function Tag({ kind, pact }: Props) {
  if (pact) return <span className="tag tag-pact">{pactLabel(pact)}</span>;
  if (!kind) return null;
  return <span className={`tag tag-${kind.toLowerCase()}`}>{kind}</span>;
}
