# 🍎 NutriTracker AI - Aplicação de Nutrição Moderna

Uma aplicação web moderna e intuitiva para rastreamento nutricional com inteligência artificial, desenvolvida com React e Tailwind CSS.

## ✨ Características

- 🎯 **Interface Moderna**: Design glassmorphism com gradientes e animações suaves
- 📊 **Rastreamento Nutricional**: Monitoramento completo de calorias, proteínas, carboidratos e gorduras
- 🤖 **Análise de Imagem com IA**: Identificação automática de alimentos através de fotos
- 📱 **Responsivo**: Interface adaptativa para desktop e mobile
- 🎨 **Animações**: Transições suaves e feedback visual interativo
- 📈 **Gráficos**: Visualizações com charts e progress indicators
- 💾 **Armazenamento Local**: Dados salvos localmente no navegador
- 🔍 **Pesquisa de Alimentos**: Integração com OpenFoodFacts API

## 🚀 Tecnologias Utilizadas

- **React 19** - Framework JavaScript moderno
- **Tailwind CSS** - Framework CSS utilitário
- **Vite** - Build tool rápida e moderna
- **Lucide React** - Ícones modernos
- **Recharts** - Biblioteca de gráficos para React
- **OpenFoodFacts API** - Base de dados de alimentos

## 🎨 Design Features

### Glassmorphism
- Elementos com transparência e blur effect
- Bordas suaves e sombras elegantes
- Gradient backgrounds dinâmicos

### Animações
- `slideUp` - Elementos aparecem deslizando de baixo para cima
- `fadeIn` - Fade in suave
- `scaleIn` - Escala de entrada
- `pulse-gentle` - Pulso suave para elementos de destaque
- `float` - Animação flutuante

### Círculos de Progresso
- Animação de preenchimento circular
- Códigos de cores para diferentes nutrientes
- Checkmarks para objetivos atingidos

## 🛠️ Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd APPnutri
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Abra no navegador**
   ```
   http://localhost:3000
   ```

## 📋 Como Usar

### 1. Configuração Inicial
- Insira peso, altura, idade e sexo
- Selecione nível de atividade física
- Defina objetivo (perder, manter ou ganhar peso)
- Configure meta de peso (se aplicável)

### 2. Rastreamento Diário
- Visualize progresso dos macronutrientes
- Acompanhe círculos de progresso animados
- Monitore calorias e nutrientes consumidos

### 3. Adicionar Alimentos
- **Foto**: Use câmera ou faça upload de imagem
- **Pesquisa**: Busque alimentos na base de dados
- **Sugestões**: Clique em alimentos sugeridos

### 4. Análise e Relatórios
- Gráfico de pizza dos macronutrientes
- Dashboard semanal com histórico
- Progresso em tempo real

## 🎯 Funcionalidades Principais

### Análise de Imagem IA
```javascript
// Simula análise de imagem com IA
const analyzeImage = (imageData) => {
  // Retorna alimentos detectados com confiança
  return randomFoods.sort((a, b) => b.confidence - a.confidence);
};
```

### Cálculo de Necessidades Nutricionais
```javascript
// Calcula BMR usando fórmula de Mifflin-St Jeor
const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};
```

### Armazenamento Local
```javascript
// Salva dados no localStorage
useEffect(() => {
  localStorage.setItem('userProfile', JSON.stringify(userProfile));
}, [userProfile]);
```

## 🎨 Customização de Estilos

### Classes CSS Personalizadas
```css
/* Botões com gradiente */
.btn-primary {
  @apply bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl;
}

/* Cards com efeito glassmorphism */
.card {
  @apply bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl;
}

/* Inputs modernos */
.input-modern {
  @apply w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white shadow-sm;
}
```

### Configuração do Tailwind
```javascript
// tailwind.config.js
theme: {
  extend: {
    animation: {
      'slideUp': 'slideUp 0.5s ease-out',
      'fadeIn': 'fadeIn 0.3s ease-out',
      'scaleIn': 'scaleIn 0.3s ease-out',
      'pulse-gentle': 'pulse 2s infinite',
    }
  }
}
```

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Grid Adaptativo**: Layout que se ajusta ao tamanho da tela
- **Componentes Flexíveis**: Elementos que se reorganizam automaticamente

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza build de produção

## 🎯 Próximas Melhorias

- [ ] Integração com APIs de nutrição mais avançadas
- [ ] Modo offline com Service Workers
- [ ] Notificações push para lembretes
- [ ] Exportação de dados em PDF/CSV
- [ ] Sincronização com dispositivos fitness
- [ ] Modo escuro/claro

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar documentação

---

**Desenvolvido com ❤️ usando React + Tailwind CSS**
