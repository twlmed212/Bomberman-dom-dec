import React, { useState } from 'react';

const BombermanArchitecture = () => {
  const [activeTab, setActiveTab] = useState('structure');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  const teamData = [
    {
      id: 1,
      name: 'Backend Lead',
      color: '#3B82F6',
      icon: '🔵',
      files: ['server.js', 'WebSocketServer.js', 'GameManager.js', 'GameLoop.js'],
      tasks: [
        { day: '1-2', task: 'Server setup & WebSocket connections' },
        { day: '3-4', task: 'Game state structure & player management' },
        { day: '5-6', task: 'Game loop (60 tick/s) & movement validation' },
        { day: '7-8', task: 'Bomb timers & win condition detection' },
        { day: '9-10', task: 'Integration & testing' }
      ],
      responsibility: 'Server, game state, WebSocket communication, game loop'
    },
    {
      id: 2,
      name: 'Backend Support',
      color: '#10B981',
      icon: '🟢',
      files: ['Map.js', 'Player.js', 'Bomb.js', 'PowerUp.js'],
      tasks: [
        { day: '1-2', task: 'Map grid (15x15) & wall placement' },
        { day: '3-4', task: 'Block generation & Player class' },
        { day: '5-6', task: 'Bomb explosion pattern calculation' },
        { day: '7-8', task: 'Power-up spawning & pickup effects' },
        { day: '9-10', task: 'Collision detection & edge cases' }
      ],
      responsibility: 'Map generation, entities, collision detection'
    },
    {
      id: 3,
      name: 'Frontend Lead',
      color: '#F59E0B',
      icon: '🟡',
      files: ['WebSocketClient.js', 'Renderer.js', 'GameController.js', 'GameScreen.js'],
      tasks: [
        { day: '1-2', task: 'WebSocket client with reconnection' },
        { day: '3-4', task: 'Grid renderer (CSS Grid)' },
        { day: '5-6', task: 'Player, bomb, explosion sprites' },
        { day: '7-8', task: 'Smooth animations & power-up visuals' },
        { day: '9-10', task: 'HUD & performance optimization' }
      ],
      responsibility: 'Network layer, game rendering, visual components'
    },
    {
      id: 4,
      name: 'Frontend Support',
      color: '#EF4444',
      icon: '🔴',
      files: ['InputHandler.js', 'MenuScreen.js', 'LobbyScreen.js', 'ChatPanel.js', 'GameOverScreen.js'],
      tasks: [
        { day: '1-2', task: 'Menu & Lobby screen components' },
        { day: '3-4', task: 'Keyboard input handler' },
        { day: '5-6', task: 'Movement & bomb key bindings' },
        { day: '7-8', task: 'Chat panel integration' },
        { day: '9-10', task: 'Game over screen & polish' }
      ],
      responsibility: 'User input, UI screens, chat functionality'
    }
  ];

  const milestones = [
    { day: 3, name: 'Basic Connection', tasks: ['Server running', 'Client connects', 'Player ID assigned', 'Lobby shows players'] },
    { day: 5, name: 'Game Start', tasks: ['Players ready up', 'Countdown works', 'Map displayed', 'Players at corners'] },
    { day: 6, name: 'Movement', tasks: ['Arrow keys work', 'Movement synced', 'Wall collision', 'State consistent'] },
    { day: 7, name: 'Bombs', tasks: ['Space places bomb', 'Bombs visible', '3s explosion', 'Blocks destroyed'] },
    { day: 8, name: 'Combat', tasks: ['Lives system', 'HUD display', 'Death handling', 'Winner detection'] },
    { day: 9, name: 'Power-ups', tasks: ['Spawn from blocks', 'Pickup works', 'Effects apply', 'Chat works'] },
    { day: 10, name: 'Polish', tasks: ['Game over screen', 'Play again', '60 FPS stable', 'Edge cases fixed'] }
  ];

  const wsMessages = [
    { direction: 'client', type: 'JOIN', desc: 'Player joins lobby', data: '{ playerName }' },
    { direction: 'client', type: 'READY', desc: 'Player ready to start', data: '{ }' },
    { direction: 'client', type: 'MOVE', desc: 'Movement input', data: '{ direction }' },
    { direction: 'client', type: 'BOMB', desc: 'Place bomb', data: '{ }' },
    { direction: 'client', type: 'CHAT', desc: 'Chat message', data: '{ message }' },
    { direction: 'server', type: 'CONNECTED', desc: 'Connection confirmed', data: '{ playerId }' },
    { direction: 'server', type: 'LOBBY_UPDATE', desc: 'Players in lobby', data: '{ players[], readyCount }' },
    { direction: 'server', type: 'GAME_STATE', desc: 'Full game state (60/s)', data: '{ map, players, bombs, ... }' },
    { direction: 'server', type: 'GAME_START', desc: 'Game begins', data: '{ countdown }' },
    { direction: 'server', type: 'PLAYER_DIED', desc: 'Death notification', data: '{ playerId, livesLeft }' },
    { direction: 'server', type: 'GAME_OVER', desc: 'Game ended', data: '{ winnerId }' }
  ];

  const FileTree = () => (
    <div className="font-mono text-sm">
      <div className="mb-4">
        <div className="font-bold text-lg mb-2">📁 bomberman-dom/</div>
        
        <div className="ml-4 mb-3">
          <div className="font-semibold text-blue-400">📁 backend/</div>
          <div className="ml-4 text-gray-300">
            <div>📄 server.js <span className="text-blue-400 text-xs ml-2">P1</span></div>
            <div className="ml-4">
              <div className="text-gray-500">📁 websocket/</div>
              <div className="ml-4">
                <div>📄 WebSocketServer.js <span className="text-blue-400 text-xs ml-2">P1</span></div>
                <div>📄 MessageHandler.js <span className="text-blue-400 text-xs ml-2">P1</span></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-gray-500">📁 game/</div>
              <div className="ml-4">
                <div>📄 GameManager.js <span className="text-blue-400 text-xs ml-2">P1</span></div>
                <div>📄 GameLoop.js <span className="text-blue-400 text-xs ml-2">P1</span></div>
                <div>📄 Map.js <span className="text-green-400 text-xs ml-2">P2</span></div>
                <div>📄 Player.js <span className="text-green-400 text-xs ml-2">P2</span></div>
                <div>📄 Bomb.js <span className="text-green-400 text-xs ml-2">P2</span></div>
                <div>📄 PowerUp.js <span className="text-green-400 text-xs ml-2">P2</span></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-gray-500">📁 chat/</div>
              <div className="ml-4">
                <div>📄 ChatManager.js <span className="text-blue-400 text-xs ml-2">P1</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-4 mb-3">
          <div className="font-semibold text-yellow-400">📁 frontend/</div>
          <div className="ml-4 text-gray-300">
            <div className="text-gray-500">📁 public/</div>
            <div className="ml-4">
              <div>📄 index.html</div>
            </div>
            <div className="text-gray-500">📁 styles/</div>
            <div className="ml-4">
              <div>📄 main.css, game.css, lobby.css, chat.css</div>
            </div>
            <div className="text-gray-500">📁 src/</div>
            <div className="ml-4">
              <div className="text-purple-400">📁 framework/ (your mini-framework ✅)</div>
              <div className="ml-4 text-gray-500 text-xs">dom.js, state.js, events.js, router.js</div>
            </div>
            <div className="ml-4">
              <div className="text-gray-500">📁 network/</div>
              <div className="ml-4">
                <div>📄 WebSocketClient.js <span className="text-yellow-400 text-xs ml-2">P3</span></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-gray-500">📁 game/</div>
              <div className="ml-4">
                <div>📄 Renderer.js <span className="text-yellow-400 text-xs ml-2">P3</span></div>
                <div>📄 GameController.js <span className="text-yellow-400 text-xs ml-2">P3</span></div>
                <div>📄 InputHandler.js <span className="text-red-400 text-xs ml-2">P4</span></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-gray-500">📁 screens/</div>
              <div className="ml-4">
                <div>📄 MenuScreen.js <span className="text-red-400 text-xs ml-2">P4</span></div>
                <div>📄 LobbyScreen.js <span className="text-red-400 text-xs ml-2">P4</span></div>
                <div>📄 GameScreen.js <span className="text-yellow-400 text-xs ml-2">P3</span></div>
                <div>📄 GameOverScreen.js <span className="text-red-400 text-xs ml-2">P4</span></div>
              </div>
            </div>
            <div className="ml-4">
              <div className="text-gray-500">📁 components/</div>
              <div className="ml-4">
                <div>📄 ChatPanel.js <span className="text-red-400 text-xs ml-2">P4</span></div>
                <div>📄 GameHUD.js <span className="text-yellow-400 text-xs ml-2">P3</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-4">
          <div className="font-semibold text-purple-400">📁 shared/</div>
          <div className="ml-4 text-gray-300">
            <div>📄 messageTypes.js</div>
            <div>📄 gameConstants.js</div>
          </div>
        </div>
      </div>
    </div>
  );

  const DataFlowDiagram = () => (
    <div className="relative">
      <svg viewBox="0 0 600 400" className="w-full h-auto">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#60A5FA" />
          </marker>
        </defs>
        
        <rect x="20" y="20" width="560" height="150" rx="10" fill="#1E3A5F" stroke="#3B82F6" strokeWidth="2"/>
        <text x="300" y="45" textAnchor="middle" fill="#60A5FA" fontSize="14" fontWeight="bold">CLIENT (Browser)</text>
        
        <rect x="40" y="60" width="100" height="40" rx="5" fill="#2D4A6F"/>
        <text x="90" y="85" textAnchor="middle" fill="#E5E7EB" fontSize="11">InputHandler</text>
        
        <rect x="180" y="60" width="100" height="40" rx="5" fill="#2D4A6F"/>
        <text x="230" y="85" textAnchor="middle" fill="#E5E7EB" fontSize="11">WebSocket</text>
        
        <rect x="320" y="60" width="100" height="40" rx="5" fill="#2D4A6F"/>
        <text x="370" y="85" textAnchor="middle" fill="#E5E7EB" fontSize="11">GameState</text>
        
        <rect x="460" y="60" width="100" height="40" rx="5" fill="#2D4A6F"/>
        <text x="510" y="85" textAnchor="middle" fill="#E5E7EB" fontSize="11">Renderer</text>
        
        <line x1="140" y1="80" x2="175" y2="80" stroke="#60A5FA" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <line x1="280" y1="80" x2="315" y2="80" stroke="#60A5FA" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <line x1="420" y1="80" x2="455" y2="80" stroke="#60A5FA" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        
        <text x="90" y="130" textAnchor="middle" fill="#9CA3AF" fontSize="10">keyboard</text>
        <text x="230" y="130" textAnchor="middle" fill="#9CA3AF" fontSize="10">send actions</text>
        <text x="370" y="130" textAnchor="middle" fill="#9CA3AF" fontSize="10">local copy</text>
        <text x="510" y="130" textAnchor="middle" fill="#9CA3AF" fontSize="10">DOM update</text>
        
        <line x1="230" y1="170" x2="230" y2="210" stroke="#10B981" strokeWidth="3" markerEnd="url(#arrowhead)"/>
        <line x1="370" y1="210" x2="370" y2="170" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrowhead)"/>
        <text x="250" y="195" fill="#10B981" fontSize="10">Actions</text>
        <text x="390" y="195" fill="#F59E0B" fontSize="10">State</text>
        
        <rect x="20" y="230" width="560" height="150" rx="10" fill="#1F2937" stroke="#10B981" strokeWidth="2"/>
        <text x="300" y="255" textAnchor="middle" fill="#10B981" fontSize="14" fontWeight="bold">SERVER (Node.js) - AUTHORITATIVE</text>
        
        <rect x="40" y="270" width="100" height="40" rx="5" fill="#374151"/>
        <text x="90" y="295" textAnchor="middle" fill="#E5E7EB" fontSize="11">WebSocket</text>
        
        <rect x="180" y="270" width="100" height="40" rx="5" fill="#374151"/>
        <text x="230" y="295" textAnchor="middle" fill="#E5E7EB" fontSize="11">GameManager</text>
        
        <rect x="320" y="270" width="100" height="40" rx="5" fill="#374151"/>
        <text x="370" y="295" textAnchor="middle" fill="#E5E7EB" fontSize="11">GameLoop</text>
        
        <rect x="460" y="270" width="100" height="40" rx="5" fill="#374151"/>
        <text x="510" y="295" textAnchor="middle" fill="#E5E7EB" fontSize="11">Broadcast</text>
        
        <line x1="140" y1="290" x2="175" y2="290" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <line x1="280" y1="290" x2="315" y2="290" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        <line x1="420" y1="290" x2="455" y2="290" stroke="#10B981" strokeWidth="2" markerEnd="url(#arrowhead)"/>
        
        <text x="90" y="340" textAnchor="middle" fill="#9CA3AF" fontSize="10">receive</text>
        <text x="230" y="340" textAnchor="middle" fill="#9CA3AF" fontSize="10">validate</text>
        <text x="370" y="340" textAnchor="middle" fill="#9CA3AF" fontSize="10">60 tick/s</text>
        <text x="510" y="340" textAnchor="middle" fill="#9CA3AF" fontSize="10">to all clients</text>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">💣 BOMBERMAN-DOM</h1>
          <p className="text-gray-400">Mission-Critical Project Architecture</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {['structure', 'team', 'dataflow', 'messages', 'milestones'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab === 'structure' && '📁 Structure'}
              {tab === 'team' && '👥 Team'}
              {tab === 'dataflow' && '🔄 Data Flow'}
              {tab === 'messages' && '📨 Messages'}
              {tab === 'milestones' && '🎯 Milestones'}
            </button>
          ))}
        </div>

        {activeTab === 'structure' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Project File Structure</h2>
            <FileTree />
            <div className="mt-4 flex gap-4 flex-wrap text-sm">
              <span className="text-blue-400">🔵 P1: Backend Lead</span>
              <span className="text-green-400">🟢 P2: Backend Support</span>
              <span className="text-yellow-400">🟡 P3: Frontend Lead</span>
              <span className="text-red-400">🔴 P4: Frontend Support</span>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamData.map(person => (
              <div 
                key={person.id}
                className={`bg-gray-800 rounded-xl p-4 border-2 cursor-pointer transition-all ${
                  selectedPerson === person.id ? 'border-opacity-100' : 'border-opacity-30'
                }`}
                style={{ borderColor: person.color }}
                onClick={() => setSelectedPerson(selectedPerson === person.id ? null : person.id)}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{person.icon}</span>
                  <h3 className="font-bold text-lg" style={{ color: person.color }}>
                    Person {person.id}: {person.name}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm mb-3">{person.responsibility}</p>
                
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">FILES:</div>
                  <div className="flex flex-wrap gap-1">
                    {person.files.map(file => (
                      <span key={file} className="bg-gray-700 px-2 py-0.5 rounded text-xs">
                        {file}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedPerson === person.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-xs text-gray-500 mb-2">TASK TIMELINE:</div>
                    {person.tasks.map((task, i) => (
                      <div key={i} className="flex gap-3 mb-2 text-sm">
                        <span className="text-gray-500 w-16">Day {task.day}</span>
                        <span className="text-gray-300">{task.task}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'dataflow' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Data Flow Architecture</h2>
            <DataFlowDiagram />
            <div className="mt-4 p-4 bg-gray-900 rounded-lg">
              <div className="text-sm text-gray-400">
                <p className="mb-2"><span className="text-green-400 font-bold">Key Principle:</span> Server is AUTHORITATIVE</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Client sends ACTIONS (intent), never state</li>
                  <li>Server validates ALL actions before applying</li>
                  <li>Server broadcasts state to ALL clients (60 times/sec)</li>
                  <li>Clients render whatever server says - no local prediction</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">WebSocket Message Protocol</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-green-400 font-bold mb-2">↑ Client → Server</h3>
                {wsMessages.filter(m => m.direction === 'client').map((msg, i) => (
                  <div key={i} className="bg-gray-900 rounded p-3 mb-2">
                    <div className="flex justify-between">
                      <span className="font-mono text-green-400">{msg.type}</span>
                      <span className="text-xs text-gray-500">{msg.data}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{msg.desc}</div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-blue-400 font-bold mb-2">↓ Server → Client</h3>
                {wsMessages.filter(m => m.direction === 'server').map((msg, i) => (
                  <div key={i} className="bg-gray-900 rounded p-3 mb-2">
                    <div className="flex justify-between">
                      <span className="font-mono text-blue-400">{msg.type}</span>
                      <span className="text-xs text-gray-500">{msg.data}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{msg.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Integration Milestones</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700"></div>
              {milestones.map((milestone, i) => (
                <div 
                  key={i} 
                  className="relative pl-12 pb-6 cursor-pointer"
                  onClick={() => setExpandedSection(expandedSection === i ? null : i)}
                >
                  <div className="absolute left-2 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">
                    {milestone.day}
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4">
                    <h3 className="font-bold text-blue-400">{milestone.name}</h3>
                    <p className="text-sm text-gray-500">Day {milestone.day}</p>
                    {expandedSection === i && (
                      <ul className="mt-3 space-y-1">
                        {milestone.tasks.map((task, j) => (
                          <li key={j} className="text-sm text-gray-300 flex items-center gap-2">
                            <span className="w-4 h-4 rounded border border-gray-600 flex items-center justify-center text-xs">☐</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-6 border border-green-500/30">
          <h3 className="text-lg font-bold text-green-400 mb-2">✅ Audit Success Criteria</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-300 mb-1">Core Gameplay</div>
              <ul className="text-gray-400 space-y-1">
                <li>• 2-4 player multiplayer</li>
                <li>• Real-time synchronization</li>
                <li>• Movement + bombs work</li>
                <li>• Lives system (3 lives)</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-300 mb-1">Features</div>
              <ul className="text-gray-400 space-y-1">
                <li>• Power-ups (speed/bomb/flame)</li>
                <li>• In-game chat</li>
                <li>• Winner detection</li>
                <li>• Destructible walls</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-300 mb-1">Technical</div>
              <ul className="text-gray-400 space-y-1">
                <li>• Mini-framework used ✓</li>
                <li>• Server validates actions</li>
                <li>• 60 FPS performance</li>
                <li>• No external frameworks</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BombermanArchitecture;