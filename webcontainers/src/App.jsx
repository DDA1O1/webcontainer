// Import necessary React hooks and WebContainer API
import { useState, useEffect } from 'react'
import { WebContainer } from '@webcontainer/api'

function App() {
  // State management
  const [webcontainerInstance, setWebcontainerInstance] = useState(null)  // Store WebContainer instance
  const [code, setCode] = useState('console.log("Welcome to Code Playground!");')  // User's code input
  const [output, setOutput] = useState('')  // Execution output
  const [loading, setLoading] = useState(true)  // Loading state during initialization

  // Initialize WebContainer on component mount
  useEffect(() => {
    async function init() {
      try {
        const webcontainer = await WebContainer.boot()
        setWebcontainerInstance(webcontainer)
      } catch (error) {
        console.error('Runtime initialization error:', error)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // Handle code execution
  async function handleRunCode() {
    if (!webcontainerInstance) return
    setOutput('Executing...\n')
    
    try {
      // Write code to virtual filesystem and execute
      await webcontainerInstance.fs.writeFile('/index.js', code)
      const process = await webcontainerInstance.spawn('node', ['index.js'])
      
      // Stream output to UI
      process.output.pipeTo(new WritableStream({
        write(data) {
          setOutput(prev => prev + data + '\n')
        }
      }))
    } catch (error) {
      setOutput('Error: ' + error.message)
    }
  }

  // UI Layout
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-b border-gray-700 p-4">
        <h1 className="text-xl font-bold">JavaScript Playground</h1>
      </nav>
      
      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Code Editor Section */}
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg shadow-lg">
              {/* Run Button */}
              <div className="flex items-center justify-between p-3 border-b border-gray-700">
                <button 
                  onClick={handleRunCode}
                  disabled={loading}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium
                    ${loading 
                      ? 'bg-gray-700 text-gray-400' 
                      : 'bg-green-600 hover:bg-green-700 text-white'}`}
                >
                  {loading ? 'Initializing...' : '▶ Run'}
                </button>
              </div>
              {/* Code Input Area */}
              <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[500px] p-4 bg-gray-800 text-gray-100 font-mono resize-none focus:outline-none"
                placeholder="Enter your JavaScript code here..."
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