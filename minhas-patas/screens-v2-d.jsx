// MinhasPatas v2 — Screens 7-8: Finance, Lock notification

// Last-6-months data — each month carries totals so tapping a bar updates the
// comparison + donut + expense list below it.
const FIN_MONTHS = [
  { key:'dez', label:'Dez', short:'Dez 2025', total:  980.00, vs:  -8 },
  { key:'jan', label:'Jan', short:'Jan 2026', total: 1120.30, vs: +14 },
  { key:'fev', label:'Fev', short:'Fev 2026', total: 1890.40, vs: +69, peak:true },
  { key:'mar', label:'Mar', short:'Mar 2026', total: 1050.00, vs: -44 },
  { key:'abr', label:'Abr', short:'Abr 2026', total: 1418.40, vs: +35 },
  { key:'mai', label:'Mai', short:'Mai 2026', total: 1247.80, vs: -12, current:true },
];
window.FIN_MONTHS = FIN_MONTHS;

// ── Bar chart (6 months) ───────────────────────────────────────
function BarChart6({ months, selectedKey, peak, onSelect }) {
  const max = Math.max(...months.map(m => m.total));
  const chartH = 130;
  const barW = 28;
  const gap = 14;
  const totalW = months.length * barW + (months.length - 1) * gap;

  return (
    <div style={{marginTop: 16, paddingBottom: 4}}>
      {/* Horizontal grid lines */}
      <div style={{position:'relative', height: chartH, width: '100%'}}>
        {[0.25, 0.5, 0.75].map((p,i)=>(
          <div key={i} style={{
            position:'absolute', left: 0, right: 0, top: chartH * (1 - p),
            height: 1, background: T.hairline,
          }}/>
        ))}
        {/* Bars row */}
        <div style={{
          position:'absolute', inset: 0,
          display:'flex', justifyContent:'space-between', alignItems:'flex-end',
        }}>
          {months.map((m,i) => {
            const h = Math.max(6, (m.total / max) * (chartH - 14));
            const isSelected = m.key === selectedKey;
            const isPeak     = peak && m.key === peak.key;
            const color = isSelected ? T.ink
                        : isPeak     ? T.brand
                        :              T.bgWash;
            return (
              <div key={m.key} onClick={() => onSelect && onSelect(m.key)} style={{
                flex: 1, display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'flex-end', height:'100%',
                cursor:'pointer', position:'relative',
              }}>
                {isPeak && !isSelected && (
                  <div style={{
                    position:'absolute', top: chartH - h - 22,
                    padding:'3px 7px', borderRadius: 99,
                    background: T.brand, color:'#fff',
                    fontSize: 9, fontWeight: 800, letterSpacing: 0.6, textTransform:'uppercase',
                    whiteSpace:'nowrap',
                  }}>pico</div>
                )}
                {isSelected && (
                  <div style={{
                    position:'absolute', top: chartH - h - 26,
                    padding:'3px 8px', borderRadius: 99,
                    background: T.ink, color:'#fff',
                    fontSize: 10, fontWeight: 700,
                    whiteSpace:'nowrap',
                  }}>R$ {Math.round(m.total / 100) / 10}k</div>
                )}
                <div style={{
                  width: '78%', maxWidth: 32, height: h, borderRadius: 8,
                  background: color, transition:'all 0.25s',
                  boxShadow: isSelected ? '0 4px 12px -4px rgba(20,20,30,0.25)' : 'none',
                }}/>
              </div>
            );
          })}
        </div>
      </div>
      {/* Labels */}
      <div style={{display:'flex', justifyContent:'space-between', marginTop: 10}}>
        {months.map(m => {
          const isSelected = m.key === selectedKey;
          return (
            <div key={m.key} onClick={() => onSelect && onSelect(m.key)} style={{
              flex:1, textAlign:'center',
              fontSize: 11, fontWeight: 700,
              color: isSelected ? T.ink : T.inkMute,
              cursor:'pointer',
            }}>{m.label}</div>
          );
        })}
      </div>
    </div>
  );
}
window.BarChart6 = BarChart6;

