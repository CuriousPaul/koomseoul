import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

function loadEnv(path) {
  if (!fs.existsSync(path)) return {};
  return Object.fromEntries(
    fs.readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && !line.trim().startsWith('#') && line.includes('='))
      .map((line) => {
        const idx = line.indexOf('=');
        return [line.slice(0, idx), line.slice(idx + 1).replace(/^['"]|['"]$/g, '')];
      }),
  );
}

const env = { ...loadEnv('.env.local'), ...process.env };
const url = env.VITE_SUPABASE_URL;
const anon = env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(url, anon, { auth: { persistSession: false } });
const results = [];

const direct = await supabase.from('event_submissions').select('id,contact_email').limit(1);
results.push({
  check: 'anon_select_event_submissions_blocked',
  pass: Boolean(direct.error) || (Array.isArray(direct.data) && direct.data.length === 0),
  status: direct.status,
  code: direct.error?.code || null,
  message: direct.error?.message || null,
  returnedRows: Array.isArray(direct.data) ? direct.data.length : null,
});

const view = await supabase.from('public_published_events').select('id,title,host,track').limit(1);
results.push({
  check: 'anon_select_public_published_events_allowed',
  pass: !view.error,
  status: view.status,
  code: view.error?.code || null,
  message: view.error?.message || null,
  returnedRows: Array.isArray(view.data) ? view.data.length : null,
});

const unsafeColumn = await supabase.from('public_published_events').select('contact_email').limit(1);
results.push({
  check: 'public_view_excludes_contact_email',
  pass: Boolean(unsafeColumn.error),
  status: unsafeColumn.status,
  code: unsafeColumn.error?.code || null,
  message: unsafeColumn.error?.message || null,
});

const anonUpdate = await supabase
  .from('event_submissions')
  .update({ status: 'rejected' })
  .eq('id', '00000000-0000-0000-0000-000000000000')
  .select('id');
results.push({
  check: 'anon_update_event_submissions_blocked_or_no_rows',
  pass: Boolean(anonUpdate.error) || (Array.isArray(anonUpdate.data) && anonUpdate.data.length === 0),
  status: anonUpdate.status,
  code: anonUpdate.error?.code || null,
  message: anonUpdate.error?.message || null,
  returnedRows: Array.isArray(anonUpdate.data) ? anonUpdate.data.length : null,
});

console.log(JSON.stringify(results, null, 2));
if (results.some((result) => !result.pass)) process.exit(1);
