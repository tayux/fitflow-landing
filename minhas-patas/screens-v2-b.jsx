// MinhasPatas v2 — Screens 3-4: Medications, AI Reader

// ── 03 · Medications list ──────────────────────────────────────
function V2Meds() {
  const { nav, back } = useNavV2();
  const [filter, setFilter] = React.useState('Ativos');
  const [meds, setMeds] = React.useState([
    { name:'Prednisolona',     dose:'10mg · 1x ao dia',       next:'15:00', emoji:'💊', tint: T.tintLavender, on:true },
    { name:'Apoquel',          dose:'16mg · diário',          next:'08:00', emoji:'💊', tint: T.tintLavender, on:true, late:true },
    { name:'Protetor hepático',dose:'2.5ml · 2x ao dia',      next:'21:00', emoji:'🧴', tint: T.tintSky,      on:true },
    { name:'Suplemento Ômega', dose:'1 cápsula · diário',     next:'12:00', emoji:'🐟', tint: T.tintPeach,    on:true },
    { name:'Antibiótico',      dose:'500mg · 3x ao dia',      next:'amanhã 07:00', emoji:'💊', tint: T.tintMint, on:false },
  ]);
  const filtered = filter === 'Concluídos' ? [] : meds;
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background: T.bg, position:'relative'}}>
      <div style={{padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 8}}>
        <IconButton icon={I2.chevL} onClick={back}/>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:11, color:T.inkMute, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase'}}>pet</div>
          <div style={{fontSize:14, fontWeight:700, color:T.ink, display:'flex', alignItems:'center', gap:4}}>
            Leia <Icon2 d={I2.chevD} size={12} color={T.inkSoft} stroke={2.2}/>
          </div>
        </div>
        <IconButton icon={I2.plus}/>
      </div>

      <div style={{padding:'24px 24px 0'}}>
        <Eyebrow>Medicamentos</Eyebrow>
        <Display size={44} weight={400} style={{marginTop: 8}}>
          Tratamento<br/><span style={{fontStyle:'italic'}}>da Leia</span>
        </Display>
        <div style={{fontSize:14, color:T.inkSoft, marginTop:10}}>
          5 ativos · próxima dose às 15:00
        </div>
      </div>

      <div style={{display:'flex', gap:8, padding:'22px 24px 4px', overflowX:'auto'}}>
        {[{l:'Ativos',n:5},{l:'Concluídos',n:12},{l:'Todos',n:17}].map((f,i)=>{
          const a = filter === f.l;
          return (
          <div key={i} onClick={() => setFilter(f.l)} style={{
            padding:'8px 14px', borderRadius: 99, fontWeight: 600, fontSize: 13, flexShrink: 0,
            background: a ? T.ink : T.surface, color: a ? '#fff' : T.ink,
            display:'flex', alignItems:'center', gap: 6, cursor:'pointer',
            boxShadow: a ? 'none' : '0 1px 2px rgba(20,20,30,0.04)',
            transition: 'background 0.15s, color 0.15s',
          }}>
            {f.l}
            <span style={{
              padding:'1px 7px', borderRadius: 99, fontSize: 11,
              background: a ? 'rgba(255,255,255,0.18)' : T.bgWash,
              color: a ? '#fff' : T.inkSoft,
            }}>{f.n}</span>
          </div>
          );
        })}
      </div>

      <div style={{padding:'18px 24px 0'}}>
        <SectionPill icon="⏱️" label="Ativos" count={5} tint={T.tintLavender} ink={T.tintLavenderInk}/>
      </div>

      <div style={{flex:1, overflow:'auto', padding:'14px 24px 96px', display:'flex', flexDirection:'column', gap:8}}>
        {filtered.length === 0 ? (
          <div style={{textAlign:'center', padding:'48px 20px', color: T.inkMute}}>
            <div style={{fontSize: 40}}>🎉</div>
            <div style={{fontWeight: 700, color: T.ink, marginTop: 8}}>Nenhum tratamento concluído</div>
            <div style={{fontSize: 13, marginTop: 4}}>Medicamentos finalizados aparecerão aqui.</div>
          </div>
        ) : filtered.map((m,i)=>(
          <Card2 key={i} pad={14} radius={20}>
            <div style={{display:'flex', alignItems:'center', gap: 14}}>
              <EmojiCircle emoji={m.emoji} size={42} tint={m.tint}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:6, flexWrap:'wrap'}}>
                  <span style={{fontWeight: 700, fontSize: 15, color: T.ink}}>{m.name}</span>
                  {m.late && <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform:'uppercase',
                    padding:'3px 8px', borderRadius: 99, background: T.tintRose, color: T.tintRoseInk,
                  }}>atrasado</span>}
                </div>
                <div style={{fontSize: 12, color: T.inkSoft, marginTop: 2}}>{m.dose}</div>
                <div style={{fontSize: 12, color: m.late ? T.tintRoseInk : T.brand, marginTop: 6, fontWeight: 700,
                  display:'flex', alignItems:'center', gap: 4}}>
                  <Icon2 d={I2.cal} size={12} color={m.late ? T.tintRoseInk : T.brand} stroke={2}/>
                  Próx · {m.next}
                </div>
              </div>
              <div onClick={() => setMeds(meds.map((x,idx) => idx === i ? {...x, on: !x.on} : x))} style={{
                width: 40, height: 24, borderRadius: 99,
                background: m.on ? T.brand : T.bgWash, position:'relative',
                transition:'background 0.2s', cursor:'pointer',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius:'50%', background:'#fff',
                  position:'absolute', top: 2, left: m.on ? 18 : 2,
                  boxShadow:'0 1px 3px rgba(20,20,30,0.2)', transition:'left 0.2s',
                }}/>
              </div>
            </div>
          </Card2>
        ))}
      </div>

      <button onClick={() => nav('ai')} style={{
        position:'absolute', right: 22, bottom: 24,
        width: 56, height: 56, borderRadius:'50%', border:'none',
        background: T.ink, color:'#fff', cursor:'pointer',
        boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon2 d={I2.scan} size={22} color="#fff" stroke={2}/>
      </button>
    </div>
  );
}
window.V2Meds = V2Meds;

