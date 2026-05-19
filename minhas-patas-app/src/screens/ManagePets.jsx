import { T, FONT_BODY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { IconBtn, I, Icon, MascotAvatar } from '../components/Shared.jsx';

export default function ManagePets() {
  const { back, nav } = useNav();
  const { PETS, activePet, setActivePetId } = usePet();

  const handlePetClick = (pet) => {
    setActivePetId(pet.id);
    nav('pet');
  };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'12px 20px 0', display:'flex', alignItems:'center', gap:12 }}>
        <IconBtn icon={I.chevL} onClick={back} />
        <div style={{ fontSize:20, fontWeight:800, color:T.ink }}>Meus Pets</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 100px' }}>
        {PETS.length === 0 ? (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:16, paddingTop:80, textAlign:'center' }}>
            <div style={{ fontSize:64 }}>🐾</div>
            <div style={{ fontSize:18, fontWeight:800, color:T.ink }}>
              Nenhum pet cadastrado
            </div>
            <div style={{ fontSize:14, color:T.inkSoft, maxWidth:240, lineHeight:1.5 }}>
              Adicione seu primeiro pet para começar a cuidar dele.
            </div>
            <button onClick={() => nav('petonboarding')} style={{
              marginTop:8, height:48, padding:'0 28px', borderRadius:99,
              background:T.brand, color:'#fff', border:'none',
              fontSize:15, fontWeight:700, fontFamily:FONT_BODY, cursor:'pointer' }}>
              Adicionar pet
            </button>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {PETS.map(pet => (
              <div key={pet.id} onClick={() => handlePetClick(pet)}
                style={{ background:T.surface, borderRadius:20, padding:'16px 18px',
                  display:'flex', alignItems:'center', gap:14, cursor:'pointer',
                  boxShadow:'0 2px 10px rgba(20,20,30,0.06)',
                  border: pet.id === activePet?.id
                    ? `2px solid ${T.brand}`
                    : '2px solid transparent' }}>
                <MascotAvatar
                  size={52}
                  hue={pet.hue}
                  photo={pet.photo}
                  photoUrl={pet.photoUrl}
                />
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ fontSize:16, fontWeight:800, color:T.ink }}>{pet.name}</div>
                    {pet.id === activePet?.id && (
                      <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px',
                        borderRadius:99, background:T.brandSoft, color:T.brand }}>
                        ativo
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize:13, color:T.inkSoft, marginTop:2 }}>
                    {pet.breed}{pet.breed && pet.gender ? ' · ' : ''}{pet.gender}
                  </div>
                  <div style={{ display:'flex', gap:12, marginTop:6 }}>
                    {pet.age && pet.age !== '—' && (
                      <span style={{ fontSize:12, color:T.inkMute }}>🎂 {pet.age}</span>
                    )}
                    {pet.weight && pet.weight !== '—' && (
                      <span style={{ fontSize:12, color:T.inkMute }}>⚖️ {pet.weight}</span>
                    )}
                  </div>
                </div>
                <Icon d={I.chevR} size={16} color={T.inkFaint} stroke={2} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add pet FAB */}
      <div onClick={() => nav('petonboarding')}
        style={{ position:'absolute', bottom:24, right:20, width:56, height:56,
          borderRadius:28, background:T.ink, display:'flex', alignItems:'center',
          justifyContent:'center', fontSize:28, color:'#fff', cursor:'pointer',
          boxShadow:'0 8px 24px -6px rgba(20,20,30,0.4)', zIndex:10 }}>+</div>
    </div>
  );
}
