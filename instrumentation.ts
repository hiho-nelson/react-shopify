export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side instrumentation
    console.log('🚀 [Instrumentation] Server started at', new Date().toISOString());
    
    // Add any server-side monitoring, logging, or analytics here
    // This runs after the server has started
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime instrumentation
    console.log('🌐 [Instrumentation] Edge runtime started at', new Date().toISOString());
  }
}