// ── 04 · AI Prescription Reader ────────────────────────────────
function V2AIReader() {
  const { nav, back } = useNavV2();
  const meds = [
    { name:'Prednisolona 10mg', use:'Reduz coceira e inflamação na pele.',
      dose:'1 comprimido · 2x ao dia · 7 dias', emoji:'💊', tint: T.tintLavender },
    { name:'Protetor hepático', use:'Apoia o fígado durante o tratamento.',
      dose:'2.5ml · 2x ao dia · 14 dias', emoji:'🧴', tint: T.tintSky },
  ];
  const schedule = [
    { time:'07h', label:'Manhã',  emoji:'🌅', tint: T.tintPeach,    med:'Prednisolona' },
    { time:'15h', label:'Tarde',  emoji:'☀️', tint: T.tintCream,    med:'Prednisolona + Protetor' },
    { time:'23h', label:'Noite',  emoji:'🌙', tint: T.tintLavender, med:'Protetor' },
  ];
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background: T.bg}}>
      <div style={{padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 8}}>
        <IconButton icon={I2.chevL} onClick={back}/>
        <IconButton icon={I2.more}/>
      </div>

      <div style={{flex:1, overflow:'auto', padding:'18px 24px 24px'}}>
        <Eyebrow>com inteligência artificial</Eyebrow>
        <Display size={42} weight={400} style={{marginTop: 8}}>
          Receita<br/><span style={{fontStyle:'italic'}}>inteligente</span>
        </Display>
        <div style={{fontSize: 14, color: T.inkSoft, marginTop: 10, lineHeight: 1.5}}>
          Lemos sua receita e organizamos os horários pra você.
        </div>

        <Card2 pad={14} radius={22} style={{marginTop: 22, display:'flex', gap: 14, alignItems:'center'}}>
          <Stripe2 w={64} h={82} label="RX" radius={14}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{display:'flex', alignItems:'center', gap: 6}}>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 1.2, textTransform:'uppercase',
                padding:'3px 8px', borderRadius: 99, background: T.brandSoft, color: T.brand,
              }}>analisando ✨</span>
            </div>
            <div style={{fontWeight: 700, fontSize: 14, color: T.ink, marginTop: 6}}>receita-leia-12mai.pdf</div>
            <div style={{fontSize: 12, color: T.inkSoft, marginTop: 2}}>Dr. Henrique · CRMV 4821</div>
            <div style={{display:'flex', alignItems:'center', gap: 6, marginTop: 10}}>
              <div style={{flex:1, height:3, borderRadius: 99, background: T.bgWash, overflow:'hidden'}}>
                <div style={{width:'72%', height:'100%', background: T.brand, borderRadius: 99}}/>
              </div>
              <span style={{fontSize: 11, color: T.inkSoft, fontWeight: 700}}>72%</span>
            </div>
          </div>
        </Card2>

        <div style={{marginTop: 24}}>
          <SectionPill icon="💊" label="Identificados" count={2} tint={T.tintLavender} ink={T.tintLavenderInk}/>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap: 8, marginTop: 12}}>
          {meds.map((m,i)=>(
            <Card2 key={i} pad={14} radius={20}>
              <div style={{display:'flex', alignItems:'center', gap: 14}}>
                <EmojiCircle emoji={m.emoji} size={42} tint={m.tint}/>
                <div style={{flex:1}}>
                  <div style={{fontWeight: 700, fontSize: 15, color: T.ink}}>{m.name}</div>
                  <div style={{fontSize: 12, color: T.inkSoft, marginTop: 2}}>{m.dose}</div>
                </div>
              </div>
              <div style={{
                marginTop: 12, padding:'12px 14px',
                background: T.surfaceLo, borderRadius: 14,
                fontSize: 13, color: T.ink, lineHeight: 1.5,
              }}>
                <div style={{fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase', color:T.inkMute, marginBottom: 4}}>
                  para que serve
                </div>
                {m.use}
              </div>
            </Card2>
          ))}
        </div>

        <div style={{marginTop: 24}}>
          <SectionPill icon="✨" label="Horários sugeridos" count={3} tint={T.tintCream} ink={T.tintCreamInk}/>
        </div>
        <Card2 pad={16} radius={22} style={{marginTop: 12}}>
          <div style={{position:'relative', paddingLeft: 28}}>
            <div style={{position:'absolute', left: 17, top: 8, bottom: 8, width: 2,
              background: `repeating-linear-gradient(180deg, ${T.inkFaint} 0 4px, transparent 4px 8px)`}}/>
            {schedule.map((s,i)=>(
              <div key={i} style={{display:'flex', alignItems:'center', gap: 14, padding:'8px 0', position:'relative'}}>
                <div style={{position:'absolute', left: -28}}>
                  <EmojiCircle emoji={s.emoji} size={36} tint={s.tint} style={{boxShadow:`0 0 0 4px ${T.surface}`}}/>
                </div>
                <div style={{flex:1, marginLeft: 18}}>
                  <div style={{display:'flex', alignItems:'baseline', gap: 6}}>
                    <span style={{fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: 22, color: T.ink}}>{s.time}</span>
                    <span style={{fontSize: 12, color: T.inkSoft}}>· {s.label}</span>
                  </div>
                  <div style={{fontSize: 13, color: T.inkSoft, marginTop: 2}}>{s.med}</div>
                </div>
              </div>
            ))}
          </div>
        </Card2>

        <button onClick={() => nav('today')} style={{
          marginTop: 22, width:'100%', height: 56, borderRadius: 99, border:'none',
          background: T.ink, color:'#fff', fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600,
          display:'flex', alignItems:'center', justifyContent:'center', gap: 8, cursor:'pointer',
        }}>
          Ativar agenda completa
          <Icon2 d={I2.arrow} size={16} color="#fff" stroke={2}/>
        </button>
        <div style={{textAlign:'center', fontSize: 12, color: T.inkMute, marginTop: 10}}>
          Você pode ajustar horários a qualquer momento.
        </div>
      </div>
    </div>
  );
}
window.V2AIReader = V2AIReader;
