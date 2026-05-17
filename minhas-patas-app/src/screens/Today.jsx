import { useState } from 'react';
import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { Icon, I, Card, EmojiCircle, SectionPill, CheckBubble, IconBtn, Display, BottomNav } from '../components/Shared.jsx';

function TaskRow({ time, emoji, tint, title, sub, done, late, onToggle }) {
  return (
    <Card pad={14} radius={20} style={{ opacity: done ? 0.55 : 1 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        <EmojiCircle emoji={emoji} size={42} tint={tint} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
            <span style={{ fontWeight:700, fontSize:15, color:T.ink,
              textDecoration: done ? 'line-through' : 'none' }}>{title}</span>
            {late && !done && <span style={{ fontSize:10, fontWeight:800, letterSpacing:0.8,
              textTransform:'uppercase', padding:'3px 8px', borderRadius:99,
              background:T.tintRose, color:T.tintRoseInk }}>atrasado</span>}
          </div>
          <div style={{ fontSize:12, color:T.inkSoft, marginTop:2 }}>{time} · {sub}</div>
        </div>
        <CheckBubble done={done} onClick={onToggle} />
      </div>
    </Card>
  );
}

export default function Today() {
  const [events, setEvents] = useState([
    { s:'m', time:'07:00', emoji:'🥣', tint:T.tintCream,    title:'Café da manhã',    sub:'Ração 80g',               done:true },
    { s:'m', time:'08:00', emoji:'💊', tint:T.tintLavender, title:'Apoquel 16mg',     sub:'1 comprimido',             done:true },
    { s:'a', time:'10:30', emoji:'🚶', tint:T.tintPeach,    title:'Passeio matinal',  sub:'30 min · Parque',          done:false, late:true },
    { s:'a', time:'12:30', emoji:'🥗', tint:T.tintMint,     title:'Almoço da Leia',   sub:'Sachê de frango',          done:false },
    { s:'a', time:'15:00', emoji:'💊', tint:T.tintLavender, title:'Prednisolona 10mg',sub:'1 comp · após refeição',   done:false },
    { s:'n', time:'18:00', emoji:'🦴', tint:T.tintPeach,    title:'Passeio da tarde', sub:'20 min',                   done:false },
    { s:'n', time:'22:00', emoji:'🧴', tint:T.tintSky,      title:'Protetor hepático',sub:'2.5ml líquido',            done:false },
  ]);
  const toggle = i => setEvents(events.map((e,idx) => idx===i ? {...e,done:!e.done,late:e.done?e.late:false} : e));
  const morning   = events.map((e,i) => ({...e,i})).filter(e => e.s==='m');
  const afternoon = events.map((e,i) => ({...e,i})).filter(e => e.s==='a');
  const night     = events.map((e,i) => ({...e,i})).filter(e => e.s==='n');
  const done = events.filter(e => e.done).length;
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:99,
          background:T.surface, boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 4px 12px -6px rgba(20,20,30,0.10)',
          fontWeight:700, fontSize:13, color:T.ink, fontFamily:FONT_BODY }}>
          🎉 {done}/{events.length}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <IconBtn icon={I.more} />
          <IconBtn icon={I.plus} />
        </div>
      </div>
      <div style={{ padding:'30px 24px 0', textAlign:'center', position:'relative' }}>
        <div style={{ position:'absolute', left:24, top:38 }}>
          <Icon d={I.chevL} size={22} color={T.inkFaint} stroke={2} />
        </div>
        <div style={{ position:'absolute', right:24, top:38 }}>
          <Icon d={I.chevR} size={22} color={T.inkFaint} stroke={2} />
        </div>
        <Display size={56} weight={400}>Segunda</Display>
        <div style={{ fontSize:16, color:T.inkSoft, marginTop:6 }}>14 de maio, 2026</div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'22px 24px 16px' }}>
        <SectionPill icon="🕘" label="Em qualquer hora" count={0} tint={T.bgWash} ink={T.inkSoft} />
        <div style={{ marginTop:10, marginBottom:18, padding:18, borderRadius:18,
          border:`1.5px dashed ${T.hairlineStrong}`, color:T.inkMute, fontSize:14,
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span>Qualquer hora cai bem</span>
          <Icon d={I.plus} size={16} color={T.inkMute} stroke={2} />
        </div>
        <SectionPill icon="🌅" label="Manhã" count={morning.length} tint={T.tintPeach} ink={T.tintPeachInk} />
        <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 22px' }}>
          {morning.map(e => <TaskRow key={e.i} {...e} onToggle={() => toggle(e.i)} />)}
        </div>
        <SectionPill icon="☀️" label="Tarde" count={afternoon.length} tint={T.tintLavender} ink={T.tintLavenderInk} />
        <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 22px' }}>
          {afternoon.map(e => <TaskRow key={e.i} {...e} onToggle={() => toggle(e.i)} />)}
        </div>
        <SectionPill icon="🌙" label="Noite" count={night.length} tint={T.tintSky} ink={T.tintSkyInk} />
        <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'12px 0 0' }}>
          {night.map(e => <TaskRow key={e.i} {...e} onToggle={() => toggle(e.i)} />)}
        </div>
      </div>
      <BottomNav active="today" />
    </div>
  );
}
