import Game from './Game.js';

function App() {
  return (
    <div class="h-screen bg-slate-100 flex flex-col">
      <div class="top-0 bg-teal-600">
        <p class="text-4xl text-white text-left p-2 pl-4">
          Memory Matching Game
        </p>
      </div>
      <Game/>
    </div>

  );
}

export default App;
