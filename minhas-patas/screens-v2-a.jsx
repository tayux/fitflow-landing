// MinhasPatas v2 — Screens 1-2: Onboarding, Home

// ── 01 · Onboarding ────────────────────────────────────────────
function V2Onboarding() {
  const { nav } = useNavV2();
  return (
    <div style={{
      height:'100%', display:'flex', flexDirection:'column', padding:'24px 28px 28px',
      background: `linear-gradient(180deg, #FFFFFF 0%, ${T.brandWash} 55%, ${T.brandSoft} 100%)`,
    }}>

      <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 28}}>
        <Mascot size={240}/>
        <div style={{textAlign:'center'}}>
          <Display size={48} weight={400} style={{letterSpacing: -1.4}}>
            minhas<span style={{fontStyle:'italic'}}>patas</span>
          </Display>
          <div style={{fontFamily: FONT_BODY, fontSize: 16, color: T.inkSoft, marginTop: 12, lineHeight:1.5, maxWidth: 280}}>
            A rotina do seu melhor amigo, organizada com calma.
          </div>
        </div>
      </div>

      <div style={{display:'flex', flexDirection:'column', gap: 10}}>
        <button onClick={() => nav('home')} style={{
          height: 56, borderRadius: 99, border: 'none', background: T.surface, color: T.ink,
          fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600,
          display:'flex', alignItems:'center', justifyContent:'center', gap: 10, cursor:'pointer',
          boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 6px 16px -8px rgba(20,20,30,0.12)',
        }}>
          <GoogleG2 size={18}/> Continuar com Google
        </button>
        <button onClick={() => nav('home')} style={{
          height: 56, borderRadius: 99, border:'none', background: T.ink, color:'#fff',
          fontFamily: FONT_BODY, fontSize: 15, fontWeight: 600,
          display:'flex', alignItems:'center', justifyContent:'center', gap: 10, cursor:'pointer',
        }}>
          <Icon2 d={I2.mail} size={16} color="#fff" stroke={2}/> Continuar com e-mail
        </button>
        <div style={{textAlign:'center', fontSize: 13, color: T.inkMute, marginTop: 10}}>
          Já tem conta? <span style={{color: T.ink, fontWeight: 600, textDecoration:'underline'}}>Entrar</span>
        </div>
      </div>
    </div>
  );
}
window.V2Onboarding = V2Onboarding;

