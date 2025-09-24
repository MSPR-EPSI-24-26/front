export default function DebugPage() {
  const testCORS = async () => {
    try {
      // Test simple GET first
      const response = await fetch('https://customers.payetonkawa.shop/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('GET /health status:', response.status);
      console.log('GET /health headers:', Object.fromEntries(response.headers.entries()));
      
      // Test OPTIONS request (preflight)
      const optionsResponse = await fetch('https://customers.payetonkawa.shop/auth/register', {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
          'Origin': window.location.origin,
        },
      });
      
      console.log('OPTIONS /auth/register status:', optionsResponse.status);
      console.log('OPTIONS /auth/register headers:', Object.fromEntries(optionsResponse.headers.entries()));
      
      // Test actual POST
      const postResponse = await fetch('https://customers.payetonkawa.shop/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'test123',
          firstName: 'Test',
          lastName: 'User',
          address: 'Test Address',
          city: 'Test City',
          postalCode: '12345',
          country: 'France'
        }),
      });
      
      console.log('POST /auth/register status:', postResponse.status);
      console.log('POST /auth/register headers:', Object.fromEntries(postResponse.headers.entries()));
      
      if (!postResponse.ok) {
        const errorText = await postResponse.text();
        console.log('POST /auth/register error:', errorText);
      }
      
    } catch (error) {
      console.error('CORS Test Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Debug CORS
        </h1>
        
        <button 
          onClick={testCORS}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Test CORS
        </button>
        
        <div className="text-sm text-gray-600 space-y-2">
          <p><strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
          <p><strong>Target API:</strong> https://customers.payetonkawa.shop</p>
          <p className="text-yellow-600">Ouvrez la console pour voir les résultats</p>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded text-sm">
          <h3 className="font-medium mb-2">Erreurs CORS courantes :</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>Missing Access-Control-Allow-Origin header</li>
            <li>Preflight OPTIONS request failure</li>
            <li>Wrong Access-Control-Allow-Methods</li>
            <li>Missing Access-Control-Allow-Headers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}