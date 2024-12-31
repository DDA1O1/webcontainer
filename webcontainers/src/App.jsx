import { useState, useEffect } from 'react'
import { WebContainer } from '@webcontainer/api'

function App() {
  const [webcontainerInstance, setWebcontainerInstance] = useState(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function startWebContainer() {
      try {
        const instance = await WebContainer.boot()
        setWebcontainerInstance(instance)
      } catch (error) {
        console.error('WebContainer boot error:', error)
        setOutput('Welcome to WebContainer Playground!')
      } finally {
        setLoading(false)
      }
    }
    startWebContainer()
  }, [])

  async function handleRunCode() {
    if (!webcontainerInstance) return
    try {
      setOutput('Executing...\n')
      await webcontainerInstance.fs.writeFile('/index.js', code)
      const process = await webcontainerInstance.spawn('node', ['index.js'])
      
      process.output.pipeTo(new WritableStream({
        write(data) {
          setOutput(prev => prev + data + '\n')
        }
      }))
    } catch (error) {
      setOutput('Error: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-xl font-bold">WebContainer Playground</h1>
      </nav>
      
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editor Section */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg shadow-lg">
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <h2 className="text-sm font-semibold">index.js</h2>
                <button 
                  onClick={handleRunCode}
                  disabled={!webcontainerInstance || loading}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium
                    ${!webcontainerInstance || loading 
                      ? 'bg-gray-700 text-gray-400' 
                      : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {loading ? 'Initializing...' : '▶ Run'}
                </button>
              </div>
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[500px] p-4 bg-gray-800 text-gray-100 font-mono 
                          resize-none focus:outline-none"
                placeholder="Enter your code here..."
              ></textarea>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg shadow-lg">
              <div className="p-3 border-b border-gray-700">
                <h2 className="text-sm font-semibold">Output</h2>
              </div>
              <pre className="w-full h-[500px] p-4 font-mono text-sm overflow-auto
                            bg-gray-800 text-gray-300">
                {output || 'Output will appear here...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App