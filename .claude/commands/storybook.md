# storybook

Sempre que um componente ou tela for criado ou modificado no app MinhasPatas, gere ou atualize a story correspondente no Storybook e faça o deploy.

## Como usar

```
/storybook [caminho-do-arquivo]
```

- **Com argumento**: gera story para o arquivo informado (ex: `/storybook src/screens/Health.jsx`)
- **Sem argumento**: detecta automaticamente o arquivo criado ou modificado mais recentemente em `src/components/` e `src/screens/`

---

## Passos que você deve seguir

### 1. Identificar o componente

Se o usuário passou um caminho como argumento (`$ARGUMENTS`), use-o.
Caso contrário, rode:
```bash
cd minhas-patas-app && git diff --name-only HEAD~1 HEAD -- src/components/ src/screens/ | head -5
```
Se não houver diff (arquivo novo não commitado ainda):
```bash
find minhas-patas-app/src/components minhas-patas-app/src/screens -name "*.jsx" -newer minhas-patas-app/src/App.jsx | sort
```
Escolha o arquivo mais relevante e informe o usuário qual foi detectado.

### 2. Ler o componente

Leia o arquivo identificado. Analise:
- Quais componentes/funções são exportados (`export default`, `export const`)
- Quais props cada um recebe (desestruturação, defaultProps, PropTypes)
- Variantes visuais (estados, tamanhos, cores, booleans como `done`, `active`, `premium`)
- Se usa `useNav()` ou `usePet()` — esses precisam de mock/decorator
- Se renderiza imagens externas (`/leia-nova.png`) que podem não carregar no Storybook

### 3. Definir o arquivo de story

- **Telas** (`src/screens/`): story em `src/stories/Screens.stories.jsx` (adicionar ao arquivo existente se já existir, ou criar)
- **Componentes** (`src/components/`): story em `src/stories/Components.stories.jsx` (adicionar ao arquivo existente)

O título deve seguir o padrão:
- Telas: `'MinhasPatas/Screens/NomeDaTela'`
- Componentes compartilhados: `'Design System/Components'`
- Componentes específicos: `'MinhasPatas/Components/NomeDoComponente'`

### 4. Gerar a story

Crie stories que cubram:
1. **Estado padrão** — como o componente aparece por default
2. **Variantes principais** — diferentes props/estados relevantes
3. **Edge cases** — lista vazia, texto longo, estado de loading se aplicável

**Regras de estilo para stories de telas:**
- Usar `parameters: { layout: 'fullscreen' }` e embrulhar em um `<div style={{ width: 390, height: 844, overflow: 'hidden', position: 'relative' }}>` para simular o celular
- Prover `NavCtx.Provider` com funções mockadas se a tela usa `useNav()`
- Prover `PetProvider` se a tela usa `usePet()`

**Exemplo de decorator para telas:**
```jsx
import { NavCtx } from '../components/NavContext.jsx';
import { PetProvider } from '../components/PetContext.jsx';

const action = (name) => (...args) => console.log(name, args);

const PhoneDecorator = (Story) => (
  <NavCtx.Provider value={{ nav: action('nav'), back: action('back'), screen: 'home', direction: 'forward' }}>
    <PetProvider>
      <div style={{ width: 390, height: 844, overflow: 'hidden', position: 'relative', background: '#FBFAF7' }}>
        <Story />
      </div>
    </PetProvider>
  </NavCtx.Provider>
);
```

### 5. Escrever o arquivo

Escreva (ou atualize) o arquivo de story com `Edit` ou `Write`.

Se o arquivo já existe, **adicione** o novo export — não substitua stories existentes.

### 6. Verificar no Storybook local

Se o servidor Storybook estiver rodando (porta 6006), tire um screenshot para confirmar que a story renderiza sem erros.

### 7. Build e deploy

```bash
cd minhas-patas-app && npm run build-storybook 2>&1 | tail -5
```

Depois do build:
```bash
cd minhas-patas-app && npx vercel storybook-static --prod --yes 2>&1 | grep -E "Aliased|url|error"
```

### 8. Confirmar

Informe o usuário:
- Qual story foi criada/atualizada e em qual arquivo
- A URL do Storybook no ar (https://storybook-static-one-opal.vercel.app)
