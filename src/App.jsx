import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import 'github-markdown-css';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css'

function App() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const submitQuery = async () => {
    setAnswer('');
    setLoading(true);

    const API_KEY = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const chat = await model.generateContent([query, 'with markdown format'])
    
    setAnswer(chat.response.text())
    setLoading(false);
    setQuery('');
  }

  return (
    <>
      <h1>Gemini Pro App</h1>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0 10px' }}>
        <input type="text" name='query' style={{ padding: '0.6em 1.2em' }} placeholder='write your query' value={query} onChange={e => setQuery(e.target.value)} disabled={loading} />
        <button type='button' onClick={submitQuery} disabled={loading}>
          search
        </button>
      </div>
      {answer && <div className="card markdown-body" style={{ textAlign: 'left', marginTop: 30, borderRadius: 20 }}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        children={answer}
        components={{
          code(props) {
            const {children, className, node, ...rest} = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={dracula}
              />
            ) : (
              <code {...rest} className={className}>
                {children}
              </code>
            )
          }
        }}
       />
      </div>}
    </>
  )
}

export default App