// ── 07 · Finance ───────────────────────────────────────────────
function V2Finance() {
  const { back } = useNavV2();
  const [selectedKey, setSelectedKey] = React.useState('mai');
  const selected = FIN_MONTHS.find(m => m.key === selectedKey);
  const prevIdx  = FIN_MONTHS.findIndex(m => m.key === selectedKey) - 1;
  const previous = prevIdx >= 0 ? FIN_MONTHS[prevIdx] : null;

  const peak = FIN_MONTHS.reduce((a,b) => b.total > a.total ? b : a, FIN_MONTHS[0]);
  const avg  = FIN_MONTHS.reduce((s,m) => s + m.total, 0) / FIN_MONTHS.length;

  const segments = [
    { label:'Medicamentos', pct: 43.5, color: T.brand },
    { label:'Consultas',    pct: 30.5, color: '#5390B0' },
    { label:'Alimentação',  pct: 19.7, color: '#D4A93A' },
    { label:'Outros',       pct:  6.3, color: '#5BA890' },
  ];
  const expenses = [
    { name:'Veterinário Dr. Henrique', cat:'Consulta',    emoji:'🩺', tint: T.tintRose,     date:'12 mai', val: 280.00 },
    { name:'Prednisolona 10mg',        cat:'Medicamento', emoji:'💊', tint: T.tintLavender, date:'12 mai', val:  68.40 },
    { name:'Ração Premier sênior',     cat:'Alimentação', emoji:'🥣', tint: T.tintCream,    date:'09 mai', val: 145.90 },
    { name:'Protetor hepático',        cat:'Medicamento', emoji:'🧴', tint: T.tintSky,      date:'07 mai', val:  92.50 },
    { name:'Banho & tosa',             cat:'Outros',      emoji:'🛁', tint: T.tintMint,     date:'04 mai', val:  80.00 },
  ];
  const r = 46, circ = 2 * Math.PI * r;
  let acc = 0;

  const fmtBR = (v) => v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background: T.bg}}>
      <div style={{padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 8}}>
        <IconButton icon={I2.chevL} onClick={back}/>
        <IconButton icon={I2.search}/>
      </div>

      <div style={{flex:1, overflow:'auto', padding:'18px 24px 16px'}}>
        <Eyebrow>panorama com a Leia</Eyebrow>
        <Display size={42} weight={400} style={{marginTop: 8}}>
          Finanças
        </Display>
        <div style={{display:'flex', alignItems:'center', gap: 10, marginTop: 12, flexWrap:'wrap'}}>
          <div style={{
            display:'inline-flex', alignItems:'center', gap: 6,
            padding:'7px 14px', borderRadius: 99, background: T.surface,
            fontSize: 13, fontWeight: 600, color: T.ink,
            boxShadow:'0 1px 2px rgba(20,20,30,0.04)',
          }}>
            2026 <Icon2 d={I2.chevD} size={12} color={T.inkSoft} stroke={2.2}/>
          </div>
          <div style={{fontSize: 12, color: T.inkSoft}}>
            média mensal <strong style={{color: T.ink, fontWeight: 700}}>R$ {fmtBR(avg)}</strong>
          </div>
        </div>

        {/* ── 6-month bar chart ───────────────────────────────── */}
        <Card2 pad={18} radius={24} style={{marginTop: 18}}>
          <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap: 12}}>
            <div>
              <Eyebrow>{selected.short}</Eyebrow>
              <div style={{marginTop: 6, display:'flex', alignItems:'baseline', gap: 2}}>
                <span style={{fontFamily: FONT_DISPLAY, fontSize: 14, color: T.inkSoft}}>R$</span>
                <span style={{fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 400, color: T.ink, letterSpacing:-0.6, lineHeight: 1, marginLeft: 4}}>
                  {fmtBR(selected.total).split(',')[0]}
                </span>
                <span style={{fontFamily: FONT_DISPLAY, fontSize: 16, color: T.inkSoft}}>,{fmtBR(selected.total).split(',')[1]}</span>
              </div>
              <div style={{fontSize: 11, color: T.inkMute, marginTop: 4}}>
                toque numa barra para comparar
              </div>
            </div>
            <div style={{
              display:'inline-flex', alignItems:'center', gap: 4,
              padding:'5px 10px', borderRadius: 99,
              background: selected.vs <= 0 ? T.tintMint : T.tintRose,
              color:    selected.vs <= 0 ? T.tintMintInk : T.tintRoseInk,
              fontSize: 11, fontWeight: 800, letterSpacing: 0.3, flexShrink: 0,
              whiteSpace:'nowrap',
            }}>
              {selected.vs <= 0 ? '↓' : '↑'} {Math.abs(selected.vs)}%
            </div>
          </div>

          <BarChart6
            months={FIN_MONTHS}
            selectedKey={selectedKey}
            peak={peak}
            onSelect={setSelectedKey}
          />

          {/* Inline peak callout */}
          <div style={{
            marginTop: 14, display:'flex', alignItems:'center', gap: 10,
            padding:'10px 12px', borderRadius: 14, background: T.surfaceLo,
          }}>
            <span style={{fontSize: 18}}>📈</span>
            <div style={{flex:1, fontSize: 12, color: T.inkSoft, lineHeight: 1.4}}>
              <strong style={{color: T.ink, fontWeight: 700}}>{peak.short}</strong> foi seu mês mais caro<br/>
              <span style={{color: T.inkMute}}>R$ {fmtBR(peak.total)} · +{Math.round((peak.total/avg-1)*100)}% da média</span>
            </div>
          </div>
        </Card2>

        {/* ── Comparison card (current vs previous selected) ──── */}
        {previous && (
          <Card2 pad={16} radius={22} style={{marginTop: 12}}>
            <Eyebrow>comparativo</Eyebrow>
            <div style={{display:'flex', alignItems:'stretch', gap: 12, marginTop: 10}}>
              <div style={{flex:1}}>
                <div style={{fontSize: 11, color: T.inkMute, fontWeight: 700, textTransform:'uppercase', letterSpacing: 0.6}}>{selected.short}</div>
                <div style={{fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 400, color: T.ink, marginTop: 4, letterSpacing:-0.4}}>
                  R$ {fmtBR(selected.total).split(',')[0]}
                  <span style={{fontSize: 14, color: T.inkSoft}}>,{fmtBR(selected.total).split(',')[1]}</span>
                </div>
              </div>
              <div style={{width:1, background: T.hairline}}/>
              <div style={{flex:1}}>
                <div style={{fontSize: 11, color: T.inkMute, fontWeight: 700, textTransform:'uppercase', letterSpacing: 0.6}}>{previous.short}</div>
                <div style={{fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 400, color: T.inkSoft, marginTop: 4, letterSpacing:-0.4}}>
                  R$ {fmtBR(previous.total).split(',')[0]}
                  <span style={{fontSize: 14}}>,{fmtBR(previous.total).split(',')[1]}</span>
                </div>
              </div>
            </div>
            <div style={{marginTop: 12, fontSize: 12, color: T.inkSoft, lineHeight: 1.5}}>
              {selected.total < previous.total
                ? <>Você economizou <strong style={{color: T.tintMintInk}}>R$ {fmtBR(previous.total - selected.total)}</strong> em relação ao mês anterior 👏</>
                : <>Você gastou <strong style={{color: T.tintRoseInk}}>R$ {fmtBR(selected.total - previous.total)}</strong> a mais que no mês anterior.</>
              }
            </div>
          </Card2>
        )}

        {/* ── Donut categories ───────────────────────────────── */}
        <div style={{marginTop: 24}}>
          <SectionPill icon="🧭" label={`Categorias · ${selected.label}`} tint={T.tintLavender} ink={T.tintLavenderInk}/>
        </div>
        <Card2 pad={20} radius={22} style={{marginTop: 12, display:'flex', alignItems:'center', gap: 18}}>
          <div style={{position:'relative', width: 110, height: 110, flexShrink: 0}}>
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r={r} fill="none" stroke={T.bgWash} strokeWidth="12"/>
              {segments.map((s,i) => {
                const len = (s.pct / 100) * circ;
                const off = circ - acc;
                acc += len;
                return (
                  <circle key={i} cx="55" cy="55" r={r} fill="none"
                    stroke={s.color} strokeWidth="12"
                    strokeDasharray={`${len-2} ${circ}`}
                    strokeDashoffset={off}
                    transform="rotate(-90 55 55)" strokeLinecap="butt"/>
                );
              })}
            </svg>
            <div style={{position:'absolute', inset: 0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
              <div style={{fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 500, color: T.ink}}>4</div>
              <Eyebrow style={{fontSize: 9, marginTop: 2}}>categorias</Eyebrow>
            </div>
          </div>
          <div style={{flex:1, display:'flex', flexDirection:'column', gap: 8}}>
            {segments.map((s,i)=>(
              <div key={i} style={{display:'flex', alignItems:'center', gap: 8}}>
                <div style={{width: 10, height: 10, borderRadius: 3, background: s.color}}/>
                <span style={{flex:1, fontSize: 12, color: T.ink, fontWeight: 600}}>{s.label}</span>
                <span style={{fontSize: 12, color: T.inkSoft, fontWeight: 700}}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </Card2>

        {/* ── Recent expenses ────────────────────────────────── */}
        <div style={{marginTop: 26}}>
          <SectionPill icon="📋" label="Gastos recentes" count={5} tint={T.tintCream} ink={T.tintCreamInk}/>
        </div>
        <Card2 pad={0} radius={22} style={{marginTop: 12, overflow:'hidden'}}>
          {expenses.map((e,i)=>(
            <div key={i} style={{
              display:'flex', alignItems:'center', gap: 12, padding:'12px 14px',
              borderBottom: i < expenses.length - 1 ? `1px solid ${T.hairline}` : 'none',
            }}>
              <EmojiCircle emoji={e.emoji} size={36} tint={e.tint}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight: 700, fontSize: 14, color: T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{e.name}</div>
                <div style={{fontSize: 11, color: T.inkSoft, marginTop: 1}}>{e.cat} · {e.date}</div>
              </div>
              <div style={{fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 500, color: T.ink}}>
                {e.val.toFixed(2).replace('.', ',')}
              </div>
            </div>
          ))}
        </Card2>

        <div style={{display:'flex', gap: 10, marginTop: 18}}>
          <button style={{
            flex:1, height: 52, borderRadius: 99,
            background: T.surface, color: T.ink, border:'none',
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
            boxShadow:'0 1px 2px rgba(20,20,30,0.04)',
          }}>
            <Icon2 d={I2.download} size={16} color={T.ink} stroke={2}/>
            Exportar PDF
          </button>
          <button style={{
            flex:1.2, height: 52, borderRadius: 99,
            background: T.ink, color:'#fff', border:'none',
            fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
          }}>
            <Icon2 d={I2.plus} size={16} color="#fff" stroke={2.4}/>
            Adicionar gasto
          </button>
        </div>
      </div>
    </div>
  );
}
window.V2Finance = V2Finance;

// ── 08 · Lock screen notification ──────────────────────────────
function V2LockNotif() {
  const { nav } = useNavV2();
  return (
    <div style={{
      height:'100%', position:'relative', overflow:'hidden',
      background: `linear-gradient(170deg, #C9BEFF 0%, #B3A6FF 40%, #9E8FF7 100%)`,
    }}>
      {/* soft blobs */}
      <div style={{position:'absolute', top:-50, left:-40, width: 240, height: 240, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(255,236,210,0.6), transparent 70%)', filter:'blur(20px)'}}/>
      <div style={{position:'absolute', bottom:140, right:-60, width: 280, height: 280, borderRadius:'50%',
        background:'radial-gradient(circle, rgba(255,255,255,0.5), transparent 70%)', filter:'blur(30px)'}}/>

      {/* lock indicator */}
      <div style={{position:'absolute', top: 56, left:'50%', transform:'translateX(-50%)', color:'rgba(0,0,0,0.4)'}}>
        <svg width="14" height="18" viewBox="0 0 14 18">
          <path d="M3 8V5a4 4 0 1 1 8 0v3" stroke="currentColor" strokeWidth="1.6" fill="none"/>
          <rect x="1" y="8" width="12" height="9" rx="2" fill="currentColor"/>
        </svg>
      </div>

      {/* time + date */}
      <div style={{textAlign:'center', color: T.ink, paddingTop: 92}}>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 18, fontStyle:'italic', fontWeight: 400, opacity: 0.75, letterSpacing: 0.2}}>segunda-feira, 14 de maio</div>
        <div style={{fontFamily: FONT_DISPLAY, fontSize: 96, fontWeight: 300, lineHeight: 1, marginTop: 4, letterSpacing: -3}}>15:00</div>
      </div>

      {/* notifications */}
      <div style={{padding:'40px 14px 0'}}>
        <div onClick={() => nav('home')} style={{
          background:'rgba(255,255,255,0.78)',
          backdropFilter:'blur(28px) saturate(180%)',
          WebkitBackdropFilter:'blur(28px) saturate(180%)',
          border:'0.5px solid rgba(255,255,255,0.7)',
          borderRadius: 22, padding:'12px 14px 8px',
          boxShadow:'0 10px 40px rgba(20,10,40,0.18)',
        }}>
          <div style={{display:'flex', alignItems:'center', gap: 8, marginBottom: 8}}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, background: T.ink,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize: 12, color:'#fff', fontWeight: 800,
            }}>🐾</div>
            <span style={{fontSize: 11, fontWeight: 700, color: T.inkSoft, letterSpacing: 0.5, textTransform:'uppercase'}}>minhaspatas</span>
            <span style={{flex:1}}/>
            <span style={{fontSize: 12, color: T.inkSoft, fontWeight: 500}}>agora</span>
          </div>
          <div style={{fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 500, color: T.ink, lineHeight: 1.25}}>
            Hora do remédio da <span style={{fontStyle:'italic'}}>Leia</span>
          </div>
          <div style={{fontSize: 13, color: T.inkSoft, marginTop: 4, lineHeight: 1.45}}>
            Prednisolona 10mg — dar com comida.<br/>Deslize para confirmar.
          </div>
          <div style={{display:'flex', gap: 8, marginTop: 12, paddingTop: 10, borderTop: `1px solid rgba(0,0,0,0.06)`}}>
            <button style={{
              flex:1, height: 38, borderRadius: 12, border:'none',
              background: T.ink, color:'#fff', fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13,
              display:'flex', alignItems:'center', justifyContent:'center', gap: 6, cursor:'pointer',
            }}>
              <Icon2 d={I2.check} size={14} color="#fff" stroke={3}/> Confirmar
            </button>
            <button style={{
              flex:1, height: 38, borderRadius: 12, border:'none',
              background:'rgba(20,20,30,0.06)', color: T.ink,
              fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap: 6,
            }}>
              Adiar 15min
            </button>
          </div>
        </div>

        <div style={{
          marginTop: 8, padding:'10px 14px', borderRadius: 18,
          background:'rgba(255,255,255,0.35)',
          backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          color: T.ink,
        }}>
          <div style={{display:'flex', alignItems:'center', gap: 8}}>
            <div style={{
              width: 18, height: 18, borderRadius: 5, background:'rgba(20,20,30,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize: 10,
            }}>📅</div>
            <span style={{fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform:'uppercase', opacity: 0.7}}>Lembrete</span>
            <span style={{flex:1}}/>
            <span style={{fontSize: 11, opacity: 0.7}}>14:00</span>
          </div>
          <div style={{fontSize: 13, fontWeight: 600, marginTop: 4}}>Passeio da Leia em 1h</div>
        </div>
      </div>

      {/* bottom dock buttons */}
      <div style={{position:'absolute', bottom: 48, left: 0, right: 0,
        display:'flex', justifyContent:'space-between', padding:'0 32px'}}>
        {[
          <svg key="1" width="20" height="20" viewBox="0 0 20 20" fill={T.ink}><path d="M10 4l1.5-2h5l1.5 2A2 2 0 0119 6v9a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 011-1.7L5 4z"/><circle cx="10" cy="11" r="3" fill="#C9BEFF"/></svg>,
          <svg key="2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T.ink} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg>,
        ].map((node,k) => (
          <div key={k} style={{
            width: 50, height: 50, borderRadius:'50%',
            background:'rgba(255,255,255,0.5)', backdropFilter:'blur(16px)',
            WebkitBackdropFilter:'blur(16px)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>{node}</div>
        ))}
      </div>
    </div>
  );
}
window.V2LockNotif = V2LockNotif;
