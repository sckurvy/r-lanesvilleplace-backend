// regex-based slur filter
const bannedPatterns = [
  // n-word variants (hard + soft, leetspeak, symbols)
  /\b(n[\W_]*[i1!|][\W_]*[gq9]{2,}[\W_]*[e3][\W_]*[r]+)\b/gi,
  /\b(n[\W_]*[i1!|][\W_]*[gq9]+[\W_]*[a4]+)\b/gi,

  // f-slur
  /\b(f[\W_]*[a4@][\W_]*[gq9]{1,2}[\W_]*[o0]*[\W_]*[t7]+)\b/gi,

  // beaner
  /\b(b[\W_]*[e3][\W_]*[a4][\W_]*[n][\W_]*[e3][\W_]*[r]+)\b/gi,

  // spic
  /\b(s[\W_]*[p][\W_]*[i1!|][\W_]*[c]+)\b/gi,

  // chink
  /\b(c[\W_]*[h]+[\W_]*[i1!|][\W_]*[n][\W_]*[k]+)\b/gi,

  // gook
  /\b(g[\W_]*[o0]{2,}[\W_]*[k]+)\b/gi,

  // kike
  /\b(k[\W_]*[i1!|][\W_]*[k][\W_]*[e3]+)\b/gi,

  // raghead
  /\b(r[\W_]*[a4][\W_]*[gq9]+[\W_]*h[\W_]*[e3][\W_]*[a4][\W_]*[d]+)\b/gi,

  // sandnigger
  /\b(s[\W_]*[a4][\W_]*[n][\W_]*d[\W_]*n[\W_]*[i1!|][\W_]*[gq9]{2,}[\W_]*[e3][\W_]*[r]+)\b/gi,
];

function censor(text) {
  let safe = text;
  for (let pattern of bannedPatterns) {
    safe = safe.replace(pattern, "****");
  }
  return safe;
}
