# PyEngineerView

An Electron application with React, TypeScript and Python

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

Open two folders in separate instances in VS Code.

#### Root Folder (App)

In root folder execute:

```bash
npm install
```

#### Backend Folder (Python)

In backend folder (./src/backend) execute:

```bash
pip install -r requirements.txt
pyinstaller --onefile --noconsole main.py
```

**Root** folder is used to interface and build application

**Backend** folder is used to engineer calculate

### Development

Fast test

```bash
npm run dev
```

Build then test

```bash
npm run start
```

### Build

```bash
# For windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```

## Uso do Software

### Modelar e Calcular Estruturas

1. Toda estrutura deve ser lançada usando o template (uma planilha do Excel) que pode ser obtida com
o comando `Templates > Get Excel Template`;
2. Depois de lançar a estrutura basta abrir o arquivo com o comando `File > Open File`. Esse
comando também permite abrir arquivos .json que contém estruturas salvas que podem já estar
calculadas;
3. Se a estrutura estrutura não estiver calculada basta executar o comando
`Calculate > Calculate Structure`
4. Por último basta clicar com o mouse no elemento para ver os resultados na janela direita na
aba `Results`.

### Navegação

- Utilize a rolagem do scroll do mouse para aplicar e retirar zoom. Você pode combinar isso com as
teclas:
  - **Ctrl** para aumentar a velocidade de zoom; e
  - **Shift** para diminuir a velocidade de zoom.
- Use o botão do scroll juntamento com a movimentação do mouse para rotacionar a cena. Você pode
combinar isso com as teclas:
  - **Ctrl** para arrastar a cena com base na câmera;
  - **Shift** para arrastar a cena com base na grade;

### Visualização

Na janela direita na aba `View` você pode marcar e desmarcar os elementos para esconde-los,
facilitando a visualização ou o click em elemento.

### Estilo

As cores tem significado sendo que:

- Vermelho: Eixo `x`, condição de apoio e cargas relacionadas a esse eixo;
- Verde: Eixo `y`, condição de apoio e cargas relacionadas a esse eixo;
- Azul: Eixo `z`, condição de apoio e cargas relacionadas a esse eixo.
- Ciano: Nós
- Laranja: Barras

Também há variações de tons para cargas positivas e negativas, sendo que as cores mais fracas
representam cargas negativas.

### Outras funções

- Você pode salvar a estrutura atual como um arquivo .json com os comandos `File > Save`e `File > Save As` Isso é útil caso a estrutura já esteja
calculada ou caso você queira mandar um arquivo leve para que outra pessoa possa visualizar sua
estrutura.
