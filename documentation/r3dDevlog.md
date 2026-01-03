# r3dDevlog

Project devlog for Bomberman DOM. Log every move and design choice.

## 2025-09-25
- Initialized devlog so future-me stops guessing what past-me meant.
- Locked in `documentation/architecture.md` as the single source of truth.
- Built the skeleton under `Bomberman-dom-dec/` (felt chaotic at first, but this is the clean root):
  - `backend/` (server, websocket, game stubs)
  - `frontend/` (public, styles, src stubs)
  - `shared/` (messages/constants/mapgen/examples)
- Renamed and moved root docs into `documentation/` for sanity.
- Protocol work: split message constants and shapes into separate files so the team can read without noise:
  - `Bomberman-dom-dec/shared/messages/clientToServer.js`
  - `Bomberman-dom-dec/shared/messages/serverToClient.js`
  - `Bomberman-dom-dec/shared/messages/clientToServerShapes.js`
  - `Bomberman-dom-dec/shared/messages/serverToClientShapes.js`
- Notes to self: keep it simple, resist premature optimization until we profile.
- Added `documentation/ws_js_doc.md` with toddler-level explanations, diagrams, examples, and WS-specific timing/rendering tips.
- Changed server tick and GAME_STATE broadcast target to 20Hz for now; note that we can increase later if responsiveness suffers.
- Expanded `documentation/gamemanager.md` with a full, detailed explanation of state fields and lifecycle.

## Open Questions
- Do we want to add lobby timer fields to `LOBBY_UPDATE` or keep timers in `GAME_START` only?
