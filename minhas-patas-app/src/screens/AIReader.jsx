import { T, FONT_DISPLAY, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, IconBtn, Eyebrow, Display, Stripe } from '../components/Shared.jsx';

export default function AIReader() {
  const { nav, back } = useNav();
  const meds = [
    { name:'Prednisolona 10mg', use:'Reduz coceira e inflamação na pele.',
      dose:'1 comprimido · 2x ao dia · 7 dias', emoji:'💊', tint:T.tintLavender },
    { name:'Protetor hepático', use:'Apoia o fígado durante o tratamento.',
      dose:'2.5ml · 2x ao dia · 14 dias', emoji:'🧴', tint:T.tintSky },
  ];
  const schedule = [
    { time:'07h', label:'Manhã', emoji:'🌅', tint:T.tintPeach,    med:'Prednisolona' },
    { time:'15h', label:'Tarde', emoji:'☀️', tint:T.tintCream,    med:'Prednisolona + Protetor' },
    { time:'23h', label:'Noite', emoji:'🌙', tint:T.tintLavender, med:'Protetor' },
  ];
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <IconBtn icon={I.more} />
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'18px 24px 24px' }}>
        <Eyebrow>com inteligência artificial</Eyebrow>
        <Display size={42} weight={400} style={{ marginTop:8 }}>
          Receita<br /><span style={{ fontStyle:'italic' }}>inteligente</span>
        </Display>
        <div style={{ fontSize:14, color:T.inkSoft, marginTop:10, lineHeight:1.5 }}>
          Lemos sua receita e organizamos os horários pra você.
        </div>
        <Card pad={14} radius={22} style={{ marginTop:22, display:'flex', gap:14, alignItems:'center' }}>
          <Stripe w={64} h={82} label="RX" radius={14} />
          <div style={{ flex:1, minWidth:0 }}>
            <span style={{ fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase',
              padding:'3px 8px', borderRadius:99, background:T.brandSoft, color:T.brand }}>analisando ✨</span>
            <div style={{ fontWeight:700, fontSize:14, color:T.ink, marginTop:6 }}>receita-leia-12mai.pdf</div>
            <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>Dr. Henrique · CRMV 4821</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10 }}>
              <div style={{ flex:1, height:3, borderRadius:99, background:T.bgWash, overflow:'hidden' }}>
                <div style={{ width:'72%', height:'100%', background:T.brand, borderRadius:99 }} />
              </div>
              <span style={{ fontSize:11, color:T.inkSoft, fontWeight:700 }}>72%</span>
            </div>
          </div>
        </Card>
        <div style={{ marginTop:24 }}>
          <SectionPill icon="💊" label="Identificados" count={2} tint={T.tintLavender} ink={T.tintLavenderInk} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:12 }}>
          {meds.map((m,i) => (
            <Card key={i} pad={14} radius={20}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <EmojiCircle emoji={m.emoji} size={42} tint={m.tint} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:15, color:T.ink }}>{m.name}</div>
                  <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{m.dose}</div>
                </div>
              </div>
              <div style={{ marginTop:12, padding:'12px 14px', background:T.surfaceLo,
                borderRadius:14, fontSize:13, color:T.ink, lineHeight:1.5 }}>
                <div style={{ fontSize:10, fontWeight:800, letterSpacing:1.2, textTransform:'uppercase',
                  color:T.inkMute, marginBottom:4 }}>para que serve</div>
                {m.use}
              </div>
            </Card>
          ))}
        </div>
        <div style={{ marginTop:24 }}>
          <SectionPill icon="✨" label="Horários sugeridos" count={3} tint={T.tintCream} ink={T.tintCreamInk} />
        </div>
        <Card pad={16} radius={22} style={{ marginTop:12 }}>
          <div style={{ position:'relative', paddingLeft:28 }}>
            <div style={{ position:'absolute', left:17, top:8, bottom:8, width:2,
              background:`repeating-linear-gradient(180deg, ${T.inkFaint} 0 4px, transparent 4px 8px)` }} />
            {schedule.map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'8px 0', position:'relative' }}>
                <div style={{ position:'absolute', left:-28 }}>
                  <EmojiCircle emoji={s.emoji} size={36} tint={s.tint}
                    style={{ boxShadow:`0 0 0 4px ${T.surface}` }} />
                </div>
                <div style={{ flex:1, marginLeft:18 }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                    <span style={{ fontFamily:FONT_DISPLAY, fontWeight:500, fontSize:22, color:T.ink }}>{s.time}</span>
                    <span style={{ fontSize:12, color:T.inkSoft }}>· {s.label}</span>
                  </div>
                  <div style={{ fontSize:13, color:T.inkSoft, marginTop:2 }}>{s.med}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        <button onClick={() => nav('today')} style={{ marginTop:22, width:'100%', height:56,
          borderRadius:99, border:'none', background:T.ink, color:'#fff',
          fontFamily:FONT_BODY, fontSize:15, fontWeight:600,
          display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer' }}>
          Ativar agenda completa
          <Icon d={I.arrow} size={16} color="#fff" stroke={2} />
        </button>
        <div style={{ textAlign:'center', fontSize:12, color:T.inkMute, marginTop:10 }}>
          Você pode ajustar horários a qualquer momento.
        </div>
      </div>
    </div>
  );
}