// ── 02 · Home ──────────────────────────────────────────────────
function V2Home() {
  const { nav } = useNavV2();
  const tiles = [
    { label:'Saúde',         emoji:'🩺', tint: T.tintRose,     ink: T.tintRoseInk,    sub:'em dia',     to:'pet' },
    { label:'Medicamentos',  emoji:'💊', tint: T.tintLavender, ink: T.tintLavenderInk, sub:'5 ativos',   to:'meds' },
    { label:'Finanças',      emoji:'🪙', tint: T.tintMint,     ink: T.tintMintInk,    sub:'R$ 1.247',   to:'finance' },
    { label:'Documentos',    emoji:'📁', tint: T.tintCream,    ink: T.tintCreamInk,   sub:'8 itens',    to:'pet' },
  ];
  const upcoming = [
    { time:'15:00', emoji:'💊', tint: T.tintLavender, title:'Prednisolona', sub:'10mg · após o almoço', done:false },
    { time:'17:30', emoji:'🚶', tint: T.tintPeach,    title:'Passeio da tarde', sub:'20 min · Leia', done:false, late:true },
  ];
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background: T.bg}}>
      <div style={{flex:1, overflow:'auto', padding:'4px 24px 16px'}}>
        {/* Header row */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 8}}>
          <IconButton icon={I2.burger}/>
          <div style={{display:'flex', alignItems:'center', gap: 8}}>
            <IconButton icon={I2.bell}/>
            <UserAvatar size={40} name="Taynara" hue={28}/>
          </div>
        </div>

        {/* Eyebrow + serif greeting */}
        <div style={{marginTop: 32, textAlign:'center'}}>
          <Eyebrow>Segunda · 14 maio</Eyebrow>
          <Display size={46} weight={400} style={{marginTop: 8}}>
            Olá, <span style={{fontStyle:'italic'}}>Taynara</span>
          </Display>
        </div>

        {/* Pet selector */}
        <div style={{display:'flex', gap: 8, marginTop: 28, overflowX:'auto', paddingBottom: 4}}>
          {[
            {n:'Leia',  active:true, hue:30, photo:true},
            {n:'Filó',  hue:200},
            {n:'Fiapa', hue:340},
          ].map((p,i)=>(
            <div key={i} style={{
              display:'flex', alignItems:'center', gap: 8,
              padding:'5px 14px 5px 5px', borderRadius: 99,
              background: p.active ? T.ink : T.surface,
              color: p.active ? '#fff' : T.ink,
              fontWeight: 600, fontSize: 13, flexShrink: 0,
              boxShadow: p.active ? 'none' : '0 1px 2px rgba(20,20,30,0.04)',
            }}>
              <MascotAvatar size={28} hue={p.hue} photo={p.photo}/>{p.n}
            </div>
          ))}
          <div style={{
            display:'flex', alignItems:'center', gap: 6, padding:'5px 14px 5px 8px',
            borderRadius: 99, color: T.inkSoft, fontWeight: 600, fontSize: 13,
            border: `1px dashed ${T.hairlineStrong}`,
          }}>
            <Icon2 d={I2.plus} size={14} color={T.inkSoft} stroke={2}/> Adicionar
          </div>
        </div>

        {/* 2x2 quick access tiles */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginTop: 24}}>
          {tiles.map((t,i)=>(
            <Card2 key={i} pad={16} radius={22} onClick={() => nav(t.to)} style={{display:'flex', flexDirection:'column', gap: 16, height: 112, cursor:'pointer'}}>
              <EmojiCircle emoji={t.emoji} size={36} tint={t.tint}/>
              <div>
                <div style={{fontWeight: 700, fontSize: 15, color: T.ink}}>{t.label}</div>
                <div style={{fontSize: 12, color: T.inkSoft, marginTop: 2}}>{t.sub}</div>
              </div>
            </Card2>
          ))}
        </div>

        {/* Upcoming */}
        <div style={{marginTop: 28, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <SectionPill icon="⏰" label="Próximas doses" count={2} tint={T.tintLavender} ink={T.tintLavenderInk}/>
          <span onClick={() => nav('meds')} style={{fontSize: 12, color: T.inkSoft, fontWeight: 600, cursor:'pointer'}}>Ver todas →</span>
        </div>

        <div style={{display:'flex', flexDirection:'column', gap: 8, marginTop: 14}}>
          {upcoming.map((m,i)=>(
            <Card2 key={i} pad={14} radius={20}>
              <div style={{display:'flex', alignItems:'center', gap: 14}}>
                <EmojiCircle emoji={m.emoji} size={42} tint={m.tint}/>
                <div style={{flex:1, minWidth: 0}}>
                  <div style={{display:'flex', alignItems:'center', gap:6}}>
                    <span style={{fontWeight: 700, fontSize: 15, color: T.ink}}>{m.title}</span>
                    {m.late && <span style={{
                      fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform:'uppercase',
                      padding:'3px 8px', borderRadius: 99, background: T.tintRose, color: T.tintRoseInk,
                    }}>atrasado</span>}
                  </div>
                  <div style={{fontSize: 12, color: T.inkSoft, marginTop: 2}}>{m.time} · {m.sub}</div>
                </div>
                <CheckBubble done={m.done} onClick={()=>{}}/>
              </div>
            </Card2>
          ))}
        </div>
      </div>

      <BottomNav2 active="home"/>
    </div>
  );
}
window.V2Home = V2Home;
