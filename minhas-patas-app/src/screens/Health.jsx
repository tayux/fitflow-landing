import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, IconBtn, PetHeader } from '../components/Shared.jsx';
import { maskDate, todayStr } from '../utils/dateUtils.js';

const TABS = ['Timeline','Exames','Alergias','Cirurgias'];

const TYPE_CONFIG = {
  Exame:    { color:T.tintSkyInk,  bg:T.tintSky,   emoji:'🔬' },
  Alergia:  { color:'#B45309',      bg:'#FEF3C7',   emoji:'⚠️' },
  Cirurgia: { color:'#B45309',      bg:'#FEF3C7',   emoji:'🏥' },
  Consulta: { color:T.brand,        bg:T.brandSoft, emoji:'🩺' },
};

const inputStyle = {
  width:'100%', border:'none', outline:'none', background:'transparent',
  fontSize:14, color:T.ink, fontFamily:FONT_BODY,
};

function AddForm({ initialType = 'Exame', onSave, onCancel }) {
  const [type, setType]   = useState(initialType);
  const [title, setTitle] = useState('');
  const [date, setDate]   = useState(todayStr());
  const [vet, setVet]     = useState('');
  const [severity, setSev] = useState('Leve');
  const [notes, setNotes] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [attachName, setAttachName] = useState('');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAttachName(file.name);
    const reader = new FileReader();
    reader.onload = ev => setAttachment(ev.target.result);
    reader.readAsDataURL(file);
  };

  const types = ['Exame','Alergia','Cirurgia'];

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onCancel()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px', maxHeight:'85vh', overflowY:'auto' }}>
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, marginBottom:16 }}>
          Novo registro de saúde
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {types.map(t => (
            <div key={t} onClick={() => setType(t)} style={{
              flex:1, textAlign:'center', padding:'10px 0', borderRadius:14,
              background: type===t ? T.brandSoft : T.surface,
              border: `1.5px solid ${type===t ? T.brand : 'transparent'}`,
              fontSize:12, fontWeight:700, color: type===t ? T.brand : T.inkSoft,
              cursor:'pointer' }}>{t}</div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Título</div>
            <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
              <input style={inputStyle} placeholder={
                type==='Exame' ? 'Ex: Hemograma completo...' :
                type==='Alergia' ? 'Ex: Alergia a frango...' : 'Ex: Castração...'
              } value={title} onChange={e => setTitle(e.target.value)} autoFocus />
            </div>
          </div>
          {type !== 'Alergia' && (
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Data</div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px', display:'flex', gap:8 }}>
                <span>📅</span>
                <input style={inputStyle} placeholder="dd/mm/aaaa"
                  value={date} onChange={e => setDate(maskDate(e.target.value))} inputMode="numeric" />
              </div>
            </div>
          )}
          {type === 'Alergia' && (
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Gravidade</div>
              <div style={{ display:'flex', background:T.bgWash, borderRadius:14, padding:3, gap:3 }}>
                {['Leve','Moderada','Grave'].map(s => {
                  const a = severity === s;
                  return (
                    <div key={s} onClick={() => setSev(s)} style={{
                      flex:1, textAlign:'center', padding:'10px 0', borderRadius:11,
                      background: a ? T.surface : 'transparent',
                      fontWeight: a?700:500, fontSize:13, color: a?T.ink:T.inkSoft,
                      cursor:'pointer' }}>{s}</div>
                  );
                })}
              </div>
            </div>
          )}
          {type !== 'Alergia' && (
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
                {type === 'Cirurgia' ? 'Veterinário / Clínica' : 'Veterinário (opcional)'}
              </div>
              <div style={{ background:T.bgWash, borderRadius:14, padding:'13px 16px' }}>
                <input style={inputStyle} placeholder="Dr. Ana, Clínica PetCare..."
                  value={vet} onChange={e => setVet(e.target.value)} />
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
              Observações (opcional)
            </div>
            <textarea style={{ width:'100%', minHeight:60, background:T.bgWash, borderRadius:14,
              padding:'13px 16px', fontSize:14, color:T.ink, fontFamily:FONT_BODY,
              border:'none', outline:'none', resize:'none', boxSizing:'border-box' }}
              placeholder="Resultado, recomendações..."
              value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>
              Anexar resultado (opcional)
            </div>
            <label style={{ display:'flex', alignItems:'center', gap:10, background:T.bgWash,
              borderRadius:14, padding:'13px 16px', cursor:'pointer' }}>
              <span style={{ fontSize:18 }}>📎</span>
              <span style={{ fontSize:13, color: attachName ? T.ink : T.inkSoft, flex:1 }}>
                {attachName || 'Selecionar imagem ou PDF'}
              </span>
              <input type="file" accept="image/*,application/pdf" onChange={handleFile}
                style={{ display:'none' }} />
            </label>
          </div>
        </div>
        <div style={{ display:'flex', gap:12, marginTop:20 }}>
          <button onClick={onCancel} style={{ flex:1, height:48, borderRadius:99,
            background:T.surface, color:T.ink, border:'none',
            fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Cancelar
          </button>
          <button onClick={() => title.trim() && onSave({ type, title, date, vet, severity, notes, attachmentBase64: attachment, attachName })}
            style={{ flex:1.5, height:48, borderRadius:99,
              background:T.brand, color:'#fff', border:'none',
              fontSize:14, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ record, onClose }) {
  const cfg = TYPE_CONFIG[record.type] || TYPE_CONFIG.Exame;
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ fontSize:36 }}>{cfg.emoji}</div>
          <div>
            <div style={{ display:'inline-flex', padding:'3px 10px', borderRadius:99,
              background:cfg.bg, color:cfg.color, fontSize:11, fontWeight:700, marginBottom:4 }}>
              {record.type}
            </div>
            <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>{record.title}</div>
          </div>
        </div>
        {record.date && (
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>📅 Data:</span>
            <span style={{ fontSize:13, color:T.ink }}>{record.date}</span>
          </div>
        )}
        {record.vet && (
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>👩‍⚕️ Vet:</span>
            <span style={{ fontSize:13, color:T.ink }}>{record.vet}</span>
          </div>
        )}
        {record.severity && record.type === 'Alergia' && (
          <div style={{ display:'flex', gap:8, marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>⚠️ Gravidade:</span>
            <span style={{ fontSize:13, color:T.ink }}>{record.severity}</span>
          </div>
        )}
        {record.notes && (
          <div style={{ background:T.bgWash, borderRadius:14, padding:'12px 16px', marginTop:4 }}>
            <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, marginBottom:4 }}>Observações</div>
            <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{record.notes}</div>
          </div>
        )}
        {record.attachmentBase64 && (
          <div style={{ marginTop:12 }}>
            <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, marginBottom:6 }}>Anexo</div>
            {record.attachmentBase64.startsWith('data:image') ? (
              <img src={record.attachmentBase64} alt="anexo"
                style={{ width:'100%', borderRadius:14, objectFit:'contain', maxHeight:220 }} />
            ) : (
              <a href={record.attachmentBase64} download={record.attachName || 'documento.pdf'}
                style={{ display:'flex', alignItems:'center', gap:10, background:T.bgWash,
                  borderRadius:14, padding:'12px 16px', textDecoration:'none' }}>
                <span style={{ fontSize:20 }}>📄</span>
                <span style={{ fontSize:13, fontWeight:600, color:T.brand }}>
                  {record.attachName || 'Baixar PDF'}
                </span>
              </a>
            )}
          </div>
        )}
        <button onClick={onClose} style={{ width:'100%', height:48, borderRadius:99, marginTop:20,
          background:T.surface, color:T.ink, border:'none',
          fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default function Health() {
  const { back } = useNav();
  const { activePet, healthRecords, addHealthRecord } = usePet();
  const [tab, setTab]     = useState('Timeline');
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('Exame');
  const [fabOpen, setFabOpen] = useState(false);
  const [detail, setDetail] = useState(null);

  const openFab = (type) => { setFormType(type); setShowForm(true); setFabOpen(false); };
  const handleSave = (rec) => { addHealthRecord(rec); setShowForm(false); };

  if (!activePet) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'center', gap:16, padding:32, textAlign:'center' }}>
        <div style={{ fontSize:52 }}>🩺</div>
        <div style={{ fontWeight:800, fontSize:18, color:T.ink, fontFamily:FONT_BODY }}>Sem histórico de saúde</div>
        <div style={{ fontSize:14, color:T.inkSoft, fontFamily:FONT_BODY, maxWidth:260, lineHeight:1.5 }}>
          Cadastre um pet para registrar o histórico de saúde.
        </div>
      </div>
    </div>
  );

  const tabFiltered = tab === 'Timeline' ? healthRecords
    : healthRecords.filter(r => r.type === (tab === 'Exames' ? 'Exame' : tab === 'Alergias' ? 'Alergia' : 'Cirurgia'));

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg, position:'relative' }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:17, fontWeight:700, color:T.ink, flex:1 }}>Saúde & Exames</div>
        <PetHeader />
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', padding:'16px 20px 0', gap:4, overflowX:'auto' }}>
        {TABS.map(t => (
          <div key={t} onClick={() => setTab(t)} style={{
            padding:'7px 16px', borderRadius:99, flexShrink:0, cursor:'pointer',
            fontSize:13, fontWeight: tab===t?700:500,
            color: tab===t?T.brand:T.inkSoft,
            background: tab===t?T.brandSoft:'transparent',
            fontFamily:FONT_BODY }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ height:1, background:T.hairline, margin:'8px 0 0' }} />

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 96px' }}>
        {tabFiltered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px' }}>
            <div style={{ fontSize:52 }}>🩺</div>
            <div style={{ fontWeight:700, fontSize:16, color:T.ink, marginTop:12 }}>
              Nenhum registro ainda
            </div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:4, maxWidth:240, margin:'8px auto 0' }}>
              {tab === 'Timeline'
                ? 'Use o botão + para adicionar exames, alergias ou cirurgias.'
                : `Adicione o primeiro registro de ${tab.toLowerCase()}.`}
            </div>
          </div>
        ) : (
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', left:23, top:8, bottom:0, width:2,
              background:T.brandSoft }} />
            {tabFiltered.map((ev, i) => {
              const cfg = TYPE_CONFIG[ev.type] || TYPE_CONFIG.Exame;
              return (
                <div key={ev.id || i} onClick={() => setDetail(ev)}
                  style={{ display:'flex', gap:16, marginBottom:28, cursor:'pointer' }}>
                  <div style={{ width:16, height:16, borderRadius:8, background:T.brand,
                    marginTop:4, flexShrink:0, position:'relative', zIndex:1,
                    boxShadow:`0 0 0 4px ${T.brandSoft}` }} />
                  <div style={{ flex:1, background:T.surface, borderRadius:16, padding:'12px 14px',
                    boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
                    <div style={{ fontSize:11, fontWeight:600, color:T.inkSoft, marginBottom:4 }}>
                      {ev.date || '—'}
                    </div>
                    <div style={{ display:'inline-flex', padding:'3px 10px', borderRadius:99,
                      background:cfg.bg, color:cfg.color,
                      fontSize:11, fontWeight:700, marginBottom:6 }}>{ev.type}</div>
                    <div style={{ fontSize:14, fontWeight:600, color:T.ink }}>{ev.title}</div>
                    {ev.vet && <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>👩‍⚕️ {ev.vet}</div>}
                    {ev.notes && <div style={{ fontSize:12, color:T.inkMute, marginTop:4, fontStyle:'italic' }}>
                      {ev.notes.slice(0, 80)}{ev.notes.length > 80 ? '…' : ''}
                    </div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB with options */}
      {fabOpen && (
        <div style={{ position:'absolute', bottom:96, right:20, display:'flex', flexDirection:'column',
          alignItems:'flex-end', gap:10, zIndex:100 }}>
          {[
            { type:'Exame',    label:'Exame',    emoji:'🔬' },
            { type:'Alergia',  label:'Alergia',  emoji:'⚠️' },
            { type:'Cirurgia', label:'Cirurgia', emoji:'🏥' },
          ].map(o => (
            <div key={o.type} onClick={() => openFab(o.type)}
              style={{ display:'flex', alignItems:'center', gap:10, background:T.bg,
                borderRadius:99, padding:'10px 16px 10px 12px',
                boxShadow:'0 4px 16px rgba(20,20,30,0.15)', cursor:'pointer' }}>
              <span style={{ fontSize:18 }}>{o.emoji}</span>
              <span style={{ fontSize:14, fontWeight:700, color:T.ink }}>{o.label}</span>
            </div>
          ))}
        </div>
      )}
      {fabOpen && (
        <div onClick={() => setFabOpen(false)}
          style={{ position:'fixed', inset:0, zIndex:99 }} />
      )}
      <div onClick={() => setFabOpen(v => !v)}
        style={{ position:'absolute', bottom:24, right:20, width:56, height:56, borderRadius:28,
          background: fabOpen ? T.inkSoft : T.ink, color:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center',
          cursor:'pointer', boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)',
          fontSize:28, transition:'background 0.2s, transform 0.2s',
          transform: fabOpen ? 'rotate(45deg)' : 'none', zIndex:101 }}>+</div>

      {showForm && <AddForm initialType={formType} onSave={handleSave} onCancel={() => setShowForm(false)} />}
      {detail && <DetailModal record={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
