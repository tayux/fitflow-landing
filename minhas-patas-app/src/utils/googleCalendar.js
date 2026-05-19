// Google Calendar integration via OAuth implicit flow.
//
// Token is stored client-side and expires in ~1h. When a 401 comes back we
// drop it and the UI shows a "reconectar" state. A full refresh-token flow
// would require a server endpoint to exchange the auth code.

const TOKEN_KEY  = 'mp_gcal_token';
const EXPIRY_KEY = 'mp_gcal_expiry';
const EMAIL_KEY  = 'mp_gcal_email';
const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';

export const GOOGLE_CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar.events';

export function isCalendarConnected() {
  const token = localStorage.getItem(TOKEN_KEY);
  const expiry = parseInt(localStorage.getItem(EXPIRY_KEY) || '0', 10);
  return !!token && Date.now() < expiry;
}

export function getCalendarEmail() {
  return localStorage.getItem(EMAIL_KEY) || '';
}

export function saveCalendarSession({ access_token, expires_in, email }) {
  localStorage.setItem(TOKEN_KEY, access_token);
  localStorage.setItem(EXPIRY_KEY, String(Date.now() + (expires_in - 60) * 1000));
  if (email) localStorage.setItem(EMAIL_KEY, email);
}

export function disconnectCalendar() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  localStorage.removeItem(EMAIL_KEY);
}

function brToISODate(brDate) {
  if (!brDate) return null;
  const [d, m, y] = brDate.split('/');
  if (!d || !m || !y) return null;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
}

function buildDateTime(brDate, time) {
  const iso = brToISODate(brDate);
  if (!iso) return null;
  return `${iso}T${(time || '09:00')}:00`;
}

function addMinutesHHMM(hhmm, mins) {
  const [h, m] = hhmm.split(':').map(Number);
  const total = h * 60 + m + mins;
  const hh = String(Math.floor((total / 60) % 24)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

// Generic event creator. Returns { ok, event } or { ok:false, expired }.
async function postEvent(body) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { ok: false, error: 'not_connected' };
  try {
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.status === 401) {
      disconnectCalendar();
      return { ok: false, expired: true };
    }
    if (!res.ok) {
      const err = await res.text();
      console.warn('GCal error', res.status, err);
      return { ok: false, error: err };
    }
    const event = await res.json();
    return { ok: true, event };
  } catch (e) {
    console.warn('GCal fetch failed', e);
    return { ok: false, error: e.message };
  }
}

// --- Medication: creates one recurring daily event per time slot ---
export async function pushMedicationEvents(med, petName = '') {
  if (!isCalendarConnected()) return [];
  const times = Array.isArray(med.times) && med.times.length > 0
    ? med.times
    : ['09:00'];
  const startDate = med.startDate || (() => {
    const t = new Date();
    return `${String(t.getDate()).padStart(2,'0')}/${String(t.getMonth()+1).padStart(2,'0')}/${t.getFullYear()}`;
  })();

  const untilIso = med.endDate && !med.continuous ? brToISODate(med.endDate)?.replace(/-/g, '') : null;
  const recurrence = untilIso
    ? [`RRULE:FREQ=DAILY;UNTIL=${untilIso}T235959Z`]
    : ['RRULE:FREQ=DAILY;COUNT=180']; // ~6 months when continuous

  const results = [];
  for (const time of times) {
    const startDT = buildDateTime(startDate, time);
    const endDT   = buildDateTime(startDate, addMinutesHHMM(time, 15));
    if (!startDT || !endDT) continue;
    const r = await postEvent({
      summary: `💊 ${med.name}${petName ? ` (${petName})` : ''}`,
      description: [
        med.dose && med.unit ? `Dose: ${med.dose}${med.unit}` : null,
        med.freq ? `Frequência: ${med.freq}` : null,
        med.notes || null,
        '— criado pelo app MinhasPatas',
      ].filter(Boolean).join('\n'),
      start: { dateTime: startDT, timeZone: TZ },
      end:   { dateTime: endDT,   timeZone: TZ },
      recurrence,
      reminders: { useDefault: true },
    });
    results.push(r);
  }
  return results;
}

// --- Vaccine: single event ---
export async function pushVaccineEvent(vac, petName = '') {
  if (!isCalendarConnected()) return null;
  const date = vac.nextDate || vac.date;
  const iso = brToISODate(date);
  if (!iso) return null;
  return postEvent({
    summary: `💉 Vacina: ${vac.name}${petName ? ` (${petName})` : ''}`,
    description: [
      vac.lot ? `Lote: ${vac.lot}` : null,
      vac.vet ? `Vet: ${vac.vet}` : null,
      '— criado pelo app MinhasPatas',
    ].filter(Boolean).join('\n'),
    start: { date: iso },
    end:   { date: iso },
    reminders: {
      useDefault: false,
      overrides: [{ method: 'popup', minutes: 24 * 60 }],
    },
  });
}

// --- Vet consultation: single timed event ---
export async function pushConsultationEvent(con, petName = '') {
  if (!isCalendarConnected()) return null;
  const startDT = buildDateTime(con.date, con.time || '09:00');
  const endDT   = buildDateTime(con.date, addMinutesHHMM(con.time || '09:00', 60));
  if (!startDT || !endDT) return null;
  return postEvent({
    summary: `🩺 Consulta${petName ? ` — ${petName}` : ''}`,
    description: [
      con.vet ? `Vet: ${con.vet}` : null,
      con.clinic ? `Local: ${con.clinic}` : null,
      con.notes || null,
      '— criado pelo app MinhasPatas',
    ].filter(Boolean).join('\n'),
    start: { dateTime: startDT, timeZone: TZ },
    end:   { dateTime: endDT,   timeZone: TZ },
    reminders: { useDefault: true },
  });
}
