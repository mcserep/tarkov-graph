import {TarkovGraph} from './components/TarkovGraph.tsx';

import './App.css'

function App() {
    return (
        <>
            <header>
                <h1>Escape from Tarkov - Task Graph</h1>
                <a href="https://github.com/mcserep/tarkov-graph" target="_blank" className="github-logo">
                    <img
                        src={`${import.meta.env.BASE_URL}/github.png`}
                        alt="GitHub"
                        style={{width: '20px', height: '20px', marginRight: '5px'}}
                    />
                    https://github.com/mcserep/tarkov-graph
                </a>
            </header>
            <main>
                <TarkovGraph/>
            </main>
        </>
    )
}

export default App
